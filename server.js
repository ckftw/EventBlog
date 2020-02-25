if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const indexRouter = require('./routes/index')
const locationRouter = require('./routes/location')
const eventRouter = require('./routes/events')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(methodOverride('_method'))
app.use(expressLayout)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '20mb', extended:false}))

app.use('/', indexRouter)
app.use('/locations', locationRouter)
app.use('/events', eventRouter)


app.listen(process.env.PORT || 3000)
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true})
const db = mongoose.connection
db.on('error', error=> console.log(error))
db.once('open', ()=> console.log(('connected to mongoose')))