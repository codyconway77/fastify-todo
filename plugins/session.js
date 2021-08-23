const fp = require('fastify-plugin')
const pgSessionStore = require('connect-pg-simple')
const cookie = require('fastify-cookie')
const session = require('@fastify/session')

const appSession = async (fastify) => {
    const SessionStore = pgSessionStore(session)

    fastify.register(cookie)
    fastify.register(session, {
        store: new SessionStore({
            tableName: 'user_sessions',
            pool: fastify.db.client
        }),
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development'
        }
    })
}

module.exports = fp(appSession, { dependencies: ['db']})