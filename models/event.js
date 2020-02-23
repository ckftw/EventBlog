const mongoose = require('mongoose')
const coverImageBasePath = 'uploads/bookCovers'
const path = require('path')
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    evenDate: {
        type: Date,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },

    location: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Location'

    }

})

eventSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName != null){
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Event', eventSchema)
module.exports.coverImageBasePath = coverImageBasePath