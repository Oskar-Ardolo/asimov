//const url = "https://fontanaen-asimov.herokuapp.com/"
const url = "http://localhost:3000/";

(async () => {

    // Create connection
    const socket = io.connect(url);

    // Global variables
    var pseudo = document.currentScript.getAttribute('pseudo');
    var id_user = document.currentScript.getAttribute('id_user');

    // Events listener
    var input = document.getElementById('input_list_of_users');
    let btn = document.getElementById('btn_list_users');

    // Emit user pseudo to authentification
    socket.emit('username', {username : pseudo});

    // If send msg, emit data to server
    $("form#form-msg").submit(function(e) {
        e.preventDefault(); // prevents page reloading
        socket.emit("chat-message", {content : $("input[name=msg]").val(), destinataire : $("input[name=destinataire]").val(), iduser : $("input[name=iduser]").val(), idconvers : $("input[name=idconvers]").val(), username : pseudo });
        $("input[name=msg]").val("");
    return false;
  });

  // Add message in view, and refresh list of chats
  socket.on("add-message", data  =>  {
    if (location.pathname == '/discussions') {
      if (data.convers == $("input[name=idconvers]").val()) {
        if (data.id_sender == id_user){
            $('#container_msg').append('<div class="row"><div class="col-12" ><div class="float-right" style="max-width:60%;"><div class="card bg-primary text-white mb-4 "><div class="card-body" >'+ data.message +'</div></div></div></div></div>');
        } else {
            $('#container_msg').append('<div class="row" ><div class="card bg-primary text-white mb-4"><div class="card-body">'+data.message+'</div></div></div>')
        }

        $("#scroll_container").scrollTop($("#scroll_container")[0].scrollHeight);
      } else {
        loadchat(data.convers, data.id_sender, pseudo);
      }
      

      // Move the search bar
      $('#list_discussions').empty();
      $('#list_discussions').append('<div id="search-bar" class="card mb-4" style="width:100%;"><div class="card-header"><i class="fas fa-search"></i> Trouver une personne</div><div class="card-body" style="display:flex"><input id="input_list_of_users" class="form-control" style="display:flex; flex: 0 0 50%;max-width: 85%;" list="list_users" value=""><datalist id="list_users"></datalist><input type="hidden" id="id_user_in_list" value=""><button id="btn_list_users" class="btn btn-primary" style="display:flex; flex: 0 0 5%" type="button" name="button"><center><i class="fas fa-search"></i></center></button></div></div>');

      // Refresh event listener
      input = document.getElementById('input_list_of_users');
      input.addEventListener('input', updateValue);
      btn = document.getElementById('btn_list_users');
      btn.addEventListener('click', btn_list);

      // Refresh list of chats
      for (let items in data.allconverse) {
        let container;
        if (data.allconverse[items].vu == 0 & data.allconverse[items].iduser != id_user) container = '<div class="row"><div class="card mb-4" style="width:100%;background-color:orange" onclick="loadchat('+data.allconverse[items].idconvers+','+data.id_target+',`'+pseudo+'`)"><div class="card-header"><i class="fas fa-paper-plane "></i> '+data.allconverse[items].destinataire+'</div><div class="card-body">';
        else container = '<div class="row"><div class="card mb-4 bubule" style="width:100%" onclick="loadchat('+data.allconverse[items].idconvers+','+data.id_target+',`'+pseudo+'`)"><div class="card-header"><i class="fas fa-paper-plane "></i> '+data.allconverse[items].destinataire+'</div><div class="card-body">';

        if (data.allconverse[items].iduser == id_user) {
          container += 'Vous : ';
        } else {
          container += data.allconverse[items].pseudo + ' : ';
        }
        $('#list_discussions').append(container + data.allconverse[items].libelle + '</div></div></div>');
      }
    } else {
      // Add a notification if the location isn't /discussion
      let msg = data.message;
      if (msg.length >= 20) msg = msg.substr(0, 20) + '...'
      $('#msg_notification').empty();
      $('#msg_notification').append('<div class="toast" onclick="location.href=`http://localhost:3000/discussions`"><div class="toast-header" ><i class="fas fa-paper-plane "></i></div><div class="toast-body"><p id="toast-success">'+data.pseudo_sender+' : '+msg+'</p></div></div>');
    }

  });

  // Load the chat
  socket.on("loadchat", (data) => {

    // Add messages in the right order
    $('#container_msg').empty();
    for (let items in data.convers) {
      if (data.convers[items].iduser == data.user) {
        $('#container_msg').append('<div class="row"> <div class="col-12" > <div class="float-right" style="max-width:60%;"> <div class="card bg-primary text-white mb-4 "> <div class="card-body" >'+data.convers[items].content+'</div></div></div></div></div>')
      } else {
        $('#container_msg').append('<div class="row" ><div class="card bg-primary text-white mb-4"><div class="card-body">'+data.convers[items].content+'</div></div></div>');
        }
    }

    // Add the input and the sender button
    $('#card_chat').children("#form-msg").html('<div class="form-group" style="display:flex"><input type="hidden" name="iduser" value="'+data.user+'"><input type="hidden" name="destinataire" value="'+(data.convers[0].destinataire).toString()+'"><input type="hidden" name="idconvers" value="'+data.convers[0].idconv+'"><input id="msg" class="form-control" style=" display:flex; flex: 0 0 95%;" type="text" name="msg" value="" placeholder="Ecrivez un message..." required><button class="btn btn-success" style="display:flex; flex: 0 0 5%" type="submit" value="Save"><center><i class="fas fa-paper-plane "></i></center></button></div>');
    $("#scroll_container").scrollTop($("#scroll_container")[0].scrollHeight);

    // Change the name of target
    $('#header_description').empty();
    $('#header_description').append('<i class="fas fa-paper-plane "></i> Discussion avec ' + data.convers[0].destinataire);

    // Move the search bar
    $('#list_discussions').empty();
    $('#list_discussions').append('<div id="search-bar" class="card mb-4" style="width:100%;"><div class="card-header"><i class="fas fa-search"></i> Trouver une personne</div><div class="card-body" style="display:flex"><input id="input_list_of_users" class="form-control" style="display:flex; flex: 0 0 50%;max-width: 85%;" list="list_users" value=""><datalist id="list_users"></datalist><input type="hidden" id="id_user_in_list" value=""><button id="btn_list_users" class="btn btn-primary" style="display:flex; flex: 0 0 5%" type="button" name="button"><center><i class="fas fa-search"></i></center></button></div></div>');

    // Refresh events listener
    input = document.getElementById('input_list_of_users');
    input.addEventListener('input', updateValue);
    btn = document.getElementById('btn_list_users');
    btn.addEventListener('click', btn_list);

    // Refresh list of chats
    for (let items in data.allconverse) {
      let container;
      if (data.allconverse[items].vu == 0 & data.allconverse[items].iduser != id_user) container = '<div class="row"><div class="card mb-4" style="width:100%;background-color:orange" onclick="loadchat('+data.allconverse[items].idconvers+','+data.user+',`'+pseudo+'`)"><div class="card-header"><i class="fas fa-paper-plane "></i> '+data.allconverse[items].destinataire+'</div><div class="card-body">';
      else container = '<div class="row"><div class="card mb-4 bubule" style="width:100%" onclick="loadchat('+data.allconverse[items].idconvers+','+data.user+',`'+pseudo+'`)"><div class="card-header"><i class="fas fa-paper-plane "></i> '+data.allconverse[items].destinataire+'</div><div class="card-body">';

      if (data.allconverse[items].iduser == id_user) {
        container += 'Vous : ';
       } else {
         container += data.allconverse[items].pseudo + ' : ';
       }
      $('#list_discussions').append(container + data.allconverse[items].libelle + '</div></div></div>');
    }
  });

  // Event on change of this input
  input.addEventListener('input', updateValue);
  function updateValue(e) {
    let value = e.target.value;
    if (value.replace(/ /g, "")) {
      socket.emit('find_users', { value : value, username : pseudo });
    }
    let option = $('option');
    for (let items in option) {
      if(option[items].value == value) {
        $('#id_user_in_list').val($('#input_list_of_users').val());
        $('#input_list_of_users').val(option[items].text);
        console.log(option[items].text);
      }
    }
  }

  // Add the list of users in datalist
  socket.on('list_of_users', (data) => {
    $('#list_users').empty();
    for (let items in data) {
      $('#list_users').append('<option value="'+data[items].pseudo+'">'+data[items].nom+' '+data[items].prenom+'</option>');
    }
  });

  // Events on button
  btn.addEventListener('click', btn_list);
  function btn_list() {
    let destinataire = $('#id_user_in_list').val()
    if (destinataire) {
      socket.emit('btn_list_users', {username : pseudo, id_user: id_user, destinataire : destinataire});
    } else {
      $('#msg_notification').empty();
      $('#msg_notification').append('<div class="toast"><div class="toast-header"><img id="toast-img" src="/img/croix.png"></div><div class="toast-body"><p id="toast-error">Utilisateur inconnu</p></div></div>');
    }
  }

  socket.on('searching_existing_convers', (data) => {
    console.log(data);
    if (data.bool) {
      loadchat(data.id_convers, data.id_user, pseudo);
    } else {

      $('#card_chat').children("#form-msg").html('<div class="form-group" style="display:flex"><input type="hidden" name="iduser" value="'+id_user+'"><input type="hidden" name="destinataire" value="'+data.destinataire+'"><input type="hidden" name="idconvers" value="0"><input id="msg" class="form-control" style=" display:flex; flex: 0 0 95%;" type="text" name="msg" value="" placeholder="Ecrivez un message..." required><button class="btn btn-success" style="display:flex; flex: 0 0 5%" type="submit" value="Save"><center><i class="fas fa-paper-plane "></i></center></button></div>');
      $("#scroll_container").scrollTop($("#scroll_container")[0].scrollHeight);
      $('#container_msg').empty();
      $('#header_description').empty();
      $('#header_description').append('<i class="fas fa-paper-plane "></i> Discussion avec ' + data.destinataire);

      console.log($('#search-bar'));
      if ($('#search-bar').length == 0) {
        $('#list_discussions').prepend('<div id="search-bar" class="card mb-4" style="width:100%;"><div class="card-header"><i class="fas fa-search"></i> Trouver une personne</div><div class="card-body" style="display:flex"><input id="input_list_of_users" class="form-control" style="display:flex; flex: 0 0 95%;max-width: 85%;" list="list_users" value=""><datalist id="list_users"></datalist><input type="hidden" id="id_user_in_list" value=""><button id="btn_list_users" class="btn btn-primary" style="display:flex; flex: 0 0 5%" type="button" name="button"><center><i class="fas fa-search"></i></center></button></div></div>');
      }
      input = document.getElementById('input_list_of_users');
      input.addEventListener('input', updateValue);
      btn = document.getElementById('btn_list_users');
      btn.addEventListener('click', btn_list);
    }
  });
})();

async function loadchat(idconv, iduser, pseudo) {
  const socket = io.connect(url);
  socket.emit("add-the-chat", {id : idconv, iduser : iduser, username : pseudo});
}

async function find_users(value, pseudo) {
  const socket = io.connect(url);
  socket.emit('find_users', { value : value, username : pseudo });
  //$('#list_users').append('<option value="'+val+'">');
}
