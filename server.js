const port = process.env.PORT || 3000;
const iniparser = require('iniparser');
const configDB = iniparser.parseSync('DB.ini'); 
/*
const DB_HOST = "localhost"
const DB_NAME = "asimov"
const DB_USER = "root"
const DB_PASS = ""*/

const fs = require('fs');
const toastr = require('express-toastr');
const flash = require('connect-flash')
const asimov = require("./core/asimov.js");
const socket = require("./core/socket.js")
const express = require('express');
const session = require('express-session')
const socketSession = require("socket.io-session-middleware");
const bodyParser = require("body-parser");
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
var db = mysql.createConnection({
  host:configDB['dev']['host'],
  user:configDB['dev']['user'],
  password:configDB['dev']['password'],
  database:configDB['dev']['database'],
  multipleStatements: true
});

var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var ent = require('ent');



app.use(express.static(__dirname + '/public')) // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!", resave: true, saveUninitialized: true}));



db.connect(function(err) {
  	if (err) throw err;
  	console.log("Connecté à la base de données '"+ configDB['dev']['database'] +"'");

    socket.listen(io, db, ent, session);


    /* GLOBAT GET ROUTES */
	app.get("/", (req, res) => {
		asimov.doLogStuff(req, res);
	});
	app.get("/home", (req, res) => {
		asimov.doLogStuff(req, res);
	});
	app.get("/faq", (req, res) => {
		res.render("faq.ejs");
	});
	app.get("/login", (req, res) => {
		asimov.doLogStuff(req, res);
	});
	app.get("/logout", (req, res) => {
		req.session.login = false;
		res.redirect("/");
	});

  app.get("/profil", (req, res) => {
    asimov.getProfil(req, res, db);
  });

  app.get("/parameters", (req, res) => {
    asimov.getParameters(req, res, db);
  });

  app.get("/discussions", (req, res) => {
    asimov.getDiscussions(req, res, db);
  });

  app.post('/postMessage', (req, res) => {
    asimov.postMessage(req, res, db);
  });

	/* END GLOBAT GET ROUTES */


	/* ADMIN ROUTES */
	app.get("/admin", (req, res) => {
		if(req.session.login && req.session.rang >= 5) {
			asimov.getAdminInfo(req, res, db, toastr, flash);
		} else {
			res.redirect("/home");
		}
	});
	app.get("/admin/users", (req, res) => {
		asimov.getUsers(req, res, db);
	});
  app.get("/admin/users/edit/:ideleve", (req, res) => {
    asimov.editUsersView(req, res, db);
  });
	app.get("/admin/profs", (req, res) => {
		asimov.getProfs(req, res, db);
	});
	app.get("/admin/profs/edit/:idprof", (req, res) => {
		asimov.editProfView(req, res, db);
	});
	app.get("/admin/classes", (req, res) => {
		asimov.getClasses(req, res, db);
	});
	app.get("/admin/classes/edit/:idclasse", (req, res) => {
		asimov.editClasse(req, res, db);
	});
  app.post("/admin/classes/delete", (req, res) => {
    asimov.deleteClasse(req, res, db, fs);
  });
	app.get("/admin/matieres", (req, res) => {
		asimov.getMatieres(req, res, db);
	});
  app.get("/admin/matieres/edit/:idmatiere", (req, res) => {
    asimov.editmatiere(req, res, db);
  });
  app.get("/admin/edt/:idclasse", (req, res) => {
    asimov.getEdt(req, res, db);
  });
  app.post("/admin/edt/update/:id", (req, res) => {
    asimov.postEdt(req, res, db);
  });
	app.post("/admin/users/add", (req, res) => {
		asimov.addUser(req, res, db, crypto, fs);
	});
  app.post("/admin/users/edit/:ideleve", (req, res) => {
    asimov.editUserData(req, res, db, fs);
  });
  app.post("/admin/users/defaultpassword/:ideleve", (req, res) => {
    asimov.defaultPasswordForUser(req, res, db, crypto, fs);
  })
  app.post("/admin/user/delete", (req, res) => {
    asimov.deleteUser(req, res, db, fs);
  });
	app.post("/admin/profs/add", (req, res) => {
		asimov.addProf(req, res, db, crypto, fs);
	});
  app.post("/admin/profs/edit/:idprof", (req, res) => {
    asimov.editProfData(req, res, db, fs);
  });
  app.post("/admin/profs/defaultpassword/:idprof", (req, res) => {
    asimov.defaultPasswordForProf(req, res, db, crypto, fs);
  });
	app.post("/admin/profs/edit-matiere/:idprof", (req, res) => {
		asimov.matiereToProf(req, res, db, fs);
	});
	app.post("/admin/classes/add", (req, res) => {
		asimov.addClasse(req, res, db, fs);
	});

	app.post("/admin/classes/edit/adduser/:idclasse", (req, res) => {
		asimov.addUserToClasse(req, res, db, crypto, fs);
	});
	app.post("/admin/classes/edit/editclasse", (req, res) => {
		asimov.doModifClasse(req, res, db, fs);
	});
  app.post("/admin/classes/edit-eleve/:idclasse", (req, res) => {
    asimov.modifElevesInClasse(req, res, db, fs);
  });

	app.post("/admin/matieres/add", (req, res) => {
		asimov.addMatiere(req, res, db, fs);
	});

  app.post("/admin/matieres/delete", (req, res) => {
    asimov.deleteMatiere(req, res, db, fs);
  });

  app.post("/admin/matiere/delete-prof-from-matiere/:idmatiere", (req,res) => {
    asimov.deleteProfFromMatiere(req, res, db, fs);
  });

  app.post("/admin/matiere/edit/:idmatiere", (req, res) => {
    asimov.editMatiereData(req, res, db, fs);
  });

  app.post("/admin/matiere/addprof/:idmatiere", (req, res) => {
    asimov.addProfToMatiere(req, res, db, fs)
  });

	/* END ADMIN ROUTES */


  /* PROF ROUTES */

  app.get("/prof/notes/:id", (req, res) => {
    asimov.getNotesForUsers(req, res, db);
  });

  app.post("/prof/notes/add-ds", (req, res) => {
    asimov.postAddNewDs(req, res, db);
  });

  app.post("/prof/notes/edit-ds/:id", (req, res) => {
    asimov.postModifiyDs(req, res, db);
  });

  app.post("/prof/notes/delete-ds/:id", (req, res) => {
    asimov.postDeleteDs(req, res, db);
  });

  /* END PROF ROUTES */

  /* USER ROUTES */

  app.get("/user/notes", (req, res) => {
    asimov.getNotes(req, res, db);
  });

  /* END USER ROUTES */

  /* LOG ROUTES */

  app.get("/admin/log", (req, res) => {
    asimov.getLog(req, res, fs);
  });

  app.get("/admin/logEdit/pseudo=:pseudo&id=:id&date=:date", (req, res) => {
    asimov.getLogforUser(req, res, fs);
  });

	/* GLOBAL POST ROUTES */
	app.post("/login", (req, res) => {
		asimov.login(req, res, db, crypto, fs);
	});



  // 404, PAS DE ROUTES APRES CA
  app.get('*', function(req, res){
    res.render("404.ejs", {client : req.session.user});
  });



});



http.listen(port);
console.log("Server running : http://localhost:"+port+"/");
