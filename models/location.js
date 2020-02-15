const mongoose = require('mongoose')

//create schema
const locationScema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Location', locationScema) //location is name of table in db