const express = require("express");
const router = express.Router();
const path = require("path");
const Event = require("../models/event.js");
const fs = require("fs");
const Location = require("../models/location");
const uploadPath = path.join("public", Event.coverImageBasePath);
const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const multer = require("multer");
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});

//All Events route
router.get("/", async (req, res) => {
    let query = Event.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title' , new RegExp(req.query.title, 'i'))
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
router.post("/", upload.single("cover"), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    const event = new Event({
        title: req.body.title,
        location: req.body.location,
        evenDate: new Date(req.body.evenDate),
        cost: req.body.cost,
        coverImageName: fileName,
        description: req.body.description
    });
    try {
        const newEvent = await event.save();
        res.redirect(`events`);
    } catch {
        if (event.coverImageName != null) {
            removeEventCover(event.coverImageName);
        }
        renderNewPage(res, event, true);
    }
});
function removeEventCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err);
    });
}
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
module.exports = router;
