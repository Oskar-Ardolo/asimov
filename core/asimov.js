/*
======================
MISC FUNCTIONS
======================

Liste fonctions :

cap(string) : renvoie un string avec la première lettre en majuscule et le reste en minuscule

double(nom, prenom, pseudo, db) : renvoie true lorsque l'utilisateur se trouve déjà dans la BDD
                                  et false lorsqu'il ne s'y trouve pas (évite les duplicatas)
verifier(dataOne, dataOneVar, dataTwo) : renvoie true lorsque la valeur 2 est présente dans la valeur 1 et false dans le cas contraire
                                        dataOneVar est un string, avec la fonction eval() => transform str en fonction
                                        à personaliser en fonction des besoins.
                                        /!\ attention, remplacer dataOneVar par : "dataOne[i].attribut"

getdate() : renvoie la date du jour au format dd/jj/yyyy
gethours() : renvoie l'heure au format h:min
*/

const DB = require('./classes.js');
const Logs = require('../Logs/js/log.js');
const Notif = require('../notification/js/notif.js');

const cap = (s) => {
  if (typeof s !== 'string') return ''
  return s.toLowerCase().charAt(0).toUpperCase() + s.slice(1)
}

const double = (nom, prenom, pseudo, db) => {
  let promise = new Promise((resolve, reject) => {
    try {
      let DBModel = new DB(db);
      (async function() {
        let value = await DBModel.getUserDuplicate(nom, prenom, pseudo);
        for (let items in value) {
          if (value[items]) {
            return resolve(true)
          }
        }
        return resolve(false);
      })();
    }
    catch (err) {
      resolve(false)
    }
  });
  return promise.then((val) => {
    return val
  });

}

const verifier = (dataOne, dataOneVar, dataTwo) => {
  for (i=0;i<dataOne.length;i++) {
    if (eval(dataOneVar) == dataTwo)  return true;
  }
  return false;
}

const getdate = () => {
  let day = new Date();
  return day.getDate() +"-"+ (day.getMonth() + 1) +"-"+ day.getFullYear()
}

const gethours = () => {
  let day = new Date();
  let h = day.getHours();
  let min = day.getMinutes();
  if (h < 10) {
    h = "0"+h;
  }
  if (min < 10) {
     min = "0" + min
  }
  return h +":"+ min ;
}



/*
======================
MODULES GENERAUX
======================

Liste modules :

getAdminInfo :
doLogStuff :
login :

*/

exports.doLogStuff = (req, res) => {
  let NotifModel = new Notif({bool : false});
  let notification = req.session.notif;
  (async function() {
    if(req.session.login) {
  		res.render("index.ejs", { client : req.session.user });
  	} else {
      // Notification
      req.session.notif = await NotifModel.gettoast();
  		res.render("login.ejs", {notification : notification});
  	}
  })();

}


exports.login = (req, res, db, crypto, fs) => {
	let pseudo = req.body.pseudo;
	let password = crypto.createHmac('sha256', req.body.password)
	               .update('jojofags suck')
	               .digest('hex');
	let DBModel = new DB(db);
  let LogsModel = new Logs();
  let NotifModel = new Notif();
  let day = new Date();
	(async function() {
    try {
      let action = "Connexion";
      let userLogin = await DBModel.login(pseudo, password);
  		if(userLogin.length != 0) {
  			req.session.login = true;
  	    req.session.rang = userLogin[0].rang;
        req.session.pseudo = pseudo;
        req.session.user = await DBModel.getUserByPseudo(req.session.pseudo);
        console.log(req.session.user);
  	    	if(userLogin[0].rang >= 5) {


            // Write logs
            let idlog = await LogsModel.getIdLog(fs, pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours()};
            LogsModel.writeLog(data, fs, getdate(), pseudo);

            // Notifcation
            NotifModel = new Notif({bool : true, type : "success", message : "Connexion successful"});
            req.session.notif = await NotifModel.gettoast();

  	    		res.redirect("/admin");
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
      let idlog = await LogsModel.getIdLog(fs, pseudo, getdate());
      let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{ "Error message" : description }]};
      LogsModel.writeLog(data, fs, getdate(), pseudo);

      // Notifcation
      NotifModel = new Notif({bool : true, type : "error", message : "La connexion a échoué"});
      req.session.notif = await NotifModel.gettoast();

      res.redirect("/home");
    }

	})();
}

// Profil page
exports.getProfil = (req, res, db) => {
  if (req.session.login) {
    let DBModel = new DB(db);
    (async function () {
      let data = await DBModel.getUserByPseudo(req.session.pseudo);
      console.log(data);
      res.render("profil.ejs", {data : data[0], client : req.session.user});
    })();
  } else res.redirect("/home");
}

exports.getParameters = (req, res, db) => {
  if (req.session.login) {
    let DBModel = new DB(db);
    (async function () {

      res.render("parameters.ejs", { client : req.session.user });
    })();
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
  }
}

exports.getDiscussions = (req, res, db) => {
  if (req.session.login) {
    let DBModel = new DB(db);
    (async function() {
      let allconverse = await DBModel.getAllDiscussionById(req.session.user[0].id);
      //console.log(allconverse);
      res.render("messages.ejs", {allconverse : allconverse, client : req.session.user});
    })();
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
  }
}

