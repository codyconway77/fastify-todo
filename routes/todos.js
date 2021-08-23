const { v4: uuidv4 } = require('uuid')
const { isLoggedIn } =require('../middleware/isLoggedIn')

// Options for get all todos
const getTodosOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                todos: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        completed: { type: 'boolean' }
                    }
                }
            }
        },
    },
    //handler: getTodos,
}

const getTodoOpts = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'integer' }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    completed: { type: 'boolean' }
                }
            }
        }
    }
}

const addTodo = {
    preHandler: isLoggedIn,
    schema: {
        body: {
            type: 'object',
            required: ['title'],
            properties: {
                title: { type: 'string' },
                description: { type: 'string' }
            }
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    completed: { type: 'boolean' }
                }
            }
        }
    }
}

const updateTodo = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'integer' }
            }
        },
        body: {
            type: 'object',
            properties: {
                title: { type: 'string'},
                description: { type: 'string'}
            }
        },
        response: {
            204: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    }
}

const deleteTodo = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'integer' }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    }
}

async function todosRoutes (fastify, options, done) {
    const client = fastify.db.client
    fastify.get('/todos', getTodosOpts, async (req, reply) => {
        try {
            const {rows} = await client.query('SELECT * FROM public.todos')
            console.log(rows)
            reply.send(rows)
        } catch (error) {
            console.error(error)
        }
    })

    fastify.get('/todos/:id', getTodoOpts,  async (req, reply) => {
        const { id } = req.params
        const query = {
            text: `SELECT * FROM public.todos WHERE id = $1`,
            values: [ id ]
        }
        try {
            const { rows } = await client.query(query)
            console.log(rows[0])
            reply.send(rows[0])
        }
        catch (error) {
            console.error(error)
        }
    })

    fastify.post('/todos', addTodo, async (req, reply) => {
        const { title, description } = req.body
        console.log(req.session)
        const fkUser = req.user
        const id = Math.floor(Date.now() * Math.random() / 1000)
        const completed = false
        const query = {
            text: `INSERT INTO todos (id, title, description, completed, fk_user)
            VALUES($1, $2, $3, $4, $5) RETURNING *`,
            values: [id, title, description, completed, fkUser],
        }
        try {
            const {rows} = await client.query(query)
            console.log(rows[0])
            reply.code(201).send(rows[0])
        } catch (error) {
            console.error(error)
        }
    })

    fastify.patch('/todos/:id', updateTodo, async (req, reply) => {
        const { id } = req.params
        const { title, description, completed } = req.body
        const query = {
            text: `UPDATE public.todos SET 
            title = COALESCE($1, title),
            description = COALESCE($2, description),
            completed = COALESCE($3, completed)
            WHERE id = $4 RETURNING *`,
            values: [title, description, completed, id]
        }
        try {
            const {rows} = await client.query(query)
            console.log(rows[0])
            reply.code(204).send({ message: `Todo with id of ${id} has been updated.`})
        }
        catch (error) {
            console.error(error)
        }
    })

    fastify.delete('/todos/:id', deleteTodo, async (req, reply) => {
        const { id } = req.params
        const query = {
            text: `DELETE FROM todos WHERE id = $1`,
            values: [ id ]
        }
        try {
            const {rows} = await client.query(query)
            console.log(rows[0])
            reply.code(200).send({ message: `Deleted todo with id of ${id}` })
        }
        catch (error) {
            console.error(error)
        }
    })

    done()
}

module.exports = todosRoutes