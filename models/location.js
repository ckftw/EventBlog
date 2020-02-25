const mongoose = require('mongoose')
const Event = require('./event')
//create schema
const locationScema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

locationScema.pre('remove', function(next) {
    Event.find({ location: this.id }, (err, events) => {
      if (err) {
        next(err)
      } else if (events.length > 0) {
        next(new Error('This Location has Events still'))
      } else {
        next()
      }
    })
  })
module.exports = mongoose.model('Location', locationScema) //location is name of table in db