exports.postMessage = (req, res, db, msg) => {
  if (req.session.login) {
    console.log("ça marche");
    let DBModel = new DB(db);
    (async function() {
      if (req.body.msg) {
        await DBModel.addNewMessage(1, req.session.user[0].id, msg);
        let lastmsg = await DBModel.getLastMessageOfUser(req.session.user[0].id, 1);
        res.send({newmsg : lastmsg[0].content});
      } else res.send({newmsg : ""});
    })();
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
  }
}

/*
======================
MODULES ADMINISTRATION
======================

Liste modules :

getAdminInfo :
getUsers : affiche admin/users.ejs avec la liste des élèves


*/



// ADMINISTRATION GENERALE PROFS + PERSONNEL
exports.getAdminInfo = (req, res, db, toastr, flash) => {
	if(req.session.rang >= 5) {
		let DBModel = new DB(db);
    let NotifModel = new Notif({bool : false});
    let notification = req.session.notif;
		(async function() {
			let userCount = await DBModel.userCount();
			let profCount = await DBModel.profCount();
			let classeCount = await DBModel.classeCount();
			let matiereCount = await DBModel.matiereCount();
      req.session.notif = await NotifModel.gettoast();
			res.render("admin/admin.ejs", {counts : [userCount, profCount, classeCount, matiereCount], notification : notification, client : req.session.user });
		})();
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home");
	}
}



// GESTION DES UTILISATEURS (ELEVES)
exports.getUsers = (req, res, db) => {
	if(req.session.rang >= 5) {
		let DBModel = new DB(db);
    let NotifModel = new Notif({bool : false});
    let notification = req.session.notif;
		(async function() {
			let users = await DBModel.getUsers();
			let classes = await DBModel.getClasses();

      // Notification
      req.session.notif = await NotifModel.gettoast();
			res.render("admin/users.ejs", {data : users, classe : classes, notification : notification, client : req.session.user});
		})();
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home");
	}
}

// AJOUTER DES ELEVES
exports.addUser = (req, res, db, crypto, fs) => {
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
        let LogsModel = new Logs();
  	    let DBModel = new DB(db);
        let NotifModel = new Notif();
  		(async function() {
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
            await DBModel.addUser(userInputs, classe);
            // Write log
            let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{ "nom" : nom, "prenom" : prenom, "pseudo" : pseudo, "classe" : classe, "rang" : rang.toString(), "titre" : titre}]};
            LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);
            res.redirect("/admin/users");
          }
        }
        catch (err) {
          // Write error log
          let action = "Create user failed";
          let description = err.toString();
          let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{ "Error message" : description }]};
          LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);
          res.redirect("/admin/users");
        }
  		})();
    } else { res.redirect("/admin/users"); }


	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home")
	}
}

// AFFICHER LA FICHE D'UN ELEVE
exports.editUsersView = (req, res, db) => {
    if(req.session.rang == 10) {
      let DBModel = new DB(db);
      let NotifModel = new Notif({bool : false});
      let notification = req.session.notif;
      (async function() {
        let users = await DBModel.getUserById(req.params.ideleve);
        let classes = await DBModel.getClasses();
        let classeofuser = await DBModel.getUserClasseFromId(req.params.ideleve);
        // If user doesn't have class
        if (classeofuser[0] == null) {
          classeofuser = [{ nomclasse : ''}];
        }
        req.session.notif = await NotifModel.gettoast();
        res.render("admin/edituser.ejs", {data : users, classe : classes, userClasse : classeofuser, notification: notification, client : req.session.user});
      })()
    } else {
  		req.session.login = false;
  		req.session.rang = 0;
  		res.redirect("/home");
  	}
}

// METTRE A JOUR LES DONNEES D'UN ELEVE
exports.editUserData = (req, res, db, fs) => {
  if(req.session.rang == 10) {
    let DBModel = new DB(db);
    let LogsModel = new Logs();
    let NotifModel = new Notif();
    let iduser =  req.params.ideleve;
    let lastname = (req.body.nomeleve.toUpperCase()).replace(/ /g, "");
    let firstname = (cap(req.body.prenomeleve.toLowerCase())).replace(/ /g, "");
    let classe = req.body.classe;
    (async function () {
      try {
        if((firstname != ('' & undefined)) & (lastname != ('' & undefined)) & classe != undefined) {
          let pseudo = lastname.substr(0, 7).toLowerCase().replace(" ", "").replace("-", "") + firstname.substr(0,2).toLowerCase().replace(" ", "").replace("-", "");
          // Get last user data
          let userdata = await DBModel.getUserById(iduser);
          let userclasse = await DBModel.getUserClasseFromId(iduser);
          // Edit user data
          await DBModel.editUser(iduser, firstname, lastname, pseudo);
          // Update user class
          await DBModel.updateClasseOfUser(iduser, classe);

          // Write log
          let action = "Modify user";
          let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": iduser, "nom" : userdata[0].nom, "prenom" : userdata[0].prenom, "pseudo" : userdata[0].pseudo, "classe" : userclasse[0].nomclasse }, { "id": iduser, "nom" : lastname, "prenom" : firstname, "pseudo" : pseudo, "classe" : classe }]};
          LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

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
        let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
        let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{ "Error message" : description }]};
        LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

        // Notification
        NotifModel = new Notif({bool : true, type : "error", message : "L'utilisateur n'a pas pu être mis à jour"});
        req.session.notif = await NotifModel.gettoast();

        res.redirect("/admin/users/edit/" + iduser);
      }
    })();
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
  }
}

