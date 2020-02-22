const express = require('express')
const router = express.Router()
const Event = require('../models/event.js')
const Location = require('../models/location')

//All Events route
router.get('/', async (req, res) => {
    res.send('All Events')
})

//New Event route
router.get('/new', async (req, res) => {
    try{
        const locations = await Location.find({})
        const event = new Event()
        res.render('events/new', {
            location: locations,
            event: event
        })
    } catch{
        res.redirect('/events')
    }   
})

//Create Event
router.post('/', async (req, res) => {
    res.send('Create Event')
    
})




module.exports = router