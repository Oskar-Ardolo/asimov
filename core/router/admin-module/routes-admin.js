const DB = require('../../classes.js');
const Logs = require('../../../Logs/js/log.js');
const Notif = require('../../../notification/js/notif.js');

// Database
const db = require('../../database_connect');

// Middlewares
const fs = require('fs');
const app = require('express');
const router = app.Router();

// Functions
const cap = (s) => {
    if (typeof s !== 'string') return '';
    return s.toLowerCase().charAt(0).toUpperCase() + s.slice(1);
}
  
const double = (nom, prenom, pseudo, db) => {
    return new Promise( async (resolve, reject) => {
        try {
            let value = await DB.getUserDuplicate(nom, prenom, pseudo);
            for (let items in value) {
                if (value[items]) {
                    return resolve(true)
                }
            }
            return resolve(false);
        }
        catch (err) {
            reject(err)
        }
    });
}

const verifier = (dataOne, dataOneVar, dataTwo) => {
    for (i=0;i<dataOne.length;i++) {
        if (eval(dataOneVar) == dataTwo)  return true;
    }
    return false;
}

// Middleware
router.use((req, res, next) => {
    if(req.session.rang === 10) {
        next();
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/home");
    }
});

// GET
router.get("/", async (req, res) => {
        let NotifModel = new Notif({bool : false});
        let notification = req.session.notif;
        let userCount = await DB.userCount();
        let profCount = await DB.profCount();
        let classeCount = await DB.classeCount();
        let matiereCount = await DB.matiereCount();
        req.session.notif = await NotifModel.gettoast();
        res.render("admin/admin.ejs", {counts : [userCount, profCount, classeCount, matiereCount], notification : notification, client : req.session.user });
});
    
router.get("/users", async (req, res) => {
    if(req.session.rang >= 5) {
        let NotifModel = new Notif({bool : false});
        let notification = req.session.notif;
		
        let users = await DB.getUsers();
        let classes = await DB.getClasses();

        // Notification
        req.session.notif = await NotifModel.gettoast();
		res.render("admin/users.ejs", {data : users, classe : classes, notification : notification, client : req.session.user});
		
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home");
	}
});

router.get("/users/edit/:ideleve", async (req, res) => {
    if(req.session.rang == 10) {
        let NotifModel = new Notif({bool : false});
        let notification = req.session.notif;
          let users = await DB.getUserById(req.params.ideleve);
          let classes = await DB.getClasses();
          let classeofuser = await DB.getUserClasseFromId(req.params.ideleve);
          // If user doesn't have class
          if (classeofuser[0] == null) {
            classeofuser = [{ nomclasse : ''}];
          }
          req.session.notif = await NotifModel.gettoast();
          res.render("admin/edituser.ejs", {data : users, classe : classes, userClasse : classeofuser, notification: notification, client : req.session.user});
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/home");
    }
});

router.get("/profs", async (req, res) => {
    if(req.session.rang == 10) {
        let NotifModel = new Notif({bool : false});
        let notification = req.session.notif;
        let users = await DB.getUsers();
        let profs = await DB.getProfs();

        // Notification
        req.session.notif = await NotifModel.gettoast();

		res.render("admin/profs.ejs", {data : profs, notification : notification, client : req.session.user});

	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin");
	}
});

router.get("/profs/edit/:idprof", async (req, res) => {
    if(req.session.rang == 10) {
		let idprof = req.params.idprof;
        let NotifModel = new Notif({bool : false});
        let notification = req.session.notif;
        let utilisateur = await DB.getUserById(idprof);
        let matieres = await DB.getMatieres();
        let enseignematiere = await DB.getMatieresForOneProf(idprof);
        utilisateur[0].fullName = () => { return this.nom + " " + this.prenom };

        // Notification
        req.session.notif = await NotifModel.gettoast();

		res.render('admin/editprof.ejs', {user : utilisateur[0], matiere : matieres, enseigne : enseignematiere, notification : notification, client : req.session.user});

	} else {
		res.redirect("/admin");
	}
});

router.get("/classes", async (req, res) => {
    if(req.session.rang == 10) {
        let NotifModel = new Notif({bool : false});
        let notification = req.session.notif
        let classes = await DB.getClassesAndUserCount();
    
        // Notification
        req.session.notif = await NotifModel.gettoast();
        res.render("admin/classes.ejs", {data : classes, notification : notification, client : req.session.user});
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/admin");
    }
});

router.get("/classes/edit/:idclasse", async (req, res) => {
    if(req.session.rang == 10) {
        let NotifModel = new Notif({bool : false});
        let notification = req.session.notif;
		let classe = await DB.getClasseById(req.params.idclasse);
		let users = await DB.getUsersFromClasse(req.params.idclasse);
		let profs = await DB.getProfs();
        let userWithoutClasses = await DB.getUsersWithoutClasses();

        // Notification
        req.session.notif = await NotifModel.gettoast();
		res.render("admin/editclasse.ejs", {users : users, classe : classe[0], profs : profs, adduser : userWithoutClasses, toast : null, notification : notification, client : req.session.user} );
	
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin");
	}
});

