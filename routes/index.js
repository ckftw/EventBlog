const express = require('express')
const router=express.Router()
const Event = require('../models/event')
router.get('/',async (req,res)=>{
    let events
    try{
        events = await Event.find().limit(20).exec()
    } catch{
        events=[]
    }
    res.render('index' ,{events: events})
})


module.exports= router