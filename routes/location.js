const express = require('express')
const router = express.Router()
const Location = require('../models/location')
const Event = require('../models/event')

//All location events
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const locations = await Location.find(searchOptions)
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
//-----------------Create location------------------------------------------
router.post('/', async (req, res) => {
    const location = new Location({
        name: req.body.name
    })
    try {
        const newLocation = await location.save()
        res.redirect(`locations/${newLocation.id}`)
    } catch{
        let locals = { errorMessage: `something went wrong` }
        res.render('locations/new', {
            location: location, locals
        })
    }
})

//----------SHOW EVENTS BY LOCATION--------------------------------------

router.get('/:id', async (req, res) => {
    try {
      const location = await Location.findById(req.params.id)
      const events = await Event.find({ location: location.id }).exec()
      res.render('locations/show', {
        location: location,
        eventsByLocation: events
      })
    } catch(err) {
        console.log(err)
      res.redirect('/')
    }
  })

//----------------------EDIT LOCATION-----------------------------------------------

router.get('/:id/edit', async (req, res) => {
    try {
        const location = await Location.findById(req.params.id)
        res.render('locations/edit', { location: location })
    } catch{
        res.redirect('/locations')
    }

})

//-------------------------UPDATE LOCATION---------------------------

router.put('/:id', async (req, res) => {
    let location
    try {
        location = await Location.findById(req.params.id)
        location.name = req.body.name
        await location.save()
        res.redirect(`/locations/${location.id}`)

    } catch{
        if (location == null) {
            res.redirect('/')
        }
        else {
            res.render('locations/edit', {
                location: location,
                errorMessage: 'Error updating location'
            }
            )
        }
    }
})

//---------------------------------DELETE LOCATION-----------------------------------
router.delete('/:id', async (req, res) => {
    let location
    try {
        location = await Location.findById(req.params.id)
        await location.remove()
        res.redirect('/locations')
    } catch{
        if (location == null) {
            res.redirect('/')
        }
        else {
            res.redirect(`/locations/${location.id}`)
        }
    }
})

module.exports = router