router.post("/classes/delete", async (req, res) => {
    if(req.session.rang >= 10) {
        
        let NotifModel = new Notif();
        let classe = await req.body.delete;
        try {
            let count = await DB.getCountForOneClasse(classe);
            if (classe != undefined & count[0].effectif == 0) {
                let nomclasse = await DB.getClasseById(classe);
                // Delete the folowing class
                await DB.deleteClasse(classe);
                // Write logs
                let action = "Delete class";
                let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
                let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": nomclasse[0].idclasse, "nom" : nomclasse[0].nomclasse}]};
                Logs.writeLog(data,  getdate(), req.session.pseudo);

                // Notification
                NotifModel = new Notif({bool : true, type : "success", message : "Classe supprimée avec succès"});
                req.session.notif = await NotifModel.gettoast();

                res.redirect('/admin/classes');
            } else { res.redirect('/admin/classes'); }
        }
        catch (err) {
            // Write erros logs
            let description = err.toString();
            let action = "Delete class failed";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error Message" : description + " (id : "+classe +")"}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de la suppression de la classe"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect('/admin/classes');
        }
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/admin");
    }
});

router.get("/matieres", async (req, res) => {
    if(req.session.rang == 10) {
        let NotifModel = new Notif({bool : false});
        let notification = req.session.notif;
        
        // Get subjects
		let matieres = await DB.getMatieresAndProfCount();

        // Notifcation
        req.session.notif = await NotifModel.gettoast();

		res.render("admin/matieres.ejs", {data : matieres, notification : notification, client : req.session.user});
		
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin")
	}
});

router.get("/matieres/edit/:idmatiere", async (req, res) => {
    if(req.session.rang >= 10) {
        let NotifModel = new Notif({bool : false});
        let notification = req.session.notif;
        let matiere = await DB.getMatieresById(req.params.idmatiere);
        let profs = await DB.getProfsForOneMatiere(req.params.idmatiere);
        let profwithoutmatiere = await DB.getProfWithoutThisMatiere(req.params.idmatiere);
        console.log(profwithoutmatiere);
        // Notifcation
        req.session.notif = await NotifModel.gettoast();
  
        res.render("admin/editmatiere.ejs", {matiere : matiere[0], profs : profs, notification : notification, profwithoutmatiere : profwithoutmatiere, client : req.session.user});
        
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/admin");
    }
});

