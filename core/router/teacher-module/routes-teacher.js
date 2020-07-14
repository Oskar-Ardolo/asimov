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
    if(req.session.rang === 5) {
        next();
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/home");
    }
});

router.route("/notes")
        // Get tests
    .get(async (req, res) => {
        try {

            let control = await DB.getControlByIdProf(req.session.user[0].id);
            let classes = await DB.getUsersByIdProf(req.session.user[0].id);
            let matiere = await DB.getMatieresForOneProf(req.session.user[0].id);
            
            res.render('prof/notes.ejs', {client : req.session.user, classes : classes, control : control, matiere : matiere});
            
        } catch (err) {
            console.log(err);
            res.redirect("/home");
        }
    })
        // Add tests
    .post(async (req, res) => { 
            await DB.addControl(JSON.parse(req.body.data_ds), req.session.user[0].id)
                .then(() => res.redirect("/prof/notes"))
                .catch((err) => console.log(err));
    });


router.route("/notes/:id")
    .get( async (req, res) => {
            try {
                let control = await DB.getControlByIdProf(req.session.user[0].id);
                let classes = await DB.getUsersByIdProf(req.session.user[0].id);
                let matiere = await DB.getMatieresForOneProf(req.session.user[0].id);
                
                await DB.verifyExistingDSforProf(req.params.id, req.session.user[0].id)
                    .then( async (result) => {
                        if (result.length > 0) {
                            let data_control = await DB.getDataControlById(req.params.id);
                            res.render('prof/notes.ejs', {client : req.session.user, classes : classes, control : control , data_control : data_control, index : req.params.id, matiere : matiere});
                        } else {
                            res.render('prof/notes.ejs', {client : req.session.user, classes : classes, control : control, matiere : matiere});
                        }
                    })
                    .catch((err) => console.log(err));
                
            } catch (err) {
                console.log(err);
                res.redirect("/home");
            }
    })

    .put( async (req, res) => {
            await DB.update_DS(JSON.parse(req.body.data_header), JSON.parse(req.body.data_body), req.params.id)
                .then(() => res.redirect("/prof/notes"))
                .catch((err) => console.log(err));
    })

    .delete(async (req, res) => {
            // VERIFY IF THIS TEACHER CAN DELETE THIS CONTROL
            await DB.verifyProfAndDS(req.params.id)
                .then( async (result) => {
                    if (result[0].id_prof == req.session.user[0].id) {
                        await DB.delete_ds(req.params.id)
                            .then(() => res.send(true))
                            .catch((err) => res.send(err));
                    }
                })
                .catch((err) => res.send(err));
    });

module.exports = router;