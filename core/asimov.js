/*
======================
MISC FUNCTIONS
======================

Liste fonctions :

cap(string) : renvoie un string avec la première lettre en majuscule et le reste en minuscule

double(nom, prenom, pseudo, db) : renvoie true lorsque l'utilisateur se trouve déjà dans la BDD
                                  et false lorsqu'il ne s'y trouve pas (évite les duplicatas)
verifier(dataOne, dataOneVar, dataTwo) : renvoie true lorsque la valeur 2 est présente dans la valeur 1 et false dans le cas contraire
                                        dataOneVar est un string, avec la focntion eval() => transform str en fonction
                                        à personaliser en fonction des besoins.
                                        /!\ attention, remplacer dataOneVar par : "dataOne[i].attribut"
*/

const DB = require('./classes.js');
var logs = require('../Logs/log.js');

const cap = (s) => {
  if (typeof s !== 'string') return ''
  return s.toLowerCase().charAt(0).toUpperCase() + s.slice(1)
}


const double = (nom, prenom, pseudo, db) => {
  try {
    let DBModel = new DB(db);
    (async function() {
      await DBModel.getUserDuplicate(nom, prenom, pseudo);
      return true
    })();
  }
  catch (err) {
    return false
  }
}

const verifier = (dataOne, dataOneVar, dataTwo) => {
  for (i=0;i<dataOne.length;i++) {
    if (eval(dataOneVar) == dataTwo)  return true;
  }
  return false;
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
	if(req.session.login) {
		res.render("index.ejs");
	} else {
		res.render("login.ejs");
	}
}


exports.login = (req, res, db, crypto, fs) => {
	let pseudo = req.body.pseudo;
	let password = crypto.createHmac('sha256', req.body.password)
	               .update('jojofags suck')
	               .digest('hex');
	let DBModel = new DB(db);
  let action = "Connexion"
	(async function() {
    try {
      let userLogin = await DBModel.login(pseudo, password);
  		if(userLogin.length != 0) {
  			req.session.login = true;
  	    	req.session.rang = userLogin[0].rang;
  	    	if(userLogin[0].rang >= 5) {
            req.session.pseudo = pseudo;
            // Write logs
            let data = "       ======= "+ Date() +" =======  \n \n user : " +  pseudo +"\n action : "+action+" \n \n";
            logs.writeLog(data, fs);
  	    		res.redirect("/admin");
  	    	} else {
  	    		res.redirect("/home");
  	    	}
  		} else {
  	    	res.redirect("/home");
  	    }
    }
    catch (err) {
      // Write error logs
      logs.writeErrorLog(fs, req, action, err);
      res.redirect("/home");
    }

	})();
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
exports.getAdminInfo = (req, res, db) => {
	if(req.session.rang >= 5) {
		let DBModel = new DB(db);
		(async function() {
			let userCount = await DBModel.userCount();
			let profCount = await DBModel.profCount();
			let classeCount = await DBModel.classeCount();
			let matiereCount = await DBModel.matiereCount();
			res.render("admin/admin.ejs", {counts : [userCount, profCount, classeCount, matiereCount]});
		})()
	}
}



// GESTION DES UTILISATEURS (ELEVES)
exports.getUsers = (req, res, db) => {
	if(req.session.rang >= 5) {
		let DBModel = new DB(db);
		(async function() {
			let users = await DBModel.getUsers();
			let classes = await DBModel.getClasses();
			res.render("admin/users.ejs", {data : users, classe : classes});
		})()
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home")
	}
}


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

  	    let DBModel = new DB(db);
  		(async function() {
        if(double(nom, prenom, pseudo, db)) {
  			  await DBModel.addUser(userInputs, classe);
          let data = "       ======= "+ Date() +" =======  \n \n user : " +  req.session.pseudo +"\n action : Add user \n objet : New user [nom="+nom+", prénom="+prenom+", classe="+classe+", pseudo="+pseudo+", rang="+rang+"]\n \n";
          logs.writeLog(data, fs);
  			  res.redirect("/admin/users");
        } else {
          res.redirect("/admin/users");
        }
  		})()
    } else { res.redirect("/admin/users"); }


	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home")
	}
}