router.get("/edt/:idclasse", async (req, res) => {
    if (req.session.rang >= 10) {
    
        let edt = await DB.getEdtForOneClasse(req.params.idclasse);
        let classes = await DB.getClasses();
        let matieres = await DB.getMatieresAndTheseProfsForOneClasse(req.params.idclasse);

        let timetable = {
        Lundi : { 8 : {}, 9 : {}, 10: {}, 11: {}, 12: {}, 13: {}, 14: {}, 15: {}, 16: {}, 17: {} },
        Mardi : { 8 : {}, 9 : {}, 10: {}, 11: {}, 12: {}, 13: {}, 14: {}, 15: {}, 16: {}, 17: {} },
        Mercredi : { 8 : {}, 9 : {}, 10: {}, 11: {}, 12: {}, 13: {}, 14: {}, 15: {}, 16: {}, 17: {} },
        Jeudi : { 8 : {}, 9 : {}, 10: {}, 11: {}, 12: {}, 13: {}, 14: {}, 15: {}, 16: {}, 17: {} },
        Vendredi : { 8 : {}, 9 : {}, 10: {}, 11: {}, 12: {}, 13: {}, 14: {}, 15: {}, 16: {}, 17: {} }
        }

        if (req.params.idclasse == 'index') timetable = null;
        else {

            let days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

            // POUR CHAQUE ELEMENTS DANS edt
            for (let items in edt) {
                // ON RECUPERE L'HEURE ET LA DUREE EN HEURE
                let heure = parseInt((edt[items].debut).substring(0,2));
                let duree = parseInt((edt[items].duree).substring(0,2));

                // DANS LE CAS OU LE COURS COMMENCE A PILE
                if (parseInt((edt[items].debut).substring(3,5)) != 30) {
                // SI LA DUREE EXCEDE 0 (en h) ET DONC DIFFERENT DE 00:30 min
                if (duree > 0) {
                    // ON REMPLI LE TABLEAU EN FONCTION DES HEURES OCCUPEES PAR LE COUR (ex: 8h00 -> 10h00)
                    for (let i = 0; i < duree; i ++) {
                    timetable[days[edt[items].jour]][heure + i] = {id_matiere : edt[items].id_matiere, nom : edt[items].nommatiere, nom_prof : edt[items].nom, prenom_prof : edt[items].prenom, jour : days[edt[items].jour], debut : (edt[items].debut).substring(0,5), fin : (edt[items].fin).substring(0,5), duree : (edt[items].duree).substring(0,5) };
                    }
                }
                // CONDITION POUR REMPLIR LA PREMIERE DEMI-HEURE SI LE COURS NE FINI PAS A PILE (ex: 8h00 -> 9h30)
                if (parseInt((edt[items].fin).substring(3,5)) == 30 && duree > 0) {
                    timetable[days[edt[items].jour]][heure + duree] = [ {id_matiere : edt[items].id_matiere, nom : edt[items].nommatiere, nom_prof : edt[items].nom, prenom_prof : edt[items].prenom, jour : days[edt[items].jour], debut :  (edt[items].debut).substring(0,5), fin : (edt[items].fin).substring(0,5), duree : (edt[items].duree).substring(0,5) }, {} ]
                } else if (parseInt((edt[items].fin).substring(3,5)) == 30 && duree == 0) { // SI LE COURS NE DURE QUE 30 MIN ET COMMENCE A PILE (ex: 9h00 -> 9h30)
                    timetable[days[edt[items].jour]][heure] = [ { id_matiere : edt[items].id_matiere, nom : edt[items].nommatiere, nom_prof : edt[items].nom, prenom_prof : edt[items].prenom, jour : days[edt[items].jour], debut : edt[items].debut, fin : edt[items].fin, duree : edt[items].duree }, {} ]
                }
                } else {
                // ON VERIFIE SI LA CASE CONTIENT DEJA UNE DEMI-HEURE, SI NON ON CREER LES DEUX CASES, SI OUI ON MET A JOUR LA CASE
                if (timetable[days[edt[items].jour]][heure].length == undefined) {
                    timetable[days[edt[items].jour]][heure] = [ {}, {id_matiere : edt[items].id_matiere, nom : edt[items].nommatiere, nom_prof : edt[items].nom, prenom_prof : edt[items].prenom, jour : days[edt[items].jour], debut :  (edt[items].debut).substring(0,5), fin : (edt[items].fin).substring(0,5), duree : (edt[items].duree).substring(0,5)} ];
                    // ON REPREND LE PRINCIPE DE COURS QUI DURE PLUSIEURS HEURES
                    if (duree > 0) {
                    for (let i = 1; i < duree + 1; i ++) {
                        timetable[days[edt[items].jour]][heure + i] = { id_matiere : edt[items].id_matiere, nom : edt[items].nommatiere, nom_prof : edt[items].nom, prenom_prof : edt[items].prenom, jour : days[edt[items].jour], debut :  (edt[items].debut).substring(0,5), fin : (edt[items].fin).substring(0,5), duree : (edt[items].duree).substring(0,5) };
                    }
                    }
                } else {
                    timetable[days[edt[items].jour]][heure][1] = { id_matiere : edt[items].id_matiere, nom : edt[items].nommatiere, nom_prof : edt[items].nom, prenom_prof : edt[items].prenom, jour : days[edt[items].jour], debut :  (edt[items].debut).substring(0,5), fin : (edt[items].fin).substring(0,5), duree : (edt[items].duree).substring(0,5)};
                    if (duree > 0) {
                    for (let i = 1; i < duree + 1; i ++) {
                        timetable[days[edt[items].jour]][heure + i] = { id_matiere : edt[items].id_matiere, nom : edt[items].nommatiere, nom_prof : edt[items].nom, prenom_prof : edt[items].prenom, jour : days[edt[items].jour], debut :  (edt[items].debut).substring(0,5), fin : (edt[items].fin).substring(0,5), duree : (edt[items].duree).substring(0,5) };
                    }
                    }
                }
                }
            }
        }
    
        res.render("admin/edt.ejs", { client : req.session.user, data : edt, timetable : timetable, classes : classes, matieres : matieres, index : req.params.idclasse });
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/admin");
    }
});

router.get("/admin/log", async (req, res) => {
    if(req.session.rang >= 10) {
        let path = "./Logs/["+getdate()+"]/";
        let tab = new Array()
        
        let dir = await Logs.readdirectory(path);
        for (i=0;i<dir.length;i++) {
            tab[i] = await Logs.readfile( path, dir[i]);
        }
        res.render('admin/log.ejs', {data : await tab, client : req.session.user });
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/admin");
    }
  });

router.get("/admin/logEdit/pseudo=:pseudo&id=:id&date=:date", async (req, res) => {
    if(req.session.rang >= 10) {
        let idlog = req.params.id;
        let file = "log-["+req.params.pseudo+"]_["+req.params.date+"].json";
        let path = "./Logs/["+req.params.date+"]/";
        let fullpath = path + file;
        let content;
        
        content = await Logs.readfileForOneUser( fullpath, idlog);
        res.render('admin/logedit.ejs', {data : content, pseudo : req.params.pseudo, client : req.session.user});
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/admin");
    }
});

