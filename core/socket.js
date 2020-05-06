const DB = require('./classes.js');
const Logs = require('../Logs/js/log.js');
const Notif = require('../notification/js/notif.js');

var clients = {};
var pseudo;
var pathname;

exports.listen = (io, db, ent, session) => {
  let DBModel = new DB(db);

  io.sockets.on('connection', (socket) => {

    console.log('someone connected');

    socket.on('username', (data) => {
      clients[data.username] = {
        "socket": socket.id
      };
      console.log(clients);
    });

    socket.on('chat-message', (data) => {
      console.log("Sending: " + data.content + " to " + data.username);
      (async function() {
        await DBModel.addNewMessage(data.idconvers, data.iduser, data.content);

        // GET ALL CONVERSATIONS OF SENDER
        let allconverse = await DBModel.getAllDiscussionById(data.iduser);

        if (clients[data.username]) io.sockets.connected[clients[data.username].socket].emit("add-message", { message: ent.encode(data.content) , convers : data.idconvers , id_sender : data.iduser, pseudo_sender : data.username, id_target : data.iduser, allconverse : allconverse });
        else console.log("User does not exist: " + data.username);
        console.log("sender", allconverse);

        // GET ALL CONVERSATIONS OF TARGET CLIENT
        user_destinataire = await DBModel.getUserByPseudo(data.destinataire);
        allconverse = await DBModel.getAllDiscussionById(user_destinataire[0].id);
        console.log("target", allconverse);

        if (clients[data.destinataire]) io.sockets.connected[clients[data.destinataire].socket].emit("add-message", { message: ent.encode(data.content) , convers : data.idconvers , id_sender : data.iduser, pseudo_sender : data.username, id_target : user_destinataire[0].id , allconverse : allconverse });
        else console.log("User does not exist: " + data.destinataire);
      })();
    });

    socket.on("add-the-chat", (data) => {
      (async function() {
        await DBModel.readMessage(data.iduser, data.id);
        let convers = await DBModel.getDiscussionById(data.id, data.iduser);
        let allconverse = await DBModel.getAllDiscussionById(data.iduser);
        console.log(data.id);
        console.log(data.iduser);
        //console.log(convers);
        if (clients[data.username]) io.sockets.connected[clients[data.username].socket].emit("loadchat", { convers : convers, user : data.iduser, allconverse : allconverse });
        else console.log("User does not exist: " + data.username);

      })();

    });

    //Removing the socket on disconnect
    socket.on('disconnect', function() {
    	for(var name in clients) {
    		if(clients[name].socket === socket.id) {
    			delete clients[name];
    			break;
    		}
    	}
    })

  });










/*
  socket.on("connection", (socket)  =>  {
    socket.emit('ntm', 'je baise ta mère');
    socket.join("room-" + socket.id);

    socket.on("username", (user_pseudo) => {
      this.pseudo = user_pseudo.pseudo;

      function alreadyconnected() {
        for (let items in listpseudo) {
          if (listpseudo[items][0] == user_pseudo.pseudo) {
            listpseudo[items][1] = socket.id;
            return true
          }
        }
        return false;
      }
      console.log(alreadyconnected());
      if (alreadyconnected() == false) { listpseudo.push([user_pseudo.pseudo, socket.id]) };
      console.log(listpseudo);
    });

    console.log("user connected : " + this.pseudo, listpseudo, socket.id);

    socket.on("chat message", (newmsg) => {
      console.log("message: "  +  newmsg.content +", "+ newmsg.iduser +", "+ newmsg.idconvers);
      (async function() {
        await DBModel.addNewMessage(newmsg.idconvers, newmsg.iduser, newmsg.content);
        socket.emit("newmsg", { message: ent.encode(newmsg.content) , convers : newmsg.idconvers , user : newmsg.iduser });
        //socket.broadcast.emit("newmsg", { message: ent.encode(newmsg.content) , convers : newmsg.idconvers , user : newmsg.iduser });
      })();
    });

    socket.on("add the chat", (data) => {
      (async function() {
        let convers = await DBModel.getDiscussionById(data.id);
        console.log(data.id);
        console.log(data.iduser);
        //console.log(convers);
        socket.emit("loadchat", { convers : convers, user : data.iduser });
        //socket.broadcast.to(this.pseudo).emit('loadchat', { convers : convers, user : data.iduser });
      })();

    });

    socket.on("disconnect", (socket) => {
      console.log("user disconnected");
    });

  });*/

}
