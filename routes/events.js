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
        res.redirect(`events/${newEvent.id}`);
    } catch {
        renderNewPage(res, event, true);
    }
});

//UPDATE
router.put("/:id", async (req, res) => {
    let event
    try {
        event =await Event.findById(req.params.id)
        event.title=req.body.title
        event.location=req.body.location
        event.evenDate= new Date(req.body.evenDate)
        event.cost=req.body.cost
        event.description = req.body.description
        if(req.body.cover!=null && req.body.cover!==''){
            saveCover(event, req.body.cover)
        }
        await event.save()
        res.redirect(`events/${event.id}`);
    } catch {
        if(event!== null){
            renderEditPage(res, event, true);
        }else{
            res.redirect('/')
        }
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
router.get('/:id/edit', async (req, res) => {
    try {
      const event = await Event.findById(req.params.id)
      renderEditPage(res, event)
    } catch {
      res.redirect('/')
    }
  })

  //delete events
  router.delete('/:id', async (req, res) => {
    let event
    try {
      event = await Event.findById(req.params.id)
      await event.remove()
      res.redirect('/events')
    } catch {
      if (event != null) {
        res.render('events/show', {
          event: event,
          errorMessage: 'Could not remove event'
        })
      } else {
        res.redirect('/')
      }
    }
  })

async function renderNewPage(res, event, hasError = false) {
    renderFormPage(res,event,'new',hasError)
}

async function renderEditPage(res, event, hasError = false) {
    renderFormPage(res, event, 'edit', hasError)
  }

async function renderFormPage(res,event,form , hasError=false){
    try {
        const location = await Location.find({});
        const params = {
            location: location,
            event: event
        };
        if(hasError){
            if(form == 'edit'){
                params.errorMessage = "Error updating book"
            }
            else{
                params.errorMessage = "Error creating event";
            }
        }
       
        res.render(`events/${form}`, params);
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
