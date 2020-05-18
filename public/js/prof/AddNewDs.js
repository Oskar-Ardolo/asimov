let data = JSON.parse(document.currentScript.getAttribute('classes'));

let new_ds = {};
new_ds["body"] = [];

let array;
let header;

// ADD CLASSES LIST IN JSON (key = id);
let classes = (data) => {
  let array = {};
  for (let items in data) {
    if (!array[data[items].idclasse]) {
      array[data[items].idclasse] = {
        "nom" : data[items].nomclasse
      }
    }
  }
  return array;
}

// ACTION ONCLICK BUTTON + NEW CONTROL
document.getElementById('btn-devoir').addEventListener('click', btn_devoir);
function btn_devoir() {

  $('#zones_notes').empty();
  let input = '<label for="classes">Choisissez une classe</label><select id="list_classes" name="classes" class="form-control"><option value="" class="text-muted" selected disabled>-- Selectionnez une classe --</option>'
  for (let items in classes(data)) {
    input += '<option value="'+ items +'">'+ classes(data)[items].nom +'</option>'
  }
  $('#zones_notes').append(input + '</select>');
  document.getElementById('list_classes').addEventListener('input', getclasse);
}

// ACTION ON INPUT SELECT CLASSES
function getclasse(e) {
  let value = $('#list_classes').val();
  let txt = $('#list_classes option:selected').text();

  $('#zones_notes').empty();

  $('#zones_notes').append('<div class="form-group"><label>Description</label><input id="description" type="text" class="form-control"/><label>Date du devoir (date à laquelle à eu lieu le devoir)</label><input id="date" type="date" class="form-control"/><label>Barème</label><input id="bareme" type=number class="form-control" min="0"/><label>Coéfficient</label><input id="coefficient" type="number" class="form-control" min="0"/><hr><div class="row"><div class="col-6"><center><button id="back" type="reset" class="btn btn-danger">Annuler</button></center></div><div class="col-6"><center><button id="btn_suivant" type="button" class="btn btn-primary">Suivant</button></center></div></div></div>');
  document.getElementById('btn_suivant').addEventListener('click', btn_suivant);
  new_ds["header"] = {
    classe : { id : value, nom : txt }
  }
  document.getElementById('back').addEventListener('click', back_to_classe);
}