// REINITIALISER LE MOT DE PASSE D'UN ELEVE
exports.defaultPasswordForUser = (req, res, db, crypto, fs) => {
  if(req.session.rang == 10) {
    let DBModel = new DB(db);
    let LogsModel = new Logs();
    let NotifModel = new Notif();
    (async () => {
      let id = req.params.ideleve;
      try {
        // Get user data by Id
        let userdata = await DBModel.getUserById(id);
        // Encrypt password for BDD
        let password = crypto.createHmac('sha256', userdata[0].nom.toUpperCase() + "-" + cap(userdata[0].prenom.toLowerCase()))
                   .update('jojofags suck')
                   .digest('hex');
        await DBModel.defaultPassword(id, password);

        // Write logs
        let action = "Modify user password";
        let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
        let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": id, "nom" : userdata[0].nom, "prenom" : userdata[0].prenom, "pseudo" : userdata[0].pseudo}]};
        LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

        // Notification
        NotifModel = new Notif({bool : true, type : "success", message : "Le mot de passe a été réinitialisé"});
        req.session.notif = await NotifModel.gettoast();

        res.redirect("/admin/users/edit/" + id)
      }
      catch (err) {
        // Write error logs
        let description = err.toString();
        let action = "Modify user password failed";
        let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
        let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description }]};
        LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

        // Notification
        NotifModel = new Notif({bool : true, type : "error", message : "Echec de la réinitialisation du mot de passe"});
        req.session.notif = await NotifModel.gettoast();

        res.redirect("/admin/users/edit/" + id);
      }
    })();
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
  }
}

// SUPPRIMER UN ELEVE
exports.deleteUser = (req, res, db, fs) => {
  if(req.session.rang >= 10) {
    let DBModel = new DB(db);
    let LogsModel = new Logs();
    let NotifModel = new Notif();
    (async function() {
      try {
        let user = await req.body.delete;
        let dataUser = await DBModel.getUserById(user);

        // GET RANG OF USER TO REDIRECT TO THE CORRECT PAGE
        let rangUser = await DBModel.getRangUserWithId(user);
        if (user != undefined) {

          // DELETE USERS AND PROFS
          await DBModel.deleteUser(user);

          // Write logs
          let action = "Delete user";
          let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": dataUser[0].id, "nom" : dataUser[0].nom, "prenom" : dataUser[0].prenom, "pseudo" : dataUser[0].pseudo}]};
          LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

          // Notification
          NotifModel = new Notif({bool : true, type : "success", message : "Utilisateur supprimé"});
          req.session.notif = await NotifModel.gettoast();

          // Redirect to the corresponding page
          if(rangUser[0].rang < 5) {
            res.redirect('/admin/users');
          } else {
            res.redirect('/admin/profs');
          }

        } else { res.redirect('/admin/users') }
      }
      catch (err) {
        let user = await req.body.delete;
        // Write error logs
        let description = err.toString();
        let action = "Delete user failed";
        let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
        let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": user}]};
        LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

        // Notification
        NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de la suppréssion de l'utilisateur"});
        req.session.notif = await NotifModel.gettoast();

        res.redirect('/admin/users');
      }
    })();
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
  }
}

// GESTION DES UTILISATEURS (PROFESSEURS + ADMINISTRATION)
exports.getProfs = (req, res, db) => {
	if(req.session.rang == 10) {
		let DBModel = new DB(db);
    let NotifModel = new Notif({bool : false});
    let notification = req.session.notif;
		(async function() {
			let users = await DBModel.getUsers();
			let profs = await DBModel.getProfs();

      // Notification
      req.session.notif = await NotifModel.gettoast();

			res.render("admin/profs.ejs", {data : profs, notification : notification, client : req.session.user});
		})();
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin");
	}

}

// AJOUTER UN PROFESSEURS
exports.addProf = (req, res, db, crypto, fs) => {
	if(req.session.rang == 10) {
    let LogsModel = new Logs();
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
        let DBModel = new DB(db);
        (async function() {


          let duplicata = await double(nom, prenom, pseudo, db);
          if (duplicata == undefined | duplicata == true) {
            NotifModel = new Notif({bool : true, type : "error", message : "Le professeur existe déjà"});
            req.session.notif = await NotifModel.gettoast();
            res.redirect("/admin/profs");
          } else {
            // Add the user
            await DBModel.addProf([nom, prenom, pseudo, password, rang, titre]);
            let dataUser = await DBModel.getUserByPseudo(pseudo);
            //Write logs
            let action = "Create teacher";
            let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": dataUser[0].id, "nom" : dataUser[0].nom, "prenom" : dataUser[0].prenom, "pseudo" : dataUser[0].pseudo, "rang" : rang.toString(), "titre" : titre}]};
            LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "success", message : "Le professeur à été ajouté avec succès"});
            req.session.notif = await NotifModel.gettoast();

            // Redirect to last page
            res.redirect("/admin/profs");
          }
        })();
      } else { res.redirect("/admin/profs") }
    }
    catch (err) {
      (async function() {
        // Write error logs
        let description = err.toString();
        let action = "Create teacher failed";
        let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
        let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description }]};
        LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

        // Notification
        NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de l'ajout du professeur"});
        req.session.notif = await NotifModel.gettoast();

        res.redirect("/admin/profs");
      })();

    }

	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin");
	}
}

