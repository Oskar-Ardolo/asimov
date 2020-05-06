
(function() {

    var socket = io.connect("http://localhost:3000");
    var pseudo = document.currentScript.getAttribute('pseudo');
    var id_user = document.currentScript.getAttribute('id_user');
    console.log(pseudo);

    socket.emit('username', {username : pseudo});
    console.log(location.pathname)
    $("form#form-msg").submit(function(e) {
        e.preventDefault(); // prevents page reloading
        socket.emit("chat-message", {content : $("input[name=msg]").val(), destinataire : $("input[name=destinataire]").val(), iduser : $("input[name=iduser]").val(), idconvers : $("input[name=idconvers]").val(), username : pseudo });
        $("input[name=msg]").val("");
    return false;
  });

  socket.on("add-message", data  =>  {
    console.log(data);
    if (location.pathname == '/discussions') {
      if (data.convers == $("input[name=idconvers]").val()) {
        if (data.id_sender == id_user){
            $('#container_msg').append('<div class="row"><div class="col-12" ><div class="float-right" style="max-width:60%;"><div class="card bg-primary text-white mb-4 "><div class="card-body" >'+ data.message +'</div></div></div></div></div>');
        } else {
            $('#container_msg').append('<div class="row" ><div class="card bg-primary text-white mb-4"><div class="card-body">'+data.message+'</div></div></div>')
        }

        $("#scroll_container").scrollTop($("#scroll_container")[0].scrollHeight);
      }

      $('#list_discussions').empty();
      for (let items in data.allconverse) {
        let container;
        if (data.allconverse[items].vu == 0 & data.allconverse[items].iduser != id_user) container = '<div class="row"><div class="card mb-4" style="width:100%;background-color:orange" onclick="loadchat('+data.allconverse[items].idconvers+','+data.id_target+',`'+pseudo+'`)"><div class="card-header"><i class="fas fa-paper-plane "></i> '+data.allconverse[items].destinataire+'</div><div class="card-body">';
        else container = '<div class="row"><div class="card mb-4" style="width:100%" onclick="loadchat('+data.allconverse[items].idconvers+','+data.id_target+',`'+pseudo+'`)"><div class="card-header"><i class="fas fa-paper-plane "></i> '+data.allconverse[items].destinataire+'</div><div class="card-body">';

        if (data.allconverse[items].iduser == id_user) {
          container += 'Vous : ';
        } else {
          container += data.allconverse[items].pseudo + ' : ';
        }
        $('#list_discussions').append(container + data.allconverse[items].libelle + '</div></div></div>');
      }
    } else {
      let msg = data.message;
      if (msg.length >= 20) msg = msg.substr(0, 20) + '...'
      $('#msg_notification').empty();
      $('#msg_notification').append('<div class="toast" onclick="location.href=`http://localhost:3000/discussions`"><div class="toast-header" ><i class="fas fa-paper-plane "></i></div><div class="toast-body"><p id="toast-success">'+data.pseudo_sender+' : '+msg+'</p></div></div>');
    }

  });

  socket.on("loadchat", (data) => {
    console.log(data);
    $('#container_msg').empty();
    for (let items in data.convers) {
      if (data.convers[items].iduser == data.user) {
        $('#container_msg').append('<div class="row"> <div class="col-12" > <div class="float-right" style="max-width:60%;"> <div class="card bg-primary text-white mb-4 "> <div class="card-body" >'+data.convers[items].content+'</div></div></div></div></div>')
      } else {
        $('#container_msg').append('<div class="row" ><div class="card bg-primary text-white mb-4"><div class="card-body">'+data.convers[items].content+'</div></div></div>');
        }
    }
    $('#card_chat').children("#form-msg").html('<div class="form-group" style="display:flex"><input type="hidden" name="iduser" value="'+data.user+'"><input type="hidden" name="destinataire" value="'+(data.convers[0].destinataire).toString()+'"><input type="hidden" name="idconvers" value="'+data.convers[0].idconv+'"><input id="msg" class="form-control" style=" display:flex; flex: 0 0 95%;" type="text" name="msg" value="" placeholder="Ecrivez un message..." required><button class="btn btn-success" style="display:flex; flex: 0 0 5%" type="submit" value="Save"><center><i class="fas fa-paper-plane "></i></center></button></div>');
    $("#scroll_container").scrollTop($("#scroll_container")[0].scrollHeight);

    $('#header_description').empty();
    $('#header_description').append('<i class="fas fa-paper-plane "></i> Discussion avec ' + data.convers[0].destinataire);

    $('#list_discussions').empty();
    for (let items in data.allconverse) {
      let container;
      if (data.allconverse[items].vu == 0 & data.allconverse[items].iduser != id_user) container = '<div class="row"><div class="card mb-4" style="width:100%;background-color:orange" onclick="loadchat('+data.allconverse[items].idconvers+','+data.user+',`'+pseudo+'`)"><div class="card-header"><i class="fas fa-paper-plane "></i> '+data.allconverse[items].destinataire+'</div><div class="card-body">';
      else container = '<div class="row"><div class="card mb-4" style="width:100%" onclick="loadchat('+data.allconverse[items].idconvers+','+data.user+',`'+pseudo+'`)"><div class="card-header"><i class="fas fa-paper-plane "></i> '+data.allconverse[items].destinataire+'</div><div class="card-body">';

      if (data.allconverse[items].iduser == id_user) {
        container += 'Vous : ';
       } else {
         container += data.allconverse[items].pseudo + ' : ';
       }
      $('#list_discussions').append(container + data.allconverse[items].libelle + '</div></div></div>');
    }
  });
})();

function loadchat(idconv, iduser, pseudo) {
  var socket = io("http://localhost:3000");
  socket.emit("add-the-chat", {id : idconv, iduser : iduser, username : pseudo});
}
/*
(function() {
  var socket = io.connect('http://localhost:3000/discussions');
  var pseudo = document.currentScript.getAttribute('pseudo');
  var id_user = document.currentScript.getAttribute('id_user');
  console.log(pseudo);

  socket.on('ntm', (data) => {
    console.log(data);
  });
  //location.pathname
  let room = pseudo + Math.floor(Math.random() * 1000000)+100000;
  socket.emit('room', 'myroom');
  socket.emit('username', {username : pseudo});
})();
*/