// ACTION ON CLICK ON BUTTON NEXT (header to body)
function btn_suivant() {

  if ($('#bareme').val() && $('#description').val()  && $('#date').val() && $('#coefficient').val()) {

    // ADD VALUES TO JSON (header)
    new_ds["header"].description = $('#description').val().replace(/"/g, ' ');
    new_ds["header"].date = $('#date').val();
    new_ds["header"].bareme = $('#bareme').val();
    new_ds["header"].coefficient = $('#coefficient').val();

    // CLEAN THE WRAPPER AND ADD TABLE OF SELECTS
    $('#zones_notes').empty();
    let table = '<table class="table table-bordered"><thead><th>Nom prénom</th><th>Note</th><thead>'
    let select = '<select id="select_notes_body" class="form-control"><option disabled selected value="">-- Sélectionnez une option --</option><option>ABS</option><option>Non noté</option>'
    for (let i = 0; i < parseInt(new_ds["header"].bareme) + 1; i++) {
      select += '<option>'+i+'</option>'
    }
    select += '</select>'

    // ADD STUDENT DATA TO JSON IF THEY AREN'T INSIDE (cpt is important because items doesn't start to 0 and push start to 0);
    let cpt = 0;
    for (let items in data) {
      if (data[items].idclasse == new_ds["header"].classe.id) {
        if (!new_ds["body"][cpt]) new_ds["body"].push({id: data[items].id , nom : data[items].nom, prenom : data[items].prenom,  notes : ""});
        cpt++;
        table += '<tr><td>'+data[items].nom+' '+data[items].prenom+'</td><td>'+select+'</td></tr>';
      }
    }
    $('#zones_notes').append(table + '</table><hr><div class="row"><div class="col-6"><center><button id="btn_precedent" type="reset" class="btn btn-danger">Annuler</button></center></div><div class="col-6"><center><button id="btn_recap" type="button" class="btn btn-primary">Suivant</button></center></div></div>');
  }

  // ADD A SELECTED VALUE IF MARKS WHERE ALREADY IN JSON (CASE WHEN USE BACK BUTTON);
  for (let items in $('select#select_notes_body')) {
    console.log($('select#select_notes_body')[items].value, new_ds["body"][items].notes);
    if ($('select#select_notes_body')[items].value == undefined || new_ds["body"][items].notes == "") break;
    else $('select#select_notes_body')[items].value = new_ds["body"][items].notes;
  }

  document.getElementById('btn_precedent').addEventListener('click', back_to_header);
  document.getElementById('btn_recap').addEventListener('click', btn_recap);
}

// ACTION ON BUTTON TO GET RESUME
function btn_recap() {

  for (let items in  $('select')) {
    if ($('select')[items].value == "") return;
  }
  for (let items in new_ds["body"]) {
    new_ds["body"][items].notes = $('select')[items].value
  }

  $('#zones_notes').empty()
  let recap = '<h4>Récapitulatif</h4><hr><form method="post" action="/prof/notes/add-ds"><label>Classe</label><input type="text" class="form-control" disabled value="'+new_ds["header"].classe.nom+'"><label>Description</label><input type="text" class="form-control" disabled value="'+new_ds["header"].description+'"><label>Date</label><input type="text" class="form-control" disabled value="'+new_ds["header"].date+'"><label>Bareme</label><input type="text" class="form-control" disabled value="'+new_ds["header"].bareme+'"><table class="table"><thead><th>Nom prénom</th><th>Note</th><thead>';
  for (let items in new_ds["body"]) {
    recap += '<tr><td><label>'+new_ds["body"][items].nom+' '+new_ds["body"][items].prenom+'</label></td><td><input type="text" class="form-control" value="'+new_ds["body"][items].notes+'" disabled></td></tr>'
  }
  let str = JSON.stringify(new_ds).replace(/"/g, `&quot;`)
  $('#zones_notes').append(recap + '</table><hr><input name="data_ds" type="hidden" value="'+str+'" /><div class="row"><div class="col-6"><center><button id="btn_precedent" type="button" class="btn btn-danger">Précédent</button></center></div><div class="col-6"><center><button type="submit" class="btn btn-success">Valider</button></center></form></div></div>');
  document.getElementById('btn_precedent').addEventListener('click', back_to_body);
  console.log("4", new_ds["body"])
}

// BACK BUTTONS

function back_to_classe() {
  btn_devoir();
}

function back_to_header() {
  console.log("back_to_header", new_ds["body"])
  $('#zones_notes').empty();
  $('#zones_notes').append('<div class="form-group"><label>Description</label><input id="description" type="text" class="form-control"/><label>Date du devoir (date à laquelle à eu lieu le devoir)</label><input id="date" type="date" class="form-control"/><label>Barème</label><input id="bareme" type=number class="form-control" min="0"/><label>Coéfficient</label><input id="coefficient" type="number" class="form-control" min="0"/><hr><div class="row"><div class="col-6"><center><button id="back" type="reset" class="btn btn-danger">Annuler</button></center></div><div class="col-6"><center><button id="btn_suivant" type="button" class="btn btn-primary">Suivant</button></center></div></div></div>');
  document.getElementById('btn_suivant').addEventListener('click', btn_suivant);
  document.getElementById('back').addEventListener('click', back_to_classe);
  $('#description').val(new_ds["header"].description);
  $('#date').val(new_ds["header"].date);
  $('#bareme').val(new_ds["header"].bareme);
  $('#coefficient').val(new_ds["header"].coefficient);
}

function back_to_body() {
  console.log("back_to_body", new_ds["body"])
  $('#zones_notes').empty();
  let table = '<table class="table"><thead><th>Nom prénom</th><th>Note</th><thead>'
  let select = '<select id="select_notes_body" class="form-control"><option disabled selected value="">-- Sélectionnez une option --</option><option>ABS</option><option>Non noté</option>'

  for (let i = 0; i < parseInt(new_ds["header"].bareme) + 1; i++) {
      select += '<option>'+i+'</option>'
  }
  select += '</select>'

  for (let items in data) {
    if (data[items].idclasse == new_ds["header"].classe.id) {
      table += '<tr><td>'+data[items].nom+' '+data[items].prenom+'</td><td>'+select+'</td></tr>'
    }
  }

  $('#zones_notes').append(table + '</table><hr><div class="row"><div class="col-6"><center><button id="btn_precedent" type="reset" class="btn btn-danger">Annuler</button></center></div><div class="col-6"><center><button id="btn_recap" type="button" class="btn btn-primary">Suivant</button></center></div></div>');
  //console.log( $('select#select_notes_body'))
  for (let items in $('select#select_notes_body')) {
    //console.log($('select#select_notes_body')[items].value, new_ds["body"][items].notes)
    if ($('select#select_notes_body')[items].value == undefined) break;
    else {
      $('select#select_notes_body')[items].value = new_ds["body"][items].notes;
    }
  }
  document.getElementById('btn_precedent').addEventListener('click', back_to_header);
  document.getElementById('btn_recap').addEventListener('click', btn_recap);
}



// ======= IF MODIFY CONTROL ==============



let input = document.getElementsByTagName('input');
for (var i = 0; i < input.length; i++) {
    input[i].addEventListener('input', update_select);
}

let select = document.getElementsByTagName('select');
console.log(select);
for (var i = 0; i < select.length - 1; i++) {
    select[i].addEventListener('input', update_array);
}

function update_select(e) {
  let value = $('input[name=input-bareme]').val();
  array = new Array();
  header = new Array();
  let labels = ["id_classe", "nom_classe", "description", "date", "bareme", "coefficient"];

  for (let items in $('select#select_notes')) {
    if ($('select#select_notes')[items].value == undefined) break;
    else {
      array[items] = new Array();
      array[items][0] = new Array();
      array[items][1] = new Array();
      array[items][0].push($('input#id_user')[items].value);
      array[items][1].push($('select#select_notes')[items].value);
    }
  }
  $('select#select_notes').empty();

  let str = '<option>ABS</option><option>Non noté</option>';
  for (let i = 0; i < parseInt(value) + 1; i++) {
    str += '<option>'+i+'</option>';
  }
  $('select#select_notes').append(str);

  for (let items in $('select#select_notes')) {
    console.log($('select#select_notes')[items].value, array[items][1], items)
    if ($('select#select_notes')[items].value == undefined) break;
    else {
      $('select#select_notes')[items].value = array[items][1];
    }
  }

  for (let items in $('input#header')) {
    if ($('input#header')[items].value == undefined) break;
    else {
      header[items] = new Array();
      header[items][0] = new Array();
      header[items][1] = new Array();
      header[items][0].push(labels[items])
      header[items][1].push($('input#header')[items].value);
    }
  }
  $('#btn_modify').removeAttr('disabled');
  console.log(array, header);
}

function update_array() {
  let cpt = 0;

  if (array) {
    for (let items in $('select#select_notes')) {
      if ($('select#select_notes')[items].value == undefined) break;
      else {
        console.log($('select#select_notes')[items].value, array[cpt][1], items);
        array[cpt][1] = $('select#select_notes')[items].value;
        cpt++;
      }
    }
  } else {
    array = new Array();
    for (let items in $('select#select_notes')) {
      if ($('select#select_notes')[items].value == undefined) break;
      else {
        array[items] = new Array();
        array[items][0] = new Array();
        array[items][1] = new Array();
        array[items][0].push($('input#id_user')[items].value);
        array[items][1].push($('select#select_notes')[items].value);
      }
    }
  }
  $('#btn_modify').removeAttr('disabled');
}

document.getElementById('btn_modify').addEventListener('click', send_data);
function send_data() {
  update_select()
  update_array()
  $('#data_header').val(JSON.stringify(header));
  $('#data_body').val(JSON.stringify(array));
}