exports.editUsersView = (req, res, db) => {
    if(req.session.rang == 10) {
      let DBModel = new DB(db);
      (async function() {
        let users = await DBModel.getUserById(req.params.ideleve);
        let classes = await DBModel.getClasses();
        let classeofuser = await DBModel.getUserClasseFromId(req.params.ideleve);
        res.render("admin/edituser.ejs", {data : users, classe : classes, userClasse : classeofuser});
      })()
    } else {
  		req.session.login = false;
  		req.session.rang = 0;
  		res.redirect("/home")
  	}
}

exports.editUserData = (req, res, db, fs) => {
  if(req.session.rang == 10) {
    let DBModel = new DB(db);
    let action = "Edit User Data";
    let iduser =  req.params.ideleve;
    let lastname = (req.body.nomeleve.toUpperCase()).replace(/ /g, "");
    let firstname = (cap(req.body.prenomeleve.toLowerCase())).replace(/ /g, "");
    let classe = req.body.classe;
    (async function () {
      try {
        if((firstname != ('' & undefined)) & (lastname != ('' & undefined)) & classe != undefined) {
          let pseudo = lastname.substr(0, 7).toLowerCase().replace(" ", "").replace("-", "") + firstname.substr(0,2).toLowerCase().replace(" ", "").replace("-", "");
          // Edit user data
          await DBModel.editUser(iduser, firstname, lastname, pseudo);
          // Update user class
          await DBModel.updateClasseOfUser(iduser, classe);
          // Write logs
          let data = "       ======= "+ Date() +" =======  \n \n user : " +  req.session.pseudo +"\n action : Edit user \n objet : User [id="+iduser+", nom="+lastname+", prenom="+firstname+", classe="+classe+", pseudo="+pseudo+"]\n \n";
          logs.writeLog(data, fs);
          res.redirect("/admin/users/edit/" + iduser);
        } else {
          res.redirect("/admin/users/edit/" + iduser);
        }
      }
      catch (err) {
        // Write error logs
        logs.writeErrorLog(fs, req, action, err);
        res.redirect("/admin/users/edit/" + iduser);
      }
    })()
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
  }
}

exports.defaultPasswordForUser = (req, res, db, crypto, fs) => {
  if(req.session.rang == 10) {
    let DBModel = new DB(db);
    let action = "Default password"
    (async () => {
      try {
        let id = req.params.ideleve;
        // Get user data by Id
        let data = await DBModel.getUserById(id);
        // Encrypt password for BDD
        let password = crypto.createHmac('sha256', data[0].nom.toUpperCase() + "-" + cap(data[0].prenom.toLowerCase()))
                   .update('jojofags suck')
                   .digest('hex');
        await DBModel.defaultPassword(id, password);
        // Write logs
        let log = "       ======= "+ Date() +" =======  \n \n user : " +  req.session.pseudo +"\n action : Edit password \n objet : User [id="+id+"]\n \n";
        logs.writeLog(log, fs);
        res.redirect("/admin/users/edit/" + id)
      }
      catch (err) {
        // Write error logs
        logs.writeErrorLog(fs, req, action, err);
        res.redirect("/admin/users/edit/" + id)
      }
    })()
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home")
  }
}

exports.deleteUser = (req, res, db, fs) => {
  if(req.session.rang >= 10) {
    let DBModel = new DB(db);
    let action = "Delete User"
    (async function() {
      try {
        let user = await req.body.delete;
        let dataUser = await DBModel.getUserById(user);
        // GET RANG OF USER TO REDIRECT TO THE CORRECT PAGE
        let rangUser = await DBModel.getRangUserWithId(user);
        if (user != undefined) {
          // DELETE USERS AND PROFS
          await DBModel.deleteUser(user)
          // Write logs
          let log = "       ======= "+ Date() +" =======  \n \n user : " +  req.session.pseudo +"\n action : Delete \n objet : User [id="+dataUser[0].id+", Nom="+dataUser[0].nom+", prénom="+dataUser[0].prenom+"]\n \n";
          logs.writeLog(log, fs);
          // Redirect to the corresponding page
          if(rangUser[0].rang < 5) {
          res.redirect('/admin/users');
          } else {
            res.redirect('/admin/profs');
          }
        } else { res.redirect('/admin/users') }
      }
      catch (err) {
        logs.writeErrorLog(fs, req, action, err)
        res.redirect('/admin/users');
      }
    })()
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
		(async function() {
			let users = await DBModel.getUsers();
			let profs = await DBModel.getProfs();
			res.render("admin/profs.ejs", {data : profs});
		})()
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin");
	}

}

