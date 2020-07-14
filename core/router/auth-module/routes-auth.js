const DB = require('../../classes.js');
const Logs = require('../../../Logs/js/log.js');
const Notif = require('../../../notification/js/notif.js');


// Middlewares
const crypto = require('crypto');
const app = require('express');
const router = app.Router();


// Functions
const getdate = () => {
    let day = new Date();
    return `${day.getDate()}-${(day.getMonth() + 1)}-${day.getFullYear()}`;
  }
  
const gethours = () => {
    let day = new Date();
    let h = day.getHours();
    let min = day.getMinutes();
    if (h < 10) h = "0"+h;
    if (min < 10) min = "0" + min;
    return h +":"+ min;
  }

// Routing
router.route("/login")
  .get(async (req, res) => {
      let NotifModel = new Notif({bool : false});
      let notification = req.session.notif;
    
      if(req.session.login) {
          res.redirect('/');
      } else {
          // Notification
          req.session.notif = await NotifModel.gettoast();
          res.render("login.ejs", {notification});
      }
  })

  .post( async (req, res) => {
    let pseudo = req.body.pseudo;
    let password = crypto.createHmac('sha256', req.body.password)
                  .update('jojofags suck')
                  .digest('hex');
      let NotifModel = new Notif();
      try {
        let action = "Connexion";
        let userLogin = await DB.login(pseudo, password);
        if(userLogin.length != 0) {
              req.session.login = true;
              req.session.rang = userLogin[0].rang;
              req.session.pseudo = pseudo;
              req.session.user = await DB.getUserByPseudo(req.session.pseudo);
              console.log(req.session.user);
            if(userLogin[0].rang >= 5) {
                  // Write logs
                  let idlog = await Logs.getIdLog(pseudo, getdate());
                  let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours()};
                  Logs.writeLog(data, getdate(), pseudo);

                  // Notifcation
                  NotifModel = new Notif({bool : true, type : "success", message : "Connexion successful"});
                  req.session.notif = await NotifModel.gettoast();
                  
                  res.redirect("/"); 
            } else {
              res.redirect("/home");
            }
        } else {
              // Notifcation
              NotifModel = new Notif({bool : true, type : "error", message : "Identifiant ou mot de passe incorrect"});
              req.session.notif = await NotifModel.gettoast();

            res.redirect("/home");
          }
      }
      catch (err) {

        let description = err.toString();
        let action = "Connexion failed";
        // Write error logs
        let idlog = await Logs.getIdLog(pseudo, getdate());
        let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{ "Error message" : description }]};
        Logs.writeLog(data, getdate(), pseudo);

        // Notifcation
        NotifModel = new Notif({bool : true, type : "error", message : "La connexion a échoué"});
        req.session.notif = await NotifModel.gettoast();
      
        res.redirect("/home");
      }
  });

router.get("/logout", (req, res) => {
  req.session.login = false;
  res.redirect("/");
});

module.exports = router;