// POST

router.post("/edt/update/:id", async (req, res) => {
    if (req.session.rang >= 10) {
        let html_timetable = JSON.parse(req.body.data_timetable);
    
        let days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
        let array = []
        function compare_array_values(array, value) {
          for (let items in array) {
            if (JSON.stringify(array[items]) == JSON.stringify(value)) return false;
          }
          return true;
        }
    
        // GET EACH SUBJECT TO AN ARRAY
        for (let day in days) {
          for (let items in html_timetable[days[day]]) {
            if (html_timetable[days[day]][items].length == undefined) {
              if (JSON.stringify(html_timetable[days[day]][items]) != '{}') {
                html_timetable[days[day]][items].id_jour = day;
                if(compare_array_values(array, html_timetable[days[day]][items])) array.push(html_timetable[days[day]][items]);
              }
            } else {
              if (JSON.stringify(html_timetable[days[day]][items][0]) != '{}') {
                html_timetable[days[day]][items][0].id_jour = day;
                if(compare_array_values(array, html_timetable[days[day]][items][0])) array.push(html_timetable[days[day]][items][0]);
              } else if (JSON.stringify(html_timetable[days[day]][items][1]) != '{}') {
                html_timetable[days[day]][items][1].id_jour = day;
                if(compare_array_values(array, html_timetable[days[day]][items][1])) array.push(html_timetable[days[day]][items][1]);
              }
            }
          }
        }
    
        // parseInt TO AVOID SQL INJECTION
        await DB.deleteTimeTable(parseInt(req.params.id));
        await DB.addTimeTable(array, parseInt(req.params.id))
        console.log(array, array.length);
        res.redirect("/admin/edt/"+req.params.id);
        
    
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/admin");
    }

});

router.post("/users/add", async (req, res) => {
    if(req.session.rang >= 5) {
	    let nom = (req.body.nom.toUpperCase()).replace(/ /g, "");
	    let prenom = (cap(req.body.prenom.toLowerCase())).replace(/ /g, "");
	    let classe = req.body.classe;
        if (nom != '' & prenom != '' & classe != undefined) {
            let pseudo = nom.substr(0, 7).toLowerCase().replace(" ", "").replace("-", "") + prenom.substr(0,2).toLowerCase().replace(" ", "").replace("-", "");
            let password = crypto.createHmac('sha256', nom + "-" + prenom)
                    .update('jojofags suck')
                    .digest('hex');
            let rang = 1
            let titre = "Élève";
            let userInputs = [nom, prenom, pseudo, password, rang, titre];
            
            let NotifModel = new Notif();
            
            try {
                let action = "Create user";
                // If user already exist
                let duplicata = await double(nom, prenom, pseudo, db);
                if(duplicata == undefined | duplicata == true) {
                    NotifModel = new Notif({bool : true, type : "error", message : "L'utilisateur existe déjà"});
                    req.session.notif = await NotifModel.gettoast();
                    res.redirect("/admin/users");
                }
                else {
                    NotifModel = new Notif({bool : true, type : "success", message : "Utilisateur ajouté avec succès"});
                    req.session.notif = await NotifModel.gettoast();
                    // Create user
                    await DB.addUser(userInputs, classe);
                    // Write log
                    let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
                    let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{ "nom" : nom, "prenom" : prenom, "pseudo" : pseudo, "classe" : classe, "rang" : rang.toString(), "titre" : titre}]};
                    Logs.writeLog(data,  getdate(), req.session.pseudo);
                    res.redirect("/admin/users");
                }
            }
            catch (err) {
                // Write error log
                let action = "Create user failed";
                let description = err.toString();
                let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
                let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{ "Error message" : description }]};
                Logs.writeLog(data,  getdate(), req.session.pseudo);
                res.redirect("/admin/users");
            }
        } else { res.redirect("/admin/users"); }

	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home")
	}
});

