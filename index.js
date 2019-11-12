const PORT = 3000;
const DB_HOST = "localhost"
const DB_NAME = "asimov"
const DB_USER = "root"
const DB_PASS = ""


var asimov = require("./asimov.js");
var express = require('express');
var session = require('express-session')
var bodyParser = require("body-parser");
var crypto = require('crypto');
var cookieParser = require('cookie-parser');
var mysql = require('mysql');
var db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME
});

var app = express();

app.use(express.static(__dirname + '/public')) // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!", resave: true, saveUninitialized: true}));

db.connect(function(err) {
  if (err) throw err;
  console.log("Connecté à la base de données '"+ DB_NAME +"'");

    //ROUTES
	app.get("/", (req, res) => {
		asimov.doLogStuff(req, res);
	});
	app.get("/home", (req, res) => {
		asimov.doLogStuff(req, res);
	});
	app.get("/login", (req, res) => {
		asimov.doLogStuff(req, res);
	});
	app.get("/logout", (req, res) => {
		req.session.login = false;
		res.redirect("/");
	});
	app.post("/login", (req, res) => {
		asimov.login(req, res, db, crypto)
	});

});




app.listen(PORT);
console.log("Server running : http://localhost:"+PORT+"/");


console.log(crypto.createHmac('sha256', "oldfield.graham")
                   .update('jojofags suck')
                   .digest('hex'));