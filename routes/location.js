const express = require('express')
const router = express.Router()
const Location = require('../models/location')

//All location events
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const locations = await Location.find(searchOptions )
        res.render('locations/index', { 
            locations: locations,
            searchOptions: req.query
        })
    }
    catch{
        res.redirect('/')
    }
})

//New Location event
router.get('/new', (req, res) => {
    res.render('locations/new', {
        location: new Location()
    })
})
//Create location
router.post('/', async (req, res) => {
    const location = new Location({
        name: req.body.name
    })
    try {
        const newLocation = await location.save()
        //res.redirect(`locations/${newLocation.id}`)
        res.redirect(`locations`)
    } catch{
        let locals = { errorMessage: `something went wrong` }
        res.render('locations/new', {
            location: location, locals
        })
    }
})




module.exports = router
