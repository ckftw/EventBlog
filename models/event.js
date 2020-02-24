const mongoose = require('mongoose')
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
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType:{
        type:String,
        required:true
        
    },

    location: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Location'

    }

})

eventSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64, ${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Event', eventSchema)