router.post("/users/edit/:ideleve", async (req, res) => {
    if(req.session.rang == 10) {
        
        let NotifModel = new Notif();
        let iduser =  req.params.ideleve;
        let lastname = (req.body.nomeleve.toUpperCase()).replace(/ /g, "");
        let firstname = (cap(req.body.prenomeleve.toLowerCase())).replace(/ /g, "");
        let classe = req.body.classe;
          try {
            if((firstname != ('' & undefined)) & (lastname != ('' & undefined)) & classe != undefined) {
              let pseudo = lastname.substr(0, 7).toLowerCase().replace(" ", "").replace("-", "") + firstname.substr(0,2).toLowerCase().replace(" ", "").replace("-", "");
              // Get last user data
              let userdata = await DB.getUserById(iduser);
              let userclasse = await DB.getUserClasseFromId(iduser);
              // Edit user data
              await DB.editUser(iduser, firstname, lastname, pseudo);
              // Update user class
              await DB.updateClasseOfUser(iduser, classe);
    
              // Write log
              let action = "Modify user";
              let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
              let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": iduser, "nom" : userdata[0].nom, "prenom" : userdata[0].prenom, "pseudo" : userdata[0].pseudo, "classe" : userclasse[0].nomclasse }, { "id": iduser, "nom" : lastname, "prenom" : firstname, "pseudo" : pseudo, "classe" : classe }]};
              Logs.writeLog(data,  getdate(), req.session.pseudo);
    
              // Notification
              NotifModel = new Notif({bool : true, type : "success", message : "L'utilisateur a été mis à jour"});
              req.session.notif = await NotifModel.gettoast();
              res.redirect("/admin/users/edit/" + iduser);
            } else {
    
              // Notification
              NotifModel = new Notif({bool : true, type : "error", message : "L'utilisateur n'a pas pu être mis à jour"});
              req.session.notif = await NotifModel.gettoast();
    
              res.redirect("/admin/users/edit/" + iduser);
            }
          }
          catch (err) {
            // Write error logs
            let action = "Modify user failed";
            let description = err.toString();
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{ "Error message" : description }]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);
    
            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "L'utilisateur n'a pas pu être mis à jour"});
            req.session.notif = await NotifModel.gettoast();
    
            res.redirect("/admin/users/edit/" + iduser);
          }
      } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/home");
      }
});

router.post("/users/defaultpassword/:ideleve", async (req, res) => {
    if(req.session.rang == 10) {
        
        let NotifModel = new Notif();
        let id = req.params.ideleve;
        try {
            // Get user data by Id
            let userdata = await DB.getUserById(id);
            // Encrypt password for BDD
            let password = crypto.createHmac('sha256', userdata[0].nom.toUpperCase() + "-" + cap(userdata[0].prenom.toLowerCase()))
                        .update('jojofags suck')
                        .digest('hex');
            await DB.defaultPassword(id, password);

            // Write logs
            let action = "Modify user password";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": id, "nom" : userdata[0].nom, "prenom" : userdata[0].prenom, "pseudo" : userdata[0].pseudo}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "success", message : "Le mot de passe a été réinitialisé"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/users/edit/" + id);
        }
        catch (err) {
            // Write error logs
            let description = err.toString();
            let action = "Modify user password failed";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description }]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Echec de la réinitialisation du mot de passe"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/users/edit/" + id);
        }
    } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
    }
})

router.post("/user/delete", async (req, res) => {
    if(req.session.rang >= 10) {
        
        let NotifModel = new Notif();
        try {
            let user = await req.body.delete;
            let dataUser = await DB.getUserById(user);

            // GET RANG OF USER TO REDIRECT TO THE CORRECT PAGE
            let rangUser = await DB.getRangUserWithId(user);
            if (user != undefined) {

                // DELETE USERS AND PROFS
                await DB.deleteUser(user);

                // Write logs
                let action = "Delete user";
                let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
                let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": dataUser[0].id, "nom" : dataUser[0].nom, "prenom" : dataUser[0].prenom, "pseudo" : dataUser[0].pseudo}]};
                Logs.writeLog(data,  getdate(), req.session.pseudo);

                // Notification
                NotifModel = new Notif({bool : true, type : "success", message : "Utilisateur supprimé"});
                req.session.notif = await NotifModel.gettoast();

                // Redirect to the corresponding page
                if(rangUser[0].rang < 5) {
                res.redirect('/admin/users');
                } else {
                res.redirect('/admin/profs');
                }

            } else res.redirect('/admin/users');
        }
        catch (err) {
            let user = await req.body.delete;
            // Write error logs
            let description = err.toString();
            let action = "Delete user failed";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": user}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de la suppréssion de l'utilisateur"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect('/admin/users');
        }
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/home");
    }
});

router.post("/profs/add", async (req, res) => {
    if(req.session.rang == 10) {
        
        let NotifModel = new Notif();
        try {
            let nom = (req.body.nom.toUpperCase()).replace(/ /g, "");
            let prenom = (cap(req.body.prenom.toLowerCase())).replace(/ /g, "");
            if (nom != '' & prenom != '') {
                let pseudo = nom.substr(0, 7).toLowerCase().replace(" ", "").replace("-", "") + prenom.substr(0,2).toLowerCase().replace(" ", "").replace("-", "");
                let password = crypto.createHmac('sha256', nom + "-" + prenom)
                            .update('jojofags suck')
                            .digest('hex');
                let rang = 5;
                let titre = "Professeur";
                let duplicata = await double(nom, prenom, pseudo, db);
                if (duplicata == undefined | duplicata == true) {
                    NotifModel = new Notif({bool : true, type : "error", message : "Le professeur existe déjà"});
                    req.session.notif = await NotifModel.gettoast();
                    res.redirect("/admin/profs");
                } else {
                    // Add the user
                    await DB.addProf([nom, prenom, pseudo, password, rang, titre]);
                    let dataUser = await DB.getUserByPseudo(pseudo);
                    //Write logs
                    let action = "Create teacher";
                    let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
                    let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": dataUser[0].id, "nom" : dataUser[0].nom, "prenom" : dataUser[0].prenom, "pseudo" : dataUser[0].pseudo, "rang" : rang.toString(), "titre" : titre}]};
                    Logs.writeLog(data,  getdate(), req.session.pseudo);

                    // Notification
                    NotifModel = new Notif({bool : true, type : "success", message : "Le professeur à été ajouté avec succès"});
                    req.session.notif = await NotifModel.gettoast();

                    // Redirect to last page
                    res.redirect("/admin/profs");
                }
            } else res.redirect("/admin/profs");
        }
        catch (err) {
            // Write error logs
            let description = err.toString();
            let action = "Create teacher failed";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description }]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de l'ajout du professeur"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/profs");
        }

    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/admin");
    }
});

