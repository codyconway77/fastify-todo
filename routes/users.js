const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const { isLoggedIn } = require('../middleware/isLoggedIn')

const addUser = {
    schema: {
        body: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
                username: { type: 'string' },
                password: { type: 'string' }
            }
        }
    }
}

const loginUser = {
    body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
            username: { type: 'string' },
            password: { type: 'string' }
        }
    }
}

async function usersRoutes (fastify, options, done) {
    const client = fastify.db.client

    fastify.post('/users/signup', addUser, async (req, reply) => {
        const { username, password } = req.body
        const hashed =  await bcrypt.hash(password, 10)
        const id = uuidv4()
        console.warn(hashed)
        const query = {
            text:`INSERT INTO users (id, username, hashed_password) VALUES ($1, $2, $3) RETURNING *`,
            values: [id, username, hashed]
        }
        try {
            const rows = await client.query(query)
            console.log(rows[0])
            reply.code(201).send({ message: 'user created'})
        } catch (error) {
            console.error(error)
        }
    })

    fastify.decorate('verifyUserAndPassword', async (req, reply, done) => {
        const { username, password } = req.body
        const query = {
            text: `SELECT id, hashed_password FROM users WHERE username = $1`,
            values: [username]
        }
        try {
            const { rows } = await client.query(query)
            const hashedDbPassword = rows[0].hashed_password
            console.log(hashedDbPassword)
            console.log(rows[0].id)
            let isAuth = false
            isAuth = await bcrypt.compareSync(password, hashedDbPassword)
            console.log(isAuth)
            console.log(req.session)
            if (isAuth) { 
                console.log(rows[0].id)
                req.session.userId = rows[0].id
            }    
            done()
        }
        catch (error) {
            console.error(error)
        }
        //validation logic
        done( new Error('Authentication failed') ) //pass an error if the authentication fails
    }).register(require('fastify-auth'))
    .after(() => {
        fastify.route({
            method: 'POST',
            schema: loginUser,
            url: '/users/login',
            preHandler: fastify.auth([fastify.verifyUserAndPassword]),
            handler: async (req, reply) => {
                console.log(req.session)
                const userId = req.session.userId
                req.session.isLoggedIn = true
                const user = await client.query(
                    `SELECT id, username FROM users WHERE id = $1`,
                    [userId]
                )
                reply.code(200).send(user.rows[0])
                req.log.info('Auth route')
            }
        })
    })

    fastify.get('/users', async (req, reply) => {
        try {
            const { rows } = await client.query(`SELECT * FROM users`)
            console.log(rows)
            reply.code(200).send(rows)
        }
        catch (error) {
            console.error(error)
        }
    })

    fastify.get('/me', { preHandler: isLoggedIn }, async (req, reply) => {
        try {
            console.log(req)
            const userId = req.user
            const user = await fastify.db.query(
                `SELECT id, username FROM users WHERE id = $1`,
                [userId]
            )
            reply.code(200).send(user)
        }
        catch (error) {
            console.error(error)
        }
    })
    done()
}



module.exports = usersRoutes