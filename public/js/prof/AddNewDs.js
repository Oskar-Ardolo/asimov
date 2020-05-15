let data = JSON.parse(document.currentScript.getAttribute('classes'));

let new_ds = {};
let form = document.getElementById('bg');

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

function getclasse(e) {
  let value = $('#list_classes').val();
  let txt = $('#list_classes option:selected').text();

  $('#zones_notes').empty();

  $('#zones_notes').append('<div class="form-group"><label>Description</label><input id="description" type="text" class="form-control"/><label>Date du devoir (date à laquelle à eu lieu le devoir)</label><input id="date" type="date" class="form-control"/><label>Barème</label><input id="bareme" type=number class="form-control" min="0"/><label>Coéfficient</label><input id="coefficient" type="number" class="form-control" min="0"/><hr><div class="row"><div class="col-6"><center><button type="reset" class="btn btn-danger">Annuler</button></center></div><div class="col-6"><center><button id="btn_suivant" type="button" class="btn btn-primary">Suivant</button></center></div></div></div>');
  document.getElementById('btn_suivant').addEventListener('click', btn_suivant);
  new_ds["header"] = {
    classe : { id : value, nom : txt }
  }
}

function btn_suivant() {
  if ($('#bareme').val()) {
    new_ds["header"].description = $('#description').val().replace(/"/g, ' ');
    new_ds["header"].date = $('#date').val();
    new_ds["header"].bareme = $('#bareme').val();
    new_ds["header"].coefficient = $('#coefficient').val();

    $('#zones_notes').empty();

    let table = '<table class="table"><thead><th>Nom prénom</th><th>Note</th><thead>'

    let select = '<select class="form-control"><option disabled selected value="">-- Sélectionnez une option --</option><option>ABS</option><option>Non noté</option>'

    for (let i = 0; i < parseInt(new_ds["header"].bareme) + 1; i++) {
      select += '<option>'+i+'</option>'
    }
    select += '</select>'

    new_ds["body"] = [];
    for (let items in data) {
      if (data[items].idclasse == new_ds["header"].classe.id) {
        new_ds["body"].push({id: data[items].id , nom : data[items].nom, prenom : data[items].prenom,  notes : ""})
        table += '<tr><td>'+data[items].nom+' '+data[items].prenom+'</td><td>'+select+'</td></tr>'
      }
    }

    $('#zones_notes').append(table + '</table><hr><div class="row"><div class="col-6"><center><button id="btn_precedent" type="reset" class="btn btn-danger">Annuler</button></center></div><div class="col-6"><center><button id="btn_recap" type="button" class="btn btn-primary">Suivant</button></center></div></div>');
  }
  document.getElementById('btn_recap').addEventListener('click', btn_recap);
}

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
  $('#zones_notes').append(recap + '</table><hr><input name="data_ds" type="hidden" value="'+str+'" /><center><button type="submit" class="btn btn-success">Valider</button></center></form>');
}