router.post("/profs/edit/:idprof", async (req, res) => {
    if(req.session.rang == 10) {
        
        let NotifModel = new Notif();
        let idprof =  req.params.idprof;
        let lastname = (req.body.nomprof.toUpperCase()).replace(/ /g, "");
        let firstname = (cap(req.body.prenomprof.toLowerCase())).replace(/ /g, "");
        try {
            if((firstname != ('' & undefined)) & (lastname != ('' & undefined))) {
                let pseudo = lastname.substr(0, 7).toLowerCase().replace(" ", "").replace("-", "") + firstname.substr(0,2).toLowerCase().replace(" ", "").replace("-", "");
                // Edit prof data
                await DB.editUser(idprof, firstname, lastname, pseudo);
                //Write logs
                let action = "Modify teacher";
                let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
                let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": idprof, "nom" : lastname, "prenom" : firstname, "pseudo" : pseudo}]};
                Logs.writeLog(data,  getdate(), req.session.pseudo);

                // Notification
                NotifModel = new Notif({bool : true, type : "success", message : "Le professeur a été mis à jour"});
                req.session.notif = await NotifModel.gettoast();

                res.redirect("/admin/profs/edit/" + idprof);
            } else res.redirect("/admin/profs/edit/" + idprof);
        }
        catch (err) {
            // Write error logs
            let description = err.toString();
            let action = "Modify teacher failed";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de la mise à jour du professeur"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/profs/edit/" + idprof);
        }
    } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
    }
});

router.post("/profs/defaultpassword/:idprof", async (req, res) => {
    if(req.session.rang == 10) {
        
        let NotifModel = new Notif();
          try {
            let id = req.params.idprof;
            let userdata = await DB.getUserById(id);
            let password = crypto.createHmac('sha256', userdata[0].nom.toUpperCase() + "-" + cap(userdata[0].prenom.toLowerCase()))
                       .update('jojofags suck')
                       .digest('hex');
            // Add default password
            await DB.defaultPassword(id, password);
            // Write logs
            let action = "Modify teacher password";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": id, "nom" : userdata[0].nom, "prenom" : userdata[0].prenom, "pseudo" : userdata[0].pseudo}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);
    
            // Notification
            NotifModel = new Notif({bool : true, type : "success", message : "Mot de passe réinitialisé"});
            req.session.notif = await NotifModel.gettoast();
    
            res.redirect("/admin/profs/edit/" + id);
          }
          catch (err) {
            // Write error logs
            let description = err.toString();
            let action = "Modify teacher password failed";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);
    
            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de la réinitialisation du mot de passe"});
            req.session.notif = await NotifModel.gettoast();
    
            res.redirect("/admin/profs/edit/" + id);
          }
      } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/home");
      }
});

router.post("/profs/edit-matiere/:idprof", async (req, res) => {
    if(req.session.rang == 10) {
		let idmatiere = req.body.doprof;
		let idprof = req.params.idprof;
        
        let NotifModel = new Notif();
        try {
          let data = await DB.getMatieresForOneProf(idprof);
          // Verify if teacher already teach this subject
          let bool = await verifier(data, "parseInt(dataOne[i].idmatiere)", parseInt(idmatiere));
          if (bool) {
            // Delete this teacher from this subject
            await DB.deleteMatiereForOneProf(idmatiere, idprof);
            // Write logs
            let action = "Delete subject for teacher";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"idteacher": idprof, "idsubject" : idmatiere}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "success", message : "Matière désatribuée"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/profs/edit/"+idprof);
          } else {
            // Add this teacher to this subject
            await DB.addMatiereToProf(idprof, idmatiere);
            // Write logs
            let action = "Add subject for teacher";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"idteacher": idprof, "idsubject" : idmatiere}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "success", message : "Matière atribuée"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/profs/edit/"+idprof);
          }
        }
        catch (err) {
          // Write errors logs
          let description = err.toString();
          let action = "Modify subject for teacher failed";
          let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description}]};
          Logs.writeLog(data,  getdate(), req.session.pseudo);

          // Notification
          NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de l'atribution/désatribution de matière"});
          req.session.notif = await NotifModel.gettoast();

          res.redirect("/admin/profs/edit/"+idprof);
        }
	} else {
        req.session.login = false;
        req.session.rang = 0;
		res.redirect("/admin");
	}
});