// AFFICHER LA LISTE DES PROFESSEURS
exports.editProfView = (req, res, db) => {
	if(req.session.rang == 10) {
		let idprof = req.params.idprof;
		let DBModel = new DB(db);
    let NotifModel = new Notif({bool : false});
    let notification = req.session.notif;
	    (async function() {
			let utilisateur = await DBModel.getUserById(idprof);
			let matieres = await DBModel.getMatieres();
			let enseignematiere = await DBModel.getMatieresForOneProf(idprof);
			utilisateur[0].fullName = function() {return this.nom + " " + this.prenom };

      // Notification
      req.session.notif = await NotifModel.gettoast();

			res.render('admin/editprof.ejs', {user : utilisateur[0], matiere : matieres, enseigne : enseignematiere, notification : notification, client : req.session.user});

		})()
	} else {
		res.redirect("/admin");
	}
}

// METTRE A JOUR LES DONNEES D'UN PROFESSEURS
exports.editProfData = (req, res, db, fs) => {
  if(req.session.rang == 10) {
    let DBModel = new DB(db);
    let LogsModel = new Logs();
    let NotifModel = new Notif();
    let idprof =  req.params.idprof;
    let lastname = (req.body.nomprof.toUpperCase()).replace(/ /g, "");
    let firstname = (cap(req.body.prenomprof.toLowerCase())).replace(/ /g, "");
    (async function () {
      try {
        if((firstname != ('' & undefined)) & (lastname != ('' & undefined))) {
          let pseudo = lastname.substr(0, 7).toLowerCase().replace(" ", "").replace("-", "") + firstname.substr(0,2).toLowerCase().replace(" ", "").replace("-", "");
          // Edit prof data
          await DBModel.editUser(idprof, firstname, lastname, pseudo);
          //Write logs
          let action = "Modify teacher";
          let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": idprof, "nom" : lastname, "prenom" : firstname, "pseudo" : pseudo}]};
          LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

          // Notification
          NotifModel = new Notif({bool : true, type : "success", message : "Le professeur a été mis à jour"});
          req.session.notif = await NotifModel.gettoast();

          res.redirect("/admin/profs/edit/" + idprof);
        } else { res.redirect("/admin/profs/edit/" + idprof) }
      }
      catch (err) {
        // Write error logs
        let description = err.toString();
        let action = "Modify teacher failed";
        let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
        let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description}]};
        LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

        // Notification
        NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de la mise à jour du professeur"});
        req.session.notif = await NotifModel.gettoast();

        res.redirect("/admin/profs/edit/" + idprof);
      }
    })();
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
  }
}

// REINITIALISER LE MOT DE PASSE D'UN PROFESSEUR
exports.defaultPasswordForProf = (req, res, db, crypto, fs) => {
  if(req.session.rang == 10) {
    let DBModel = new DB(db);
    let LogsModel = new Logs();
    let NotifModel = new Notif();
    (async () => {
      try {
        let id = req.params.idprof;
        let userdata = await DBModel.getUserById(id);
        let password = crypto.createHmac('sha256', userdata[0].nom.toUpperCase() + "-" + cap(userdata[0].prenom.toLowerCase()))
                   .update('jojofags suck')
                   .digest('hex');
        // Add default password
        await DBModel.defaultPassword(id, password);
        // Write logs
        let action = "Modify teacher password";
        let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
        let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": id, "nom" : userdata[0].nom, "prenom" : userdata[0].prenom, "pseudo" : userdata[0].pseudo}]};
        LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

        // Notification
        NotifModel = new Notif({bool : true, type : "success", message : "Mot de passe réinitialisé"});
        req.session.notif = await NotifModel.gettoast();

        res.redirect("/admin/profs/edit/" + id);
      }
      catch (err) {
        // Write error logs
        let description = err.toString();
        let action = "Modify teacher password failed";
        let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
        let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description}]};
        LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

        // Notification
        NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de la réinitialisation du mot de passe"});
        req.session.notif = await NotifModel.gettoast();

        res.redirect("/admin/profs/edit/" + id);
      }
    })()
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
  }
}

// MODIFIER L'ATTRIBUTION DES MATIERE A UN PROFESSEUR
exports.matiereToProf = (req, res, db, fs) => {
	if(req.session.rang == 10) {
		let idmatiere = req.body.doprof;
		let idprof = req.params.idprof;
		let DBModel = new DB(db);
    let LogsModel = new Logs();
    let NotifModel = new Notif();
	    (async function() {
        try {
          let data = await DBModel.getMatieresForOneProf(idprof);
          // Verify if teacher already teach this subject
          let bool = await verifier(data, "parseInt(dataOne[i].idmatiere)", parseInt(idmatiere));
          if (bool) {
            // Delete this teacher from this subject
            await DBModel.deleteMatiereForOneProf(idmatiere, idprof);
            // Write logs
            let action = "Delete subject for teacher";
            let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"idteacher": idprof, "idsubject" : idmatiere}]};
            LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "success", message : "Matière désatribuée"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/profs/edit/"+idprof);
          } else {
            // Add this teacher to this subject
            await DBModel.addMatiereToProf(idprof, idmatiere);
            // Write logs
            let action = "Add subject for teacher";
            let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"idteacher": idprof, "idsubject" : idmatiere}]};
            LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

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
          let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description}]};
          LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

          // Notification
          NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de l'atribution/désatribution de matière"});
          req.session.notif = await NotifModel.gettoast();

          res.redirect("/admin/profs/edit/"+idprof);
        }
		})()
	} else {
    req.session.login = false;
    req.session.rang = 0;
		res.redirect("/admin");
	}
}