exports.addProf = (req, res, db, crypto, fs) => {
	if(req.session.rang == 10) {
    let action = "Add Prof";
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
          // Verify if this user already exist
          if(double(nom, prenom, pseudo, db)) {
            // Add the user
            await DBModel.addProf([nom, prenom, pseudo, password, rang, titre]);
            //Write logs
            let log = "       ======= "+ Date() +" =======  \n \n user : " +  req.session.pseudo +"\n action : Add Prof \n objet : User [nom="+nom+", prénom="+prenom+", pseudo="+pseudo+", rang="+rang+", titre="+titre+"]\n \n";
            logs.writeLog(log, fs);
            // Redirect to last page
            res.redirect("/admin/profs");
          }
          else { res.redirect("/admin/profs") }
        })();
      } else { res.redirect("/admin/profs") }
    }
    catch (err) {
      // Write error logs
      logs.writeErrorLog(fs, req, action, err);
      res.redirect("/admin/profs");
    }

	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin");
	}
}

exports.editProfView = (req, res, db) => {
	if(req.session.rang == 10) {
		let idprof = req.params.idprof;
		let DBModel = new DB(db);
	    (async function() {
			let utilisateur = await DBModel.getUserById(idprof);
			let matieres = await DBModel.getMatieres();
			let enseignematiere = await DBModel.getMatieresForOneProf(idprof);
			utilisateur[0].fullName = function() {return this.nom + " " + this.prenom }
			res.render('admin/editprof.ejs', {user : utilisateur[0], matiere : matieres, enseigne : enseignematiere});

		})()
	} else {
		res.redirect("/admin");
	}
}

exports.editProfData = (req, res, db, fs) => {
  if(req.session.rang == 10) {
    let DBModel = new DB(db);
    let action = "Edit Prof Data"
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
          let log = "       ======= "+ Date() +" =======  \n \n user : " +  req.session.pseudo +"\n action : Add Prof \n objet : Prof [id="+idprof+",nom="+lastname+", prénom="+firstname+", pseudo="+pseudo+"]\n \n";
          logs.writeLog(log, fs);
          res.redirect("/admin/profs/edit/" + idprof);
        } else { res.redirect("/admin/profs/edit/" + idprof) }
      }
      catch (err) {
        // Write error logs
        logs.writeErrorLog(fs, req, action, err);
        res.redirect("/admin/profs/edit/" + idprof);
      }
    })()
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
  }
}

exports.defaultPasswordForProf = (req, res, db, crypto, fs) => {
  if(req.session.rang == 10) {
    let DBModel = new DB(db);
    let action = "Default password (prof)"
    (async () => {
      try {
        let id = req.params.idprof;
        let data = await DBModel.getUserById(id);
        let password = crypto.createHmac('sha256', data[0].nom.toUpperCase() + "-" + cap(data[0].prenom.toLowerCase()))
                   .update('jojofags suck')
                   .digest('hex');
        // Add default password
        await DBModel.defaultPassword(id, password);
        // Write logs
        let log = "       ======= "+ Date() +" =======  \n \n user : " +  req.session.pseudo +"\n action : Add Prof \n objet : Prof [id="+data[0].id+",nom="+data[0].nom+", prénom="+data[0].prenom+", pseudo="+data[0].pseudo+"]\n \n";
        logs.writeLog(log, fs);
        res.redirect("/admin/profs/edit/" + id);
      }
      catch (err) {
        // Write error logs
        logs.writeErrorLog(fs, req, action, err);
        res.redirect("/admin/profs/edit/" + id);
      }
    })()
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/home");
  }
}

