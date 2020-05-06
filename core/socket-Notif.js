
exports.chat_Alert = (io, db, ent) => {

  io.sockets.on('connection', (socket) => {
    socket.on('username', function(data){
      clients[data.username] = {
        "socket": socket.id
      };
      console.log(clients);
    });
  });

}
