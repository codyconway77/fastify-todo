// const fastify = require('fastify')({logger: true})
// fastify.register(require('../db-connector'))

// const getTodos = async (fastify, req, reply) => {
//     const client = fastify.db.client
//     try {
//         const {rows} = await client.query('SELECT * FROM public.todos')
//         console.log(rows)
//         reply.send(rows)
//     } catch (error) {
//         console.error(error)
//     }
// }

// module.exports = getTodos