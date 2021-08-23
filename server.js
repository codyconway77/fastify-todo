const fastify = require('fastify')({logger: true})
fastify.register(require('./plugins/db-connector'))
fastify.register(require('./plugins/session'))
fastify.register(require('fastify-swagger'), {
    exposeRoute: true,
    routePrefix: '/docs',
    swagger: {
        info: {
            title: 'fastify-api'
        },
    }
})
//fastify.register(require('./controllers/todosController'))
fastify.register(require('./routes/todos'))
fastify.register(require('./routes/users'))
const PORT = process.env.NODE_ENV === 'production' ? POSTGRES_URI : 8000

fastify.get('/', async (req, reply) => {
    return { hello: 'world' }
})

const start = async () => {
    try {
        await fastify.listen(PORT);
        console.log(fastify.session)     
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
}
start()