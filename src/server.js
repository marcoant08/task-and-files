const express = require('express')
const routes = require('./routes')
const morgan = require('morgan')
const path = require('path')
var cors = require('cors')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
app.use(morgan('dev'))

app.use(routes)

app.listen(process.env.PORT || 3333)