router.post("/classes/add", async (req, res) => {
    if(req.session.rang == 10) {
        
        let NotifModel = new Notif();
        let classenom = (req.body.nomclasse).replace(/ /g, "");
        try {
            let classeExistantes = await DB.getClasses();
            // Verify if this class already exist
            let bool = await verifier(classeExistantes, "dataOne[i].nomclasse", classenom);
            if(classenom != '' & bool == false) {
                // Add class to BDD
                await DB.addClasse(classenom);
                // Get id of new class
                let newclasse = await DB.getClasseByNom(classenom);
                // Write log
                let action = "Create class";
                let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
                let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": newclasse[0].idclasse, "nom" : newclasse[0].nomclasse, "main teacher" : newclasse[0].profprincipal}]};
                Logs.writeLog(data,  getdate(), req.session.pseudo);

                // Notification
                NotifModel = new Notif({bool : true, type : "success", message : "Classe ajoutée avec succès"});
                req.session.notif = await NotifModel.gettoast();

                res.redirect("/admin/classes");
            } else {
                // Notification
                NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de l'ajout de la classe"});
                req.session.notif = await NotifModel.gettoast();

                res.redirect("/admin/classes");
            }
        }
        catch (err) {
            // Write error logs
            let description = err.toString();
            let action = "Create class failed";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de l'ajout de la classe"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/classes");
        }
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin");
	}
});

router.post("/classes/edit/adduser/:idclasse", async (req, res) => {
    if(req.session.rang >= 10) {
        
        let NotifModel = new Notif();
        let classe = req.params.idclasse;
        let user = req.body.idUserToAdd
        try {
            await DB.addClasseForUser(user, classe);

            // Write log
            let action = "Add user to class";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"iduser" : user, "idclasse" : classe}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "success", message : "L'utilisateur à été ajouté à la classe"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/classes/edit/"+classe);
        }
        catch (err) {
            // Write logs
            let description = err.toString();
            let action = "Add user to class failed";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error Message" : description, "iduser" : user, "idclasse" : classe}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Impossible d'ajouter l'utilisateur à la classe"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/classes/edit/"+classe);
        }
     } else {
         req.session.login = false;
         req.session.rang = 0;
         res.redirect("/home")
     }
});

router.post("/classes/edit/editclasse", async (req, res) => {
    if(req.session.rang >= 10) {
		let profprincipal = req.body.profprincipal;
		let nomclasse = req.body.nomclasse;
		let classeToEdit = req.body.idclasse;
        
        let NotifModel = new Notif();
        try {
            // Edit the following class
            let lastdata = await DB.getClasseById(classeToEdit);
            await DB.editClasse(classeToEdit, nomclasse, profprincipal);
            // Write logs
            let action = "Modify class";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": classeToEdit, "nom" : lastdata[0].nomclasse, "main teacher" : lastdata[0].profprincipal}, {"id": classeToEdit, "nom" : nomclasse, "main teacher" : profprincipal}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "success", message : "La classe a été mise à jour"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/classes/edit/"+classeToEdit);
        }
        catch (err) {
            // Write error logs
            let description = err.toString();
            let action = "Modify class failed";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de la mise à jour de la classe"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/classes/edit/"+classeToEdit);
        }
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home")
	}
});

router.post("/classes/edit-eleve/:idclasse", async (req, res) => {
    if(req.session.rang >= 10) {
        
        let NotifModel = new Notif();
        let iduser = req.body.iduser;
        let idclasse = req.params.idclasse;
        try {
            // Delete eleve from the following class
            await DB.deleteEleveFromClasse(idclasse, iduser);
            // Write logs
            let action = "Modify user class";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"idclass": idclasse, "iduser" : iduser}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "success", message : "Elève supprimé de la classe"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/classes/edit/" + idclasse);
        }
        catch (err) {
            // Write error logs
            let description = err.toString();
            let action = "Modify user class failed";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "success", message : "Elève supprimé de la classe"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/classes/edit/" + idclasse);
        }
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/admin");
    }
});

