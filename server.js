if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const indexRouter = require('./routes/index')
const mongoose = require('mongoose')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(expressLayout)
app.use(express.static('public'))
app.use('/', indexRouter)
app.listen(process.env.PORT || 3000)

mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true})
const db = mongoose.connection
db.on('error', error=> console.log(error))
db.once('open', ()=> console.log(('connected to mongoose')))