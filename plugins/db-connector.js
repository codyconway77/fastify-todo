const fastifyPlugin = require('fastify-plugin')
const { Client } = require('pg')
require('dotenv').config()
const client = new Client({
    user: 'postgres',
    password: process.env.PASSWORD,
    host: 'localhost',
    port: 5432,
    database: 'postgres'
})

async function dbConnector (fastify, options) {
    try {
        await client.connect()
        console.log('db connected succesfully')
        fastify.decorate('db', {client})
    } catch (error) {
        console.error(error)
    }
}

module.exports = fastifyPlugin(dbConnector, { name: 'db' })