const port = process.env.PORT || 3000;
const socketio = require('socket.io');
const express = require('express');
const http = require('http');
const bodyParser = require("body-parser");
const session = require('cookie-session');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const app = express();
const server = http.createServer(app);
const io = socketio(server);


// Middlewares
app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!", resave: true, saveUninitialized: true}));
app.use(cors());

// Web socket
require("./core/socket.js")(io);

// Routes
const auth_module = require('./core/router/auth-module/routes-auth');
const global_module = require('./core/router/global-module/routes-global');
const admin_module = require('./core/router/admin-module/routes-admin');
const teacher_module = require('./core/router/teacher-module/routes-teacher');
const students_module = require('./core/router/student-module/routes-students');

app.use('/', auth_module);
app.use('/', global_module);
app.use('/admin', admin_module);
app.use('/prof', teacher_module);
app.use('/user', students_module);

// 404, PAS DE ROUTES APRES CA
app.get('*', function(req, res){
  res.render("404.ejs", {client : req.session.user});
});

server.listen(port);
console.log(`Server running : http://localhost:${port}/`);
