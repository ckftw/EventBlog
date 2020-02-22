const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type: String
    },
    evenDate:{
        type: Date,
        required: true
    },
    cost:{
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        required:true,
        default: Date.now
    },
    coverImageName:{
        type:String,
        required: true
    },

    location:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Location'

    }

})


module.exports = mongoose.model('Event' , eventSchema)