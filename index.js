const PORT = 3000;
const DB_HOST = "localhost"
const DB_NAME = "asimov"

var asimov = require("./asimov.js");
var express = require('express');
var session = require('express-session')
var bodyParser = require("body-parser");
var crypto = require('crypto');
var cookieParser = require('cookie-parser');
var MongoClient = require("mongodb").MongoClient;

var app = express();

app.use(express.static(__dirname + '/public')) // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!", resave: true, saveUninitialized: true}));


MongoClient.connect("mongodb://"+ DB_HOST +"/", function(error, client) {
    if (error) return funcCallback(error);
    let db = client.db(DB_NAME);


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
	app.post("/login", (req, res) => {
		asimov.login(req, res, db, crypto)
	});

	    console.log("Connecté à la base de données '"+ DB_NAME +"'");
	});




app.listen(PORT);
console.log("Server running : http://localhost:"+PORT+"/");


console.log(crypto.createHmac('sha256', "oldfield.graham")
                   .update('jojofags suck')
                   .digest('hex'));