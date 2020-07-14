const DB = require('./classes.js');

const ent = require('ent');

var clients = {};

module.exports = (io) => {

  io.sockets.on('connection', (socket) => {

    console.log('someone connected');

    socket.on('username', (data) => {
      clients[data.username] = {
        "socket": socket.id
      };
      console.log(clients);
    });

    socket.on('chat-message', async (data) => {
      console.log("Sending: " + data.content + " to " + data.destinataire);
        let new_convers;
        let user_destinataire = await DB.getUserByPseudo(data.destinataire);

        // CONFIRM IF THE CONVERSATION EXIST, IF TRUE SEND MSG, IF FALSE CREATE CONVERSATION
        let convers_confirm = await DB.conversExist(data.iduser, user_destinataire[0].id);
        console.log(convers_confirm, convers_confirm.length);
        if(convers_confirm.length > 0) {
          await DB.addNewMessage(data.idconvers, data.iduser, data.content);
        } else {
          await DB.addNewConvers(data.iduser, user_destinataire[0].id);
          console.log(data.iduser, user_destinataire[0].id);
          new_convers = await DB.getDiscussionsByUsers(data.iduser, user_destinataire[0].id);
          console.log(new_convers);
          await DB.addNewMessage(new_convers[0].id, data.iduser, data.content);
          data.idconvers = new_convers[0].id;
          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa : ", data.idconvers);
        }


        // GET ALL CONVERSATIONS OF SENDER
        let allconverse = await DB.getAllDiscussionById(data.iduser);
        if (clients[data.username]) io.sockets.connected[clients[data.username].socket].emit("add-message", { message: ent.encode(data.content) , convers : data.idconvers , id_sender : data.iduser, pseudo_sender : data.username, id_target : data.iduser, allconverse : allconverse });
        else console.log("User does not exist: " + data.username);
        

        // GET ALL CONVERSATIONS OF TARGET CLIENT
        //user_destinataire = await DB.getUserByPseudo(data.destinataire);
        allconverse = await DB.getAllDiscussionById(user_destinataire[0].id);

        if (clients[data.destinataire]) io.sockets.connected[clients[data.destinataire].socket].emit("add-message", { message: ent.encode(data.content) , convers : data.idconvers , id_sender : data.iduser, pseudo_sender : data.username, id_target : user_destinataire[0].id , allconverse : allconverse });
        else console.log("User does not exist: " + data.destinataire);
    });

    socket.on("add-the-chat", async (data) => {
        await DB.readMessage(data.iduser, data.id);
        let convers = await DB.getDiscussionById(data.id, data.iduser);
        let allconverse = await DB.getAllDiscussionById(data.iduser);

        if (clients[data.username]) io.sockets.connected[clients[data.username].socket].emit("loadchat", { convers : convers, user : data.iduser, allconverse : allconverse });
        else console.log("User does not exist: " + data.username);

    });

    socket.on('find_users', async (data) => {

        let list_users = await DB.getListOfUsersByStr(data.value);
          console.log(list_users);
        if (clients[data.username]) io.sockets.connected[clients[data.username].socket].emit('list_of_users', list_users);
        else console.log("User does not exist: " + data.username);

    });

    socket.on('btn_list_users', async (data) => {
        let user_destinataire = await DB.getUserByPseudo(data.destinataire);
        let convers_confirm = await DB.conversExist(data.id_user, user_destinataire[0].id);
        let data_convers = await DB.getDiscussionsByUsers(data.id_user, user_destinataire[0].id);
        if (convers_confirm.length > 0) {
          socket.emit('searching_existing_convers', {bool : true, id_user : data.id_user , id_convers : data_convers[0].id});
        } else {
          socket.emit('searching_existing_convers', {bool : false, destinataire : data.destinataire });
        }
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

}
