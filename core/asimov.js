/*
======================
MISC FUNCTIONS
====================== 

Liste fonctions :

cap(string) : renvoie un string avec la première lettre en majuscule et le reste en minuscule
*/

const DB = require('./classes.js');

const cap = (s) => {
  if (typeof s !== 'string') return ''
  return s.toLowerCase().charAt(0).toUpperCase() + s.slice(1)
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


exports.login = (req, res, db, crypto) => {
	let pseudo = req.body.pseudo;
	let password = crypto.createHmac('sha256', req.body.password)
	               .update('jojofags suck')
	               .digest('hex');

	let DBModel = new DB(db);
	(async function() {
		let userLogin = await DBModel.login(pseudo, password);
		if(userLogin.length != 0) {
			req.session.login = true;
	    	req.session.rang = userLogin[0].rang;
	    	if(userLogin[0].rang >= 5) {
	    		res.redirect("/admin");
	    	} else {
	    		res.redirect("/home");
	    	}
		} else {
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


exports.addUser = (req, res, db, crypto) => {
	if(req.session.rang >= 5) {
	    let nom = req.body.nom.toUpperCase();
	    let prenom = cap(req.body.prenom.toLowerCase());
	    let classe = req.body.classe;
	    let pseudo = nom.substr(0, 7).toLowerCase().replace(" ", "").replace("-", "") + prenom.substr(0,2).toLowerCase().replace(" ", "").replace("-", "");
	    let password = crypto.createHmac('sha256', nom + "-" + prenom)
	               .update('jojofags suck')
	               .digest('hex');
	    let rang = 1
	    let titre = "Élève";

	    let userInputs = [nom, prenom, pseudo, password, rang, titre];

	    let DBModel = new DB(db);
		(async function() {
			await DBModel.addUser(userInputs, classe);
			res.redirect("/admin/users");
		})()


	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home")
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
		res.redirect("/admin")
	}
	
}

exports.addProf = (req, res, db, crypto) => {
	if(req.session.rang == 10) {
	    let nom = req.body.nom.toUpperCase();
	    let prenom = cap(req.body.prenom.toLowerCase());
	    let pseudo = nom.substr(0, 7).toLowerCase().replace(" ", "").replace("-", "") + prenom.substr(0,2).toLowerCase().replace(" ", "").replace("-", "");
	    let password = crypto.createHmac('sha256', nom + "-" + prenom)
	               .update('jojofags suck')
	               .digest('hex');
	    let rang = 5
	    let titre = "Professeur";
	    let DBModel = new DB(db);
	    (async function() {
			let insertedProf = await DBModel.addProf([nom, prenom, pseudo, password, rang, titre]);
			res.redirect("/admin/profs")
		})()	    
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin")
	}
}

exports.editProfView = (req, res, db) => {
	if(req.session.rang == 10) {
		let pseudo = req.params.pseudo;
		let DBModel = new DB(db);
	    (async function() {
			let utilisateur = await DBModel.getUserByPseudo(pseudo);
			let matieres = await DBModel.getMatieres();
			let enseignematiere = await DBModel.getMatieresForOneProf(utilisateur[0].id);
			utilisateur[0].fullName = function() {return this.nom + " " + this.prenom }
			res.render('admin/editprof.ejs', {user : utilisateur[0], matiere : matieres, enseigne : enseignematiere});

		})()
	} else {
		res.redirect("/admin");
	}
}

exports.matiereToProf = (req, res, db) => {
	if(req.session.rang == 10) {
		let idmatiere = req.body.doprof;
		let idprof = req.body.idprof;
		let DBModel = new DB(db);
	    (async function() {
	    	let insertEnseigne = await DBModel.addMatiereToProf(idprof, idmatiere);
	    	let prof = await DBModel.getUserById(idprof);
	    	res.redirect("/admin/profs/edit/"+prof[0].pseudo);
		})()
	} else {
		res.redirect("/admin");
	}
}

exports.addUserToClasse = (req, res, db, crypto) => {
	if(req.session.rang >= 10) {
	    let nom = req.body.nom.toUpperCase();
	    let prenom = cap(req.body.prenom.toLowerCase());
	    let classe = req.body.classe;
	    let pseudo = nom.substr(0, 7).toLowerCase().replace(" ", "").replace("-", "") + prenom.substr(0,2).toLowerCase().replace(" ", "").replace("-", "");
	    let password = crypto.createHmac('sha256', nom + "-" + prenom)
	               .update('jojofags suck')
	               .digest('hex');
	    let rang = 1
	    let titre = "Élève";

	    let userInputs = [nom, prenom, pseudo, password, rang, titre];

	    let DBModel = new DB(db);
		(async function() {
			await DBModel.addUser(userInputs, classe);
			res.redirect("/admin/classes/edit/"+classe);
		})()


	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home")
	}
}

exports.doModifClasse = (req, res, db) => {
	if(req.session.rang >= 10) {
		let profprincipal = req.body.profprincipal;
		let nomclasse = req.body.nomclasse;
		let classeToEdit = req.body.idclasse;



	    let DBModel = new DB(db);
		(async function() {
			await DBModel.editClasse(classeToEdit, nomclasse, profprincipal);
			res.redirect("/admin/classes/edit/"+classeToEdit);
		})()


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

exports.addClasse = (req, res, db) => {
	if(req.session.rang == 10) {
		let DBModel = new DB(db);
	    (async function() {
			let classes = await DBModel.addClasse(req.body.nomclasse);
			res.redirect("/admin/classes");
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

exports.addMatiere = (req, res, db) => {
	if(req.session.rang == 10) {
		let DBModel = new DB(db);
	    (async function() {
			let matieres = await DBModel.addMatiere(req.body.nommatiere);
			res.redirect("/admin/matieres");
		})()	
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/admin")
	}
}