// ADD USER TO CLASS
exports.addUserToClasse = (req, res, db, crypto, fs) => {
	if(req.session.rang >= 10) {
	   let DBModel = new DB(db);
     let LogsModel = new Logs();
     let NotifModel = new Notif();
  		  (async function() {
          let classe = req.params.idclasse;
          let user = req.body.idUserToAdd
          try {
            await  DBModel.addClasseForUser(user, classe);

            // Write log
            let action = "Add user to class";
            let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"iduser" : user, "idclasse" : classe}]};
            LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "success", message : "L'utilisateur à été ajouté à la classe"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/classes/edit/"+classe);
          }
          catch (err) {
            // Write logs
            let description = err.toString();
            let action = "Add user to class failed";
            let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error Message" : description, "iduser" : user, "idclasse" : classe}]};
            LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Impossible d'ajouter l'utilisateur à la classe"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/classes/edit/"+classe);
          }
  		})()
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home")
	}
}

// METTRE A JOUR LES DONNEES D'UNE CLASSE
exports.doModifClasse = (req, res, db, fs) => {
	if(req.session.rang >= 10) {
		let profprincipal = req.body.profprincipal;
		let nomclasse = req.body.nomclasse;
		let classeToEdit = req.body.idclasse;
	  let DBModel = new DB(db);
    let LogsModel = new Logs();
    let NotifModel = new Notif();
    (async function() {
      try {
        // Edit the following class
        let lastdata = await DBModel.getClasseById(classeToEdit);
        await DBModel.editClasse(classeToEdit, nomclasse, profprincipal);
        // Write logs
        let action = "Modify class";
        let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
        let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": classeToEdit, "nom" : lastdata[0].nomclasse, "main teacher" : lastdata[0].profprincipal}, {"id": classeToEdit, "nom" : nomclasse, "main teacher" : profprincipal}]};
        LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

        // Notification
        NotifModel = new Notif({bool : true, type : "success", message : "La classe a été mise à jour"});
        req.session.notif = await NotifModel.gettoast();

        res.redirect("/admin/classes/edit/"+classeToEdit);
      }
      catch (err) {
        // Write error logs
        let description = err.toString();
        let action = "Modify class failed";
        let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
        let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description}]};
        LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

        // Notification
        NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de la mise à jour de la classe"});
        req.session.notif = await NotifModel.gettoast();

        res.redirect("/admin/classes/edit/"+classeToEdit);
      }
		})();
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home")
	}
}



// GESTION DES CLASSES
exports.getClasses = (req, res, db) => {
	if(req.session.rang == 10) {
    let NotifModel = new Notif({bool : false});
    let notification = req.session.notif
		let DBModel = new DB(db);
	    (async function() {
			let classes = await DBModel.getClassesAndUserCount();

      // Notification
      req.session.notif = await NotifModel.gettoast();

			res.render("admin/classes.ejs", {data : classes, notification : notification, client : req.session.user});
		})();
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin")
	}
}

// AFFICHER LA LISTE DES CLASSES
exports.editClasse = (req, res, db) => {
	if(req.session.rang == 10) {
		let DBModel = new DB(db);
    let NotifModel = new Notif({bool : false});
    let notification = req.session.notif;
	    (async function() {
			let classe = await DBModel.getClasseById(req.params.idclasse);
			let users = await DBModel.getUsersFromClasse(req.params.idclasse);
			let profs = await DBModel.getProfs();
      let userWithoutClasses = await DBModel.getUsersWithoutClasses();

      // Notification
      req.session.notif = await NotifModel.gettoast();

			res.render("admin/editclasse.ejs", {users : users, classe : classe[0], profs : profs, adduser : userWithoutClasses, toast : null, notification : notification, client : req.session.user} );
		})()
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin");
	}
}

// AJOUTER UNE CLASSE
exports.addClasse = (req, res, db, fs) => {
	if(req.session.rang == 10) {
		let DBModel = new DB(db);
    let LogsModel = new Logs();
    let NotifModel = new Notif();
    let classenom = (req.body.nomclasse).replace(/ /g, "");
  	    (async function() {
          try {
            let classeExistantes = await DBModel.getClasses();
            // Verify if this class already exist
            let bool = await verifier(classeExistantes, "dataOne[i].nomclasse", classenom);
            if(classenom != '' & bool == false) {
              // Add class to BDD
        			await DBModel.addClasse(classenom);
              // Get id of new class
              let newclasse = await DBModel.getClasseByNom(classenom);
              // Write log
              let action = "Create class";
              let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
              let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": newclasse[0].idclasse, "nom" : newclasse[0].nomclasse, "main teacher" : newclasse[0].profprincipal}]};
              LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

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
            let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description}]};
            LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de l'ajout de la classe"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/classes");
          }
  		  })();
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin");
	}
}

