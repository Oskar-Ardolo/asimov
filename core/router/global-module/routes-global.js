const DB = require('../../classes.js');
const Logs = require('../../../Logs/js/log.js');
const Notif = require('../../../notification/js/notif.js');

// Database
const db = require('../../database_connect');

// Middleware
const fs = require('fs');
const app = require('express');
const router = app.Router();

router.get("/", async (req, res) => {
    let NotifModel = new Notif({bool : false});
    let notification = req.session.notif;
  
    if(req.session.login) {
        res.render("index.ejs", { client : req.session.user });
    } else {
        // Notification
        req.session.notif = await NotifModel.gettoast();
        res.render("login.ejs", {notification : notification});
    }
});
router.get("/home", async (req, res) => {
    let NotifModel = new Notif({bool : false});
    let notification = req.session.notif;
  
    if(req.session.login) {
        res.render("index.ejs", { client : req.session.user });
    } else {
        // Notification
        req.session.notif = await NotifModel.gettoast();
        res.render("login.ejs", {notification : notification});
    }
});
router.get("/faq", (req, res) => {
    res.render("faq.ejs");
});


router.get("/profil", async (req, res) => {
    if (req.session.login) {
        let data = await DB.getUserByPseudo(req.session.pseudo);
        console.log(data);
        res.render("profil.ejs", {data : data[0], client : req.session.user});
    } else res.redirect("/home");
});

router.get("/parameters", async (req, res) => {
    if (req.session.login) {
        res.render("parameters.ejs", { client : req.session.user });
      } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/home");
      }
});

router.get("/discussions", async (req, res) => {
    if (req.session.login) {
          let allconverse = await DB.getAllDiscussionById(req.session.user[0].id);
          //console.log(allconverse);
          res.render("messages.ejs", {allconverse : allconverse, client : req.session.user});
    } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
    }
});

router.post('/postMessage', async (req, res) => {
    if (req.session.login) {
        console.log("ça marche");
        if (req.body.msg) {
            await DB.addNewMessage(1, req.session.user[0].id, msg);
            let lastmsg = await DB.getLastMessageOfUser(req.session.user[0].id, 1);
            res.send({newmsg : lastmsg[0].content});
        } else res.send({newmsg : ""});
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/home");
    }
});

module.exports = router;