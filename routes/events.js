const express = require("express");
const router = express.Router();
const Event = require("../models/event.js");
const Location = require("../models/location");
const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

//All Events route
router.get("/", async (req, res) => {
    let query = Event.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    try {
        const event = await query.exec()
        res.render("events/index", {
            event: event,
            searchOptions: req.query
        });
    } catch {
        res.redirect("/");
    }
});

//New Event route
router.get("/new", async (req, res) => {
    renderNewPage(res, new Event());
});

//Create Event
router.post("/", async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    const event = new Event({
        title: req.body.title,
        location: req.body.location,
        evenDate: new Date(req.body.evenDate),
        cost: req.body.cost,
        description: req.body.description
    });

    saveCover(event, req.body.cover)
    try {
        const newEvent = await event.save();
        res.redirect(`events`);
    } catch {
        renderNewPage(res, event, true);
    }
});

//SHOW EVENTS

router.get('/:id', async(req,res)=>{
    try{
        const event = await Event.findById(req.params.id).populate('location').exec()
        res.render('events/show', {event:event})
    }catch{
        res.redirect('/')
    }
})

//edit events



async function renderNewPage(res, event, hasError = false) {
    try {
        const location = await Location.find({});
        const params = {
            location: location,
            event: event
        };
        if (hasError) params.errorMessage = "Error creating event";
        res.render("events/new", params);
    } catch {
        res.redirect("/events");
    }
}

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type

    }
}
module.exports = router;