// SUPPRIMER UNE CLASSE
exports.deleteClasse = (req, res, db, fs) => {
  if(req.session.rang >= 10) {
    let DBModel = new DB(db);
    let LogsModel = new Logs();
    let NotifModel = new Notif();
    (async function() {
      let classe = await req.body.delete;
      try {
        let count = await DBModel.getCountForOneClasse(classe);
        if (classe != undefined & count[0].effectif == 0) {
          let nomclasse = await DBModel.getClasseById(classe);
          // Delete the folowing class
          await DBModel.deleteClasse(classe);
          // Write logs
          let action = "Delete class";
          let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": nomclasse[0].idclasse, "nom" : nomclasse[0].nomclasse}]};
          LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

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
        let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
        let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error Message" : description + " (id : "+classe +")"}]};
        LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

        // Notification
        NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de la suppression de la classe"});
        req.session.notif = await NotifModel.gettoast();

        res.redirect('/admin/classes');
      }
    })()
  } else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin");
	}
}

// SUPPRIMER DES ELEVES DE LA CLASSE
exports.modifElevesInClasse = (req, res, db, fs) => {
    if(req.session.rang >= 10) {
      let DBModel = new DB(db);
      let LogsModel = new Logs();
      let NotifModel = new Notif();
      let iduser = req.body.iduser;
      let idclasse = req.params.idclasse;
      (async () => {
        try {
          // Delete eleve from the following class
          await DBModel.deleteEleveFromClasse(idclasse, iduser);
          // Write logs
          let action = "Modify user class";
          let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"idclass": idclasse, "iduser" : iduser}]};
          LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

          // Notification
          NotifModel = new Notif({bool : true, type : "success", message : "Elève supprimé de la classe"});
          req.session.notif = await NotifModel.gettoast();

          res.redirect("/admin/classes/edit/" + idclasse);
        }
        catch (err) {
          // Write error logs
          let description = err.toString();
          let action = "Modify user class failed";
          let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description}]};
          LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

          // Notification
          NotifModel = new Notif({bool : true, type : "success", message : "Elève supprimé de la classe"});
          req.session.notif = await NotifModel.gettoast();

          res.redirect("/admin/classes/edit/" + idclasse);
        }
      })()
    } else {
      req.session.login = false;
      req.session.rang = 0;
      res.redirect("/admin")
    }
}

// GESTION DES MATIERES
exports.getMatieres = (req, res, db) => {
	if(req.session.rang == 10) {
		let DBModel = new DB(db);
    let NotifModel = new Notif({bool : false});
    let notification = req.session.notif;
		(async function() {
			let matieres = await DBModel.getMatieresAndProfCount();

      // Notifcation
      req.session.notif = await NotifModel.gettoast();

			res.render("admin/matieres.ejs", {data : matieres, notification : notification, client : req.session.user});
		})()
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin")
	}
}

// AJOUTER DES MATIERES
exports.addMatiere = (req, res, db, fs) => {
	if(req.session.rang == 10) {
		let DBModel = new DB(db);
    let LogsModel = new Logs();
    let NotifModel = new Notif();
    let nomMatiere = (req.body.nommatiere).replace(/ /g, "");
	  (async function() {
      try {
        let matiereExistantes = await DBModel.getMatieres();
        // Verify if this subject already exist
        let bool = await verifier(matiereExistantes, "dataOne[i].nommatiere", nomMatiere);
        if (nomMatiere != "" & bool == false) {
          // Add Matière
          await DBModel.addMatiere(nomMatiere);
          // Get id of new subject
          let matiere = await DBModel.getMatiereByNom(nomMatiere);
          // Write logs
          let action = "Create subject";
          let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": matiere[0].id, "nom" : matiere[0].nommatiere}]};
          LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

          // Notification
          NotifModel = new Notif({bool : true, type : "success", message : "Matière ajoutée avec succès"});
          req.session.notif = await NotifModel.gettoast();

          res.redirect("/admin/matieres");
        } else {

          // Notification
          NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de l'ajout de la matière"});
          req.session.notif = await NotifModel.gettoast();

          res.redirect("/admin/matieres")
        };
      }
      catch (err) {
        // Write error logs
        let description = err.toString();
        let action = "Create subject";
        let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
        let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description, "nom" : nomMatiere}]};
        LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

        // Notification
        NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de l'ajout de la matière"});
        req.session.notif = await NotifModel.gettoast();

        res.redirect("/admin/matieres");
      }
		})();
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin");
	}
}

// SUPPRIMER DES MATIERES
exports.deleteMatiere = (req, res, db, fs) => {
  if(req.session.rang >= 10) {
    let DBModel = new DB(db);
    let LogsModel = new Logs();
    let NotifModel = new Notif();
    (async function() {
      let matiere = await req.body.delete;
      if (matiere != undefined) {
        try {
          let matieredata = await DBModel.getMatieresById(matiere);
          // Delete the following subject
          await DBModel.deleteMatiere(matiere);
          // Write logs
          let action = "Delete subject";
          let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": matieredata[0].id, "nom" : matieredata[0].nommatiere}]};
          LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

          // Notification
          NotifModel = new Notif({bool : true, type : "success", message : "Matière supprimée"});
          req.session.notif = await NotifModel.gettoast();

          res.redirect('/admin/matieres');
        }
        catch (err) {
          // Write error logs
          let description = err.toString();
          let action = "Delete subject failed";
          let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message": description,"id": matieredata[0].id}]};
          LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

          // Notification
          NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de la suppression de la matière"});
          req.session.notif = await NotifModel.gettoast();

          res.redirect('/admin/matieres');
        }

      } else { res.redirect('/admin/matieres') }
    })();
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/admin");
  }
}