exports.matiereToProf = (req, res, db, fs) => {
	if(req.session.rang == 10) {
		let idmatiere = req.body.doprof;
		let idprof = req.params.idprof;
		let DBModel = new DB(db);
    let action = "Edit Matière Prof";
	    (async function() {
        try {
          let data = await DBModel.getMatieresForOneProf(idprof);
          // Verify if teacher already teach this subject
          let bool = await verifier(data, "parseInt(dataOne[i].idmatiere)", parseInt(idmatiere));
          if (bool) {
            // Delete this teacher from this subject
            await DBModel.deleteMatiereForOneProf(idmatiere, idprof);
            // Write logs
            let log = "       ======= "+ Date() +" =======  \n \n user : "+ req.session.pseudo +"\n action : "+ action +" \n objet : Matière [idprof="+idprof+" ,idmatiere="+idmatiere+"], From [true], To [false] \n \n";
            logs.writeLog(log, fs);
            res.redirect("/admin/profs/edit/"+idprof);
          } else {
            // Add this teacher to this subject
            await DBModel.addMatiereToProf(idprof, idmatiere);
            // Write log
            let log = "       ======= "+ Date() +" =======  \n \n user : "+ req.session.pseudo +"\n action : "+ action +" \n objet : Matière [idprof="+idprof+" ,idmatiere="+idmatiere+"], From [False], To [True] \n \n";
            logs.writeLog(log, fs);
            res.redirect("/admin/profs/edit/"+idprof);
          }
        }
        catch (err) {
          // Write errors logs
          logs.writeErrorLog(fs, req, action, err);
          res.redirect("/admin/profs/edit/"+idprof);
        }

		})()
	} else {
    req.session.login = false;
    req.session.rang = 0;
		res.redirect("/admin");
	}
}

// Suspendu
exports.addUserToClasse = (req, res, db, crypto, fs) => {
	if(req.session.rang >= 10) {
	    let nom = req.body.nom.toUpperCase();
	    let prenom = cap(req.body.prenom.toLowerCase());
      let classe = req.body.classe;
      if ((nom != ('' & undefined)) & (prenom != ('' & undefined))) {
  	    let pseudo = nom.substr(0, 7).toLowerCase().replace(" ", "").replace("-", "") + prenom.substr(0,2).toLowerCase().replace(" ", "").replace("-", "");
  	    let password = crypto.createHmac('sha256', nom + "-" + prenom)
  	               .update('jojofags suck')
  	               .digest('hex');
  	    let rang = 1;
  	    let titre = "Élève";
  	    let userInputs = [nom, prenom, pseudo, password, rang, titre];
  	    let DBModel = new DB(db);
        let action = "Add User";
  		  (async function() {
          try {
            // Add an user
            await DBModel.addUser(userInputs, classe);
            // Write log
            let log = "       ======= "+ Date() +" =======  \n \n user : "+ req.session.pseudo +"\n action : "+ action +" \n objet : Matière [nom="+nom+" ,prenom="+prenom+", pseudo="+pseudo+", classe="+classe+", rang="+rang+", titre="+titre+"] \n \n";
            logs.writeLog(log, fs);
      			res.redirect("/admin/classes/edit/"+classe);
          }
          catch (err) {
            // Write logs
            logs.writeErrorLog(fs, req, action, err)
            res.redirect("/admin/classes/edit/"+classe);
          }
  		})()
      } else { res.redirect("/admin/classes/edit/"+classe); }
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home")
	}
}

