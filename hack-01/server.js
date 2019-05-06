const express = require('express')
const logger = require('morgan')
const app = express()
const { siteRouter } = require('./routes/websites');

const PORT = 3000

app.use(logger('dev'))

app.use('/', siteRouter)

app.get('/', (req, res) => res.send({msg: 'hello world'}))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