// AFFICHER LA LISTE DES MATIERES
exports.editmatiere = (req, res, db) => {
    if(req.session.rang >= 10) {
      let DBModel = new DB(db);
      let NotifModel = new Notif({bool : false});
      let notification = req.session.notif;
        (async function() {
        let matiere = await DBModel.getMatieresById(req.params.idmatiere);
        let profs = await DBModel.getProfsForOneMatiere(req.params.idmatiere);
        let profwithoutmatiere = await DBModel.getProfWithoutThisMatiere(req.params.idmatiere);
        console.log(profwithoutmatiere);
        // Notifcation
        req.session.notif = await NotifModel.gettoast();

        res.render("admin/editmatiere.ejs", {matiere : matiere[0], profs : profs, notification : notification, profwithoutmatiere : profwithoutmatiere, client : req.session.user});
      })()
    } else {
      req.session.login = false;
      req.session.rang = 0;
      res.redirect("/admin");
    }
}

// SUPPRIMER UN PROFESSEUR D'UNE MATIERE
exports.deleteProfFromMatiere = (req, res, db, fs) => {
  if(req.session.rang >= 10) {
    let DBModel = new DB(db);
    let LogsModel = new Logs();
    let NotifModel = new Notif();
    let idprof = req.body.idprof;
    let idmatiere = req.params.idmatiere;
      (async function() {
        try {
          // Delete the following teacher from this subject
          await DBModel.deleteMatiereForOneProf(idmatiere, idprof);
          // Write logs
          let action = "Delete teacher from subject";
          let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"teacher": idprof, "subject" : idmatiere}]};
          LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

          // Notification
          NotifModel = new Notif({bool : true, type : "success", message : "Le professeur à été désatribué de cette matière"});
          req.session.notif = await NotifModel.gettoast();

          res.redirect("/admin/matieres/edit/" + idmatiere);
        }
        catch (err) {
          // Write error logs
          let description = err.toString();
          let action = "Delete teacher from subject failed";
          let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description, "teacher": idprof, "subject" : idmatiere}]};
          LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

          // Notification
          NotifModel = new Notif({bool : true, type : "error", message : "Impossible d désatribuer le professeur de cette matière"});
          req.session.notif = await NotifModel.gettoast();

          res.redirect("/admin/matieres/edit/" + idmatiere);
        }
    })()
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/admin")
  }
}

// MODIFIER UNE MATIERE
exports.editMatiereData = (req, res, db, fs) => {
  if(req.session.rang >= 10) {
    let DBModel = new DB(db);
    let LogsModel = new Logs();
    let NotifModel = new Notif();
    let idmatiere = req.params.idmatiere;
    let nommatiere = req.body.nommatiere;
      (async function() {
        try {
          // Get last subject data
          let datasubject = await DBModel.getMatieresById(idmatiere);
          // Update subject name
          await DBModel.editMatiere(idmatiere, nommatiere);
          // Write logs
          let action = "Modify subject";
          let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"id": datasubject[0].id , "nom" : datasubject[0].nommatiere}, {"id": idmatiere, "nom" : nommatiere}]};
          LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

          // Notification
          NotifModel = new Notif({bool : true, type : "success", message : "La matière à été mise à jour"});
          req.session.notif = await NotifModel.gettoast();

          res.redirect("/admin/matieres/edit/" + idmatiere);
        }
        catch (err) {
          // Write error logs
          let description = err.toString();
          let action = "Modify subject failed";
          let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
          let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error message" : description}]};
          LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

          // Notification
          NotifModel = new Notif({bool : true, type : "error", message : "Erreur lors de la mise à jour de la matière"});
          req.session.notif = await NotifModel.gettoast();

          res.redirect("/admin/matieres/edit/" + idmatiere);
        }
    })();
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/admin");
  }
}

exports.addProfToMatiere = (req, res, db, fs) => {
  if(req.session.rang >= 10) {
     let DBModel = new DB(db);
     let LogsModel = new Logs();
     let NotifModel = new Notif();
        (async function() {
          let matiere = req.params.idmatiere;
          let prof = req.body.idProfToAdd;
          try {
            await  DBModel.addClasseForUser(prof, matiere);

            // Write log
            let action = "Add teacher to subject";
            let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"iduser" : user, "idclasse" : classe}]};
            LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "success", message : "Le professeur à été ajouté à la matière"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/matieres/edit/"+matiere);
          }
          catch (err) {
            // Write logs
            let description = err.toString();
            let action = "Add teacher to subject failed";
            let idlog = await LogsModel.getIdLog(fs, req.session.pseudo, getdate());
            let data = {"id": idlog, "nom" : action, "date" : getdate(), "heure" : gethours(), "description" : [{"Error Message" : description, "iduser" : user, "idclasse" : classe}]};
            LogsModel.writeLog(data, fs, getdate(), req.session.pseudo);

            // Notification
            NotifModel = new Notif({bool : true, type : "error", message : "Impossible d'ajouter le professeur à la matière"});
            req.session.notif = await NotifModel.gettoast();

            res.redirect("/admin/matieres/edit/"+matiere);
          }
      })()
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/admin");
  }
}