exports.doModifClasse = (req, res, db, fs) => {
	if(req.session.rang >= 10) {
		let profprincipal = req.body.profprincipal;
		let nomclasse = req.body.nomclasse;
		let classeToEdit = req.body.idclasse;
	  let DBModel = new DB(db);
    let action = "Edit Classe";
    (async function() {
      try {
        // Edit the following class
        let lastdata = await DBModel.getClasseById(classeToEdit);
        await DBModel.editClasse(classeToEdit, nomclasse, profprincipal);
        let log = "       ======= "+ Date() +" =======  \n \n user : "+ req.session.pseudo +"\n action : "+ action +" \n objet : From [id="+classeToEdit+", nom="+lastdata[0].nomclasse+", prof principal="+lastdata[0].profprincipal+"] \n         To [id="+classeToEdit+", nom="+nomclasse+", prof principal="+profprincipal+"] \n \n";
        logs.writeLog(log, fs);
        res.redirect("/admin/classes/edit/"+classeToEdit);
      }
      catch (err) {
        // Write logs
        logs.writeErrorLog(fs, req, action, err)
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

		let DBModel = new DB(db);
	    (async function() {
			let classes = await DBModel.getClassesAndUserCount();
			res.render("admin/classes.ejs", {data : classes});
		})()

	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin")
	}
}

exports.editClasse = (req, res, db) => {
	if(req.session.rang == 10) {
		let DBModel = new DB(db);
	    (async function() {
			let classe = await DBModel.getClasseById(req.params.idclasse);
			let users = await DBModel.getUsersFromClasse(req.params.idclasse);
			let profs = await DBModel.getProfs();
			res.render("admin/editclasse.ejs", {users : users, classe : classe[0], profs : profs} );
		})()
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin")
	}
}

exports.addClasse = (req, res, db, fs) => {
	if(req.session.rang == 10) {
		let DBModel = new DB(db);
    let action = "Add Classe"
    let classenom = (req.body.nomclasse).replace(/ /g, "");
  	    (async function() {
          try {
            let classeExistantes = await DBModel.getClasses();
            // Verify if this class already exist
            let bool = await verifier(classeExistantes, "dataOne[i].nomclasse", classenom);
            if(classenom != '' & bool == false) {
              // Add class to BDD
        			let classes = await DBModel.addClasse(classenom);
              // Write log
              let log = "       ======= "+ Date() +" =======  \n \n user : "+ req.session.pseudo +"\n action : "+ action +" \n objet : Classe [nom="+classenom+"] \n \n";
              logs.writeLog(log, fs);
        			res.redirect("/admin/classes");
            } else res.redirect("/admin/classes");
          }
          catch (err) {
            // Write error logs
            logs.writeErrorLog(fs, req, action, err)
            res.redirect("/admin/classes");
          }
  		  })()
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin");
	}
}

exports.deleteClasse = (req, res, db, fs) => {
  if(req.session.rang >= 10) {
    let DBModel = new DB(db);
    let action = "Delete Classe"
    (async function() {
      let classe = await req.body.delete;
      try {
        let count = await DBModel.getCountForOneClasse(classe);
        if (classe != undefined & count[0].effectif == 0) {
          let nomclasse = await DBModel.getClasseById(classe);
          // Delete the folowing class
          await DBModel.deleteClasse(classe);
          // Write logs
          let data = "       ======= "+ Date() +" =======  \n \n user : " + req.session.pseudo +"\n action : "+action+" \n objet : Classe [id="+classe+", nom="+nomclasse[0].nomclasse+"]\n \n";
          logs.writeLog(data, fs);
          res.redirect('/admin/classes');
        } else { res.redirect('/admin/classes'); }
      }
      catch (err) {
        // Write erros logs
        logs.writeErrorLog(fs, req, action, err);
        res.redirect('/admin/classes');
      }
    })()
  } else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin");
	}
}

exports.modifElevesInClasse = (req, res, db, fs) => {
    if(req.session.rang >= 10) {
      let DBModel = new DB(db);
      let action = "Delete Eleve From Classe";
      let iduser = req.body.iduser;
      let idclasse = req.params.idclasse;
      (async () => {
        try {
          // Delete eleve from the following class
          await DBModel.deleteEleveFromClasse(idclasse, iduser);
          // Write logs
          let data = "       ======= "+ Date() +" =======  \n \n user : " + req.session.pseudo +"\n action : "+action+" \n objet :  [idclasse="+idclasse+", iduser="+iduser+"]\n \n";
          logs.writeLog(data, fs);
          res.redirect("/admin/classes/edit/" + idclasse);
        }
        catch (err) {
          // Write erros logs
          logs.writeErrorLog(fs, req, action, err);
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
		(async function() {
			let matieres = await DBModel.getMatieresAndProfCount();
			res.render("admin/matieres.ejs", {data : matieres});
		})()
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin")
	}
}

exports.addMatiere = (req, res, db, fs) => {
	if(req.session.rang == 10) {
		let DBModel = new DB(db);
    let action = "Add Matière"
    let nomMatiere = (req.body.nommatiere).replace(/ /g, "");
	  (async function() {
      try {
        let matiereExistantes = await DBModel.getMatieres();
        // Verify if this subject already exist
        let bool = await verifier(matiereExistantes, "dataOne[i].nommatiere", nomMatiere);
        if (nomMatiere != "" & bool == false) {
          // Add Matière
          await DBModel.addMatiere(nomMatiere);
          // Write logs
          let data = "       ======= "+ Date() +" =======  \n \n user : " + req.session.pseudo +"\n action : "+action+" \n objet :  Matière [nom="+nomMatiere+"]\n \n";
          logs.writeLog(data, fs);
          res.redirect("/admin/matieres");
        } else res.redirect("/admin/matieres");
      }
      catch (err) {
        // Write error logs
        logs.writeErrorLog(fs, req, action, err);
        res.redirect("/admin/matieres");
      }
		})();
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin")
	}
}

exports.deleteMatiere = (req, res, db, fs) => {
  if(req.session.rang >= 10) {
    let DBModel = new DB(db);
    let action = "Delete Matière"
    (async function() {
      let matiere = await req.body.delete;
      if (matiere != undefined) {
        try {
          // Delete the following subject
          await DBModel.deleteMatiere(matiere);
          // Write logs
          let data = "       ======= "+ Date() +" =======  \n \n user : " + req.session.pseudo +"\n action : "+action+" \n objet :  Matière [id="+matiere+"]\n \n";
          logs.writeLog(data, fs);
          res.redirect('/admin/matieres');
        }
        catch (err) {
          // Write error logs
          logs.writeErrorLog(fs, req, action, err);
          res.redirect('/admin/matieres');
        }

      } else { res.redirect('/admin/matieres') }
    })()
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/admin")
  }
}

exports.editmatiere = (req, res, db) => {
    if(req.session.rang >= 10) {
      let DBModel = new DB(db);
        (async function() {
        let matiere = await DBModel.getMatieresById(req.params.idmatiere);
        let profs = await DBModel.getProfsForOneMatiere(req.params.idmatiere);
        res.render("admin/editmatiere.ejs", {matiere : matiere[0], profs : profs} );
      })()
    } else {
      req.session.login = false;
      req.session.rang = 0;
      res.redirect("/admin")
    }
}

exports.deleteProfFromMatiere = (req, res, db) => {
  if(req.session.rang >= 10) {
    let DBModel = new DB(db);
    let action = "Delete Prof From Matière";
    let idprof = req.body.idprof;
    let idmatiere = req.params.idmatiere;
      (async function() {
        try {
          // Delete the following teacher from this subject
          await DBModel.deleteMatiereForOneProf(idmatiere, idprof);
          // Write logs
          let data = "       ======= "+ Date() +" =======  \n \n user : " + req.session.pseudo +"\n action : "+action+" \n objet : [idprof="+idprof+", idmatiere="+idmatiere+"]\n \n";
          logs.writeLog(data, fs);
          res.redirect("/admin/matieres/edit/" + idmatiere);
        }
        catch (err) {
          // Write error logs
          logs.writeErrorLog(fs, req, action, err);
          res.redirect("/admin/matieres/edit/" + idmatiere);
        }

    })()
  } else {
    req.session.login = false;
    req.session.rang = 0;
    res.redirect("/admin")
  }
}