router.post("/matieres/add", async (req, res) => {
    if(req.session.rang == 10) {
        
        let NotifModel = new Notif();
        let nomMatiere = (req.body.nommatiere).replace(/ /g, "");
        try {
            let matiereExistantes = await DB.getMatieres();
            // Verify if this subject already exist
            let bool = await verifier(matiereExistantes, "dataOne[i].nommatiere", nomMatiere);
            if (nomMatiere != "" & bool == false) {
                // Add Matière
                await DB.addMatiere(nomMatiere);
                // Get id of new subject
                let matiere = await DB.getMatiereByNom(nomMatiere);
                // Write logs
                let action = "Create subject";
                let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
                let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": matiere[0].id, "nom" : matiere[0].nommatiere}]};
                Logs.writeLog(data,  getdate(), req.session.pseudo);

                // Notification
                NotifModel = new Notif({bool : true, type : "success", message : "Matière ajoutée avec succès"});
                req.session.notif = await NotifModel.gettoast();

                res.redirect("/admin/matieres");
            } else {

                // Notification
                NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de l'ajout de la matière"});
                req.session.notif = await NotifModel.gettoast();

                res.redirect("/admin/matieres");
            };
        }
        catch (err) {
            // Write error logs
            let description = err.toString();
            let action = "Create subject";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description, "nom" : nomMatiere}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de l'ajout de la matière"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/matieres");
        }
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin");
	}
});

router.post("/matieres/delete", async (req, res) => {
    if(req.session.rang >= 10) {
        
        let NotifModel = new Notif();
        let matiere = await req.body.delete;
        if (matiere != undefined) {
            try {
                let matieredata = await DB.getMatieresById(matiere);
                // Delete the following subject
                await DB.deleteMatiere(matiere);
                // Write logs
                let action = "Delete subject";
                let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
                let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": matieredata[0].id, "nom" : matieredata[0].nommatiere}]};
                Logs.writeLog(data,  getdate(), req.session.pseudo);
        
                // Notification
                NotifModel = new Notif({bool : true, type : "success", message : "Matière supprimée"});
                req.session.notif = await NotifModel.gettoast();
        
                res.redirect('/admin/matieres');
            }
            catch (err) {
                // Write error logs
                let description = err.toString();
                let action = "Delete subject failed";
                let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
                let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message": description,"id": matieredata[0].id}]};
                Logs.writeLog(data,  getdate(), req.session.pseudo);
        
                // Notification
                NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de la suppression de la matière"});
                req.session.notif = await NotifModel.gettoast();
        
                res.redirect('/admin/matieres');
            }
        } else res.redirect('/admin/matieres');
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/admin");
    }
});

router.post("/matiere/delete-prof-from-matiere/:idmatiere", async (req,res) => {
    if(req.session.rang >= 10) {
        
        let NotifModel = new Notif();
        let idprof = req.body.idprof;
        let idmatiere = req.params.idmatiere;
        try {
            // Delete the following teacher from this subject
            await DB.deleteMatiereForOneProf(idmatiere, idprof);
            // Write logs
            let action = "Delete teacher from subject";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"teacher": idprof, "subject" : idmatiere}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "success", message : "Le professeur à été désatribué de cette matière"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/matieres/edit/" + idmatiere);
        }
        catch (err) {
            // Write error logs
            let description = err.toString();
            let action = "Delete teacher from subject failed";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description, "teacher": idprof, "subject" : idmatiere}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Impossible d désatribuer le professeur de cette matière"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/matieres/edit/" + idmatiere);
        }
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/admin")
    }
});

router.post("/matiere/edit/:idmatiere", async (req, res) => {
    if(req.session.rang >= 10) {
        
        let NotifModel = new Notif();
        let idmatiere = req.params.idmatiere;
        let nommatiere = req.body.nommatiere;
        try {
            // Get last subject data
            let datasubject = await DB.getMatieresById(idmatiere);
            // Update subject name
            await DB.editMatiere(idmatiere, nommatiere);
            // Write logs
            let action = "Modify subject";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": datasubject[0].id , "nom" : datasubject[0].nommatiere}, {"id": idmatiere, "nom" : nommatiere}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "success", message : "La matière à été mise à jour"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/matieres/edit/" + idmatiere);
        }
        catch (err) {
            // Write error logs
            let description = err.toString();
            let action = "Modify subject failed";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de la mise à jour de la matière"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/matieres/edit/" + idmatiere);
        }
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/admin");
    }
});

router.post("/matiere/addprof/:idmatiere", async (req, res) => {
    if(req.session.rang >= 10) {
        
        let NotifModel = new Notif();
        let matiere = req.params.idmatiere;
        let prof = req.body.idProfToAdd;
        try {
            await DB.addClasseForUser(prof, matiere);

            // Write log
            let action = "Add teacher to subject";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"iduser" : user, "idclasse" : classe}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "success", message : "Le professeur à été ajouté à la matière"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/matieres/edit/"+matiere);
        }
        catch (err) {
            // Write logs
            let description = err.toString();
            let action = "Add teacher to subject failed";
            let idlog = await Logs.getIdLog( req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error Message" : description, "iduser" : user, "idclasse" : classe}]};
            Logs.writeLog(data,  getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Impossible d'ajouter le professeur à la matière"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/matieres/edit/"+matiere);
        }
    } else {
        req.session.login = false;
        req.session.rang = 0;
        res.redirect("/admin");
    }
});

module.exports = router;