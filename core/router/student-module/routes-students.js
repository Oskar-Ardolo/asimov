const DB = require('../../classes.js');
const Logs = require('../../../Logs/js/log.js');
const Notif = require('../../../notification/js/notif.js');

// Database
const db = require('../../database_connect');

// Middlewares
const fs = require('fs');
const app = require('express');
const router = app.Router();

router.use((req, res, next) => {
    if(req.session.rang === 1) {
        next();
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/home");
    }
});

// GET

router.get("/notes", async (req, res) => {
    if (req.session.rang == 1) {
        let notes = await DB.getNotesByIdUser(req.session.user[0].id)
        console.log(notes)
        res.render("user/notes.ejs", { client : req.session.user, notes : notes})
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/home");
    }
});

// POST

module.exports = router;