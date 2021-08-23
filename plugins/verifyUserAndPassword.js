// const { default: fastify } = require('fastify')
// const fastifyPlugin = require('fastify-plugin')

// fastify.register(require('fastify-auth'))
// fastify.addHook('preHandler', fastify.auth(async (req, reply) => {
//     const { username, password } = req.body
//     const query = {
//         text: `SELECT hashed_password FROM users WHERE (username = username) VALUES ($1)`,
//         values: [username]
//     }
//     try {
//         const hashedDbPassword = await client.query(query)
//         console.log(hashedDbPassword)
//         const isAuth = bcrypt.compareSync(password, hashedDbPassword)
//         console.log(isAuth)
//         reply.code(200).send({ message: 'user is authorized'})
//     }
//     catch (error) {
//         console.error(error)
//     }
//     //validation logic
//     done() //pass an error if the authentication fails
// }))

// const verifyUserAndPassword = async function (req, reply, done) {
//     const { username, password } = req.body
//     const query = {
//         text: `SELECT hashed_password FROM users WHERE (username = username) VALUES ($1)`,
//         values: [username]
//     }
//     try {
//         const hashedDbPassword = await client.query(query)
//         console.log(hashedDbPassword)
//         const isAuth = bcrypt.compareSync(password, hashedDbPassword)
//         console.log(isAuth)
//         reply.code(200).send({ message: 'user is authorized'})
//     }
//     catch (error) {
//         console.error(error)
//     }
//     //validation logic
//     done() //pass an error if the authentication fails
// }


// fastify.register('verifyUserAndPassword', async function (req, reply, done) {
//     const { username, password } = req.body
//     const query = {
//         text: `SELECT hashed_password FROM users WHERE (username = username) VALUES ($1)`,
//         values: [username]
//     }
//     try {
//         const hashedDbPassword = await client.query(query)
//         console.log(hashedDbPassword)
//         const isAuth = bcrypt.compareSync(password, hashedDbPassword)
//         console.log(isAuth)
//         reply.code(200).send({ message: 'user is authorized'})
//     }
//     catch (error) {
//         console.error(error)
//     }
//     //validation logic
//     done() //pass an error if the authentication fails
// }).register(require('fastify-auth'))
// .after(() => {
//     fastify.route({
//         method: 'POST',
//         options: loginUser,
//         url: '/users/login',
//         preHandler: fastify.auth([fastify.verifyUserAndPassword]),
//         handler: (req, reply) => {
//             req.log.info('Auth route')
//             reply.send({ hello: 'world' })
//         }
//     })
// })

// module.exports = fastifyPlugin(verifyUserAndPassword)