exports.getEdt = (req, res, db) => {
  if (req.session.rang >= 10) {
    let DBModel = new DB(db);
    (async ()=> {

      let edt = await DBModel.getEdtForOneClasse(req.params.idclasse);
      let classes = await DBModel.getClasses();
      let matieres = await DBModel.getMatieresAndTheseProfsForOneClasse(req.params.idclasse);

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
    })();
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/admin");
  }
}

exports.postEdt = (req, res, db) => {
  if (req.session.rang >= 10) {
    let DBModel = new DB(db);
    let html_timetable = JSON.parse(req.body.data_timetable);
    //console.log(1, html_timetable);

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

    (async () => {
      // parseInt TO AVOID SQL INJECTION
      DBModel.deleteTimeTable(parseInt(req.params.id));
      DBModel.addTimeTable(array, parseInt(req.params.id))
      console.log(array, array.length);
      res.redirect("/admin/edt/"+req.params.id);
    })();

  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/admin");
  }
}

/*
======================
MODULES PROFESSEURS
======================
*/

exports.getNotesForUsers = (req, res, db) => {
  if (req.session.rang >= 5) {
    let DBModel = new DB(db);
    (async () => {
      try {
        let control = await DBModel.getControlByIdProf(req.session.user[0].id);
        let classes = await DBModel.getUsersByIdProf(req.session.user[0].id);
        let matiere = await DBModel.getMatieresForOneProf(req.session.user[0].id);
        function verify_params() {
          let bool = false;
          for (let items in control) {
            if (control[items].id == req.params.id) {
              bool = true;
              return bool;
            }
          }
          return bool;
        }

        if (await verify_params()) {
          let data_control = await DBModel.getDataControlById(req.params.id);
          res.render('prof/notes.ejs', {client : req.session.user, classes : classes, control : control , data_control : data_control, index : req.params.id, matiere : matiere});
        } else {
          res.render('prof/notes.ejs', {client : req.session.user, classes : classes, control : control, matiere : matiere});
        }
      } catch (err) {
        console.log(err);
        res.redirect("/home");
      }
    })();
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/admin");
  }
}

exports.postAddNewDs = (req, res, db) => {
  if (req.session.rang >= 5) {
    let DBModel = new DB(db);
    (async () => {
      await DBModel.addControl(JSON.parse(req.body.data_ds), req.session.user[0].id);
    })();
    console.log("data : ", JSON.parse(req.body.data_ds));
    res.redirect("/prof/notes/index");
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
  }
}

exports.postModifiyDs = (req, res, db) => {
  if (req.session.rang >= 5) {
    let DBModel = new DB(db);
    (async () => {
      await DBModel.update_DS(JSON.parse(req.body.data_header), JSON.parse(req.body.data_body), req.params.id);
      console.log(JSON.parse(req.body.data_header));
      console.log(JSON.parse(req.body.data_body));
      res.redirect("/prof/notes/index");
    })();
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
  }
}

exports.postDeleteDs = (req, res, db) => {
  if (req.session.rang >= 5) {
    let DBModel = new DB(db);
    (async () => {
      // VERIFY IF THIS TEACHER CAN DELETE THIS CONTROL
      let verifier = await DBModel.verifyProfAndDS(req.params.id);
      if (verifier[0].id_prof == req.session.user[0].id) {
        await DBModel.delete_ds(req.params.id);
      }
      res.redirect("/prof/notes/index");
    })();
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
  }
}

/*
======================
MODULES UTILISATEURS
======================
*/

exports.getNotes = (req, res, db) => {
  if (req.session.rang == 1) {
    let DBModel = new DB(db);
    (async () => {
      let notes = await DBModel.getNotesByIdUser(req.session.user[0].id)
      console.log(notes)
      res.render("user/notes.ejs", { client : req.session.user, notes : notes})
    })();
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
  }
}


/*
======================
MODULES DE LOGS
======================
*/

// GESTION DES LOGS

exports.getLog = (req, res, fs) => {
  if(req.session.rang >= 10) {

    let path = "./Logs/["+getdate()+"]/";
    let tab = new Array()
    let LogsModel = new Logs();
    (async function() {
      let dir = await LogsModel.readdirectory(fs, path);
      for (i=0;i<dir.length;i++) {
        tab[i] = await LogsModel.readfile(fs, path, dir[i]);
      }
      res.render('admin/log.ejs', {data : await tab, client : req.session.user });
    })();

  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/admin");
  }
}

// AFFICHER LES DETAILS D'UN LOG
exports.getLogforUser = (req, res, fs) => {
  if(req.session.rang >= 10) {
    let idlog = req.params.id;
    let file = "log-["+req.params.pseudo+"]_["+req.params.date+"].json";
    let path = "./Logs/["+req.params.date+"]/";
    let fullpath = path + file;
    let content;
    let LogsModel = new Logs();
    (async function() {
      content = await LogsModel.readfileForOneUser(fs, fullpath, idlog);
      res.render('admin/logedit.ejs', {data : content, pseudo : req.params.pseudo, client : req.session.user});
    })();
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/admin");
  }
}
