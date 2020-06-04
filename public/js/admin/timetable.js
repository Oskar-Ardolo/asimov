let timetable = JSON.parse(document.currentScript.getAttribute('timetable'));
let mytable = JSON.parse(document.currentScript.getAttribute('timetable')); // IF ADD CHANGE

let matieres = JSON.parse(document.currentScript.getAttribute('matieres'));
let colors = ["#677E52", "#A7A37E", "#A67E2E", "#C44C51", "#667882", "#9C9E4B", "#B83A1B", "#D3732F", "#C0AC42", "#e91e63"];

// ATTRIBUTION DES COULEURS
let matiere = {};
for (let items in matieres) {
  if (matieres[items].nommatiere) {
    if (matiere[matieres[items].nommatiere]) {
      matiere[matieres[items].nommatiere].color = colors[items];
      matiere[matieres[items].nommatiere].id_prof = matieres[items].id;
      matiere[matieres[items].nommatiere].nom_prof = matieres[items].nom;
      matiere[matieres[items].nommatiere].id_matiere = matieres[items].idmatiere;
    }
    else matiere[matieres[items].nommatiere] = { color : colors[items], id_prof : matieres[items].id, nom_prof : matieres[items].nom, id_matiere : matieres[items].idmatiere };
  }
}
console.log(matiere, matieres);


function append_timetable(timetable) {

    let days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
    let conteneur = $('#mytable');
    let table = '<table class="table table-bordered table-header-dark " style="text-align:center"><thead><tr><th>Horaires</th><th>Lundi</th><th>Mardi</th><th>Mercredi</th><th>Jeudi</th><th>Vendredi</th></tr></thead><tbody>'

    // BOUCLE POUR CHAQUE HEURE
    for (let i = 8; i < 18; i++) {
      table += '<tr><th>'+i+':00</th>'
      // BOUCLE ALLANT DU LUNDI AU VENDREDI
      for (let day in days) {
        // SI L'HEURE EST PLEINE
        if (timetable[days[day]][i].length == undefined && timetable[days[day]][i].nom != undefined) {
          table += '<td class="padding-on section-on bubule" mydata=`'+JSON.stringify(timetable[days[day]][i])+'` onclick="addData(this)" style="padding-left:0;padding-right:0;color:white;border:none;background-color:'+matiere[timetable[days[day]][i].nom].color+'"><b>' + timetable[days[day]][i].nom + '</b><div>'+timetable[days[day]][i].nom_prof+'<br>'+timetable[days[day]][i].debut+'-'+timetable[days[day]][i].fin+'</div></td>';
        } else if (timetable[days[day]][i].length != undefined) {

          let first_case = { nom : '-', data : '', color : 'none', class : 'bubule', padding : 'padding:0;', mydata : ''};
          let second_case = { nom : '-', data : '', color : 'none', class : 'bubule', padding : 'padding:0;', mydata : ''};
          if (timetable[days[day]][i][0].nom != undefined) {
            first_case.nom = '<b>'+timetable[days[day]][i][0].nom+'</b>';
            first_case.color = matiere[timetable[days[day]][i][0].nom].color;
            first_case.class += ' section-on';
            first_case.padding += 'color:white;';
            first_case.data = '<div>'+timetable[days[day]][i][0].nom_prof+'<br>'+timetable[days[day]][i][0].debut+'-'+timetable[days[day]][i][0].fin+'</div>';
            first_case.mydata = 'mydata=`'+JSON.stringify(timetable[days[day]][i][0])+'` onclick="addData(this)"'
          }
          if (timetable[days[day]][i][1].nom != undefined) {
            second_case.nom = '<b>'+timetable[days[day]][i][1].nom+'</b>';
            second_case.color = matiere[timetable[days[day]][i][1].nom].color;
            second_case.class += ' section-on';
            second_case.padding += 'color:white;';
            second_case.data = '<div>'+timetable[days[day]][i][1].nom_prof+'<br>'+timetable[days[day]][i][1].debut+'-'+timetable[days[day]][i][1].fin+'</div>';
            second_case.mydata = 'mydata=`'+JSON.stringify(timetable[days[day]][i][1])+'` onclick="addData(this)"'
          }
          table += '<td style="padding:0;border:none"><table class="table" style="margin:0;padding:0;border:none"><tr style="border:none;"><td class="'+first_case.class+'" style="'+first_case.padding+'border:none;background-color:'+first_case.color+'" '+first_case.mydata+'>'+first_case.nom+first_case.data+'</td></tr><tr style="border:none"><td class="'+second_case.class+'" style="'+second_case.padding+'border:none;padding:0;background-color:'+second_case.color+'" '+second_case.mydata+'>'+second_case.nom+second_case.data+'</td></tr></table></td>';
        } else {
          table += '<td class="bubule">-</td>';
        }
      }
      table += '</tr>';
    }

    // null NE FONCTIONNE PAS LORSQUE LES {} SONT VIDE (marche sur asimov.js) UTILISER undefined.

    table += '</tbody></table>';
    conteneur.append(table);
    compare_arrays('#btn_reinit', "#Reinit_Modal");
    compare_arrays('#btn_update', "#Update_Modal");
    console.log(timetable)
}

if (timetable != null) {
  append_timetable(timetable);
}

// let border = 'rgb(' + (parseInt((matiere[timetable[days[day]][i].nom].color).substring(1,3), 16)/2).toFixed(0) +','+ (parseInt((matiere[timetable[days[day]][i].nom].color).substring(3,5), 16)/2).toFixed() + ','+ (parseInt((matiere[timetable[days[day]][i].nom].color).substring(5,7), 16)/2).toFixed() + ')';

// CHANGE LAST VALUE TO AVOID PROBLEMES IF CLICK ON "supprimer"
$('select[name=matieres]').change(() => { $('input[name=complete_data]').val("")});
$('select[name=days]').change(() => { $('input[name=complete_data]').val("")});

// IF CLICK ON TIMETABLE ADD DATA ON EDIT AREA
function addData(e) {
  let data = JSON.parse(e.attributes.mydata.value.replace(/`/g, ''));
  $('select[name=matieres]').val(data.nom);
  $('select[name=days]').val(data.jour);
  $('input[name=heure_debut]').val(parseInt(data.debut.substring(0,2)));
  $('select[name=min_debut]').val(data.debut.substring(3,5));
  $('input[name=heure_fin]').val(parseInt(data.fin.substring(0,2)));
  $('select[name=min_fin]').val(data.fin.substring(3,5));
  $('input[name=complete_data]').val(e.attributes.mydata.value.replace(/`/g, ''));
}

// VERIFY DATA ONCLICK ON "Enregistrer"
function verifyData() {
  let heure_debut = parseInt($('input[name=heure_debut]').val());
  let heure_fin = parseInt($('input[name=heure_fin]').val());
  let min_debut = parseInt($('select[name=min_debut]').val());
  let min_fin = parseInt($('select[name=min_fin]').val());
  let nom_prof = matiere[$('select[name=matieres]').val()].nom_prof;
  let nom_Matiere = $('select[name=matieres]').val();
  let checked = true;
  let check_data;

  // CALCUL START AND END
  function calc_time(hd, md, hf, mf) {
    let debut;
    let fin;

    if (hd < 10) debut = '0' + hd;
    else debut = hd;
    if (md == 0) debut += ':00';
    else debut += ':30'

    if (hf < 10) fin = '0' + hf;
    else fin = hf;
    if (mf == 0) fin += ':00';
    else fin += ':30'

    return [debut, fin];
  }
  let debut = calc_time(heure_debut, min_debut, heure_fin, min_fin)[0];
  let fin = calc_time(heure_debut, min_debut, heure_fin, min_fin)[1];
  // CALCUL DUREE
  function calc_duree(hd, md, hf, mf) {
    let duree
    if (mf == 0 && md == 30) {
      if (hf - hd - 1 < 10) duree = '0' + (hf - hd - 1);
      else duree = hf - hd
      if (Math.abs(mf - md) == 0) duree += ':00';
      else duree += ':30'
    } else {
      if (hf - hd < 10 ) duree = '0'+ (hf - hd);
      else duree = hf - hd
      if (Math.abs(mf - md) == 0) duree += ':00';
      else duree += ':30'
    }
    return duree
  }

  if ($('select[name=matieres]').val() && $('select[name=days]').val() && $('input[name=heure_debut]').val() && $('select[name=min_debut]').val() && $('input[name=heure_fin]').val() && $('select[name=min_fin]').val()) {
    if ((heure_fin < heure_debut) || (heure_fin == heure_debut && min_fin <= min_debut) || (heure_fin == 18 && min_fin == 30)) {
      checked = false;
      check_data = { id_matiere: matiere[nom_Matiere].id_matiere, nom : $('select[name=matieres]').val(), nom_prof : nom_prof, jour : $('select[name=days]').val(), debut : debut, fin : fin}
      return updateData(checked, check_data);
    } else {
      check_data = { id_matiere: matiere[nom_Matiere].id_matiere, nom : $('select[name=matieres]').val(), nom_prof : nom_prof, jour : $('select[name=days]').val(), debut : debut, fin : fin, duree : ''}
      // CHECK IF THERE IS THE SAME SUBJECT BEFORE AND AFTER. IF YES, FUSIONNED THEM.
      if (min_debut == 0) {
        console.log(1, check_data);
        if (heure_debut > 8) {
          if (mytable[$('select[name=days]').val()][heure_debut-1].length == undefined && mytable[$('select[name=days]').val()][heure_debut-1].nom == check_data.nom) check_data.debut = mytable[$('select[name=days]').val()][heure_debut-1].debut;
          else if (mytable[$('select[name=days]').val()][heure_debut-1][1] != undefined && mytable[$('select[name=days]').val()][heure_debut-1][1].nom == check_data.nom) check_data.debut = mytable[$('select[name=days]').val()][heure_debut-1][1].debut;
        }
      } else if (min_debut == 30) {
        console.log(2, check_data);
        if (mytable[$('select[name=days]').val()][heure_debut].length == undefined && mytable[$('select[name=days]').val()][heure_debut].nom == check_data.nom) check_data.debut = mytable[$('select[name=days]').val()][heure_debut].debut;
        else if (mytable[$('select[name=days]').val()][heure_debut] != undefined) {
          if (mytable[$('select[name=days]').val()][heure_debut] != undefined && mytable[$('select[name=days]').val()][heure_debut][0].nom == check_data.nom) {
            check_data.debut = mytable[$('select[name=days]').val()][heure_debut][0].debut;
          }
        }
      }

      if (min_fin == 0) {
        if (heure_fin < 18) {
          if (mytable[$('select[name=days]').val()][heure_fin].length == undefined && mytable[$('select[name=days]').val()][heure_fin].nom == check_data.nom) check_data.fin = mytable[$('select[name=days]').val()][heure_fin].fin;
          else if (mytable[$('select[name=days]').val()][heure_fin][0] != undefined && mytable[$('select[name=days]').val()][heure_fin][0].nom == check_data.nom) check_data.fin = mytable[$('select[name=days]').val()][heure_fin][0].fin;
        }
        console.log(3, check_data);
      } else if (min_fin == 30) {
        console.log(4, check_data)
        if (mytable[$('select[name=days]').val()][heure_fin].length == undefined && mytable[$('select[name=days]').val()][heure_fin].nom == check_data.nom) check_data.fin = mytable[$('select[name=days]').val()][heure_fin].fin;
        else if (mytable[$('select[name=days]').val()][heure_fin].length != undefined) {
          if (mytable[$('select[name=days]').val()][heure_fin][1].nom != undefined && mytable[$('select[name=days]').val()][heure_fin][1].nom == check_data.nom) check_data.fin = mytable[$('select[name=days]').val()][heure_fin][1].fin;
        }
      }

      let duree = calc_duree(parseInt(check_data.debut.substring(0,2)), parseInt(check_data.debut.substring(3,5)), parseInt(check_data.fin.substring(0,2)), parseInt(check_data.fin.substring(3,5)));
      check_data.duree = duree;

      for (let i = parseInt(check_data.debut.substring(0,2)); i < parseInt(check_data.fin.substring(0,2)); i++) {

        if (mytable[check_data.jour][i].length == undefined && mytable[check_data.jour][i].nom != undefined) {
          if (mytable[check_data.jour][i].nom != check_data.nom) {
            checked = false;
            return updateData(checked, check_data);
          }
        } else if (mytable[check_data.jour][i].length != undefined) {
          // SI LE NVX COURS COMMENCE DANS LA PREMIERE DEMI-HEURE
          if (mytable[check_data.jour][heure_debut].length != undefined && mytable[check_data.jour][heure_debut][0].nom != undefined) {
            if (min_debut == 0) {
              if (mytable[check_data.jour][i][0].nom != check_data.nom) {
                checked = false;
                return updateData(checked, check_data);
              }
            }
          }
          // SI LE NVX COURS COMMENCE DANS LA SECONDE DEMI-HEURE
          if (mytable[check_data.jour][heure_debut].length != undefined && mytable[check_data.jour][heure_debut][1].nom != undefined) {
            if (min_debut == 30) {
              if (mytable[check_data.jour][i][1].nom != check_data.nom) {
                checked = false;
                return updateData(checked, check_data);
              }
            }
          }
          // SI LE NVX COURS TERMINE DANS LA PREMIERE DEMI-HEURE (ex : jusqu'à 14h30)
          if (heure_fin == 18) heure_fin = 17;
          if (mytable[check_data.jour][heure_fin].length != undefined && mytable[check_data.jour][heure_fin][1].nom != undefined) {
            if (min_debut == 30) {
              if (mytable[check_data.jour][i][1].nom != check_data.nom) {
                checked = false;
                return updateData(checked, check_data);
              }
            }
          }
          console.log(check_data);
          if (heure_debut != i && heure_fin-1 != i ) {
            checked = false;
            return updateData(checked, check_data);
          }
        }
      }
      console.log(check_data);
      return updateData(checked, check_data);
    }
  }
}

function updateData(checked, check_data) {
  if (checked) {

    // ON RECUPERE L'HEURE ET LA DUREE EN HEURE
    let heure = parseInt((check_data.debut).substring(0,2));
    let duree = parseInt((check_data.duree).substring(0,2));

    // DANS LE CAS OU LE COURS COMMENCE A PILE
    if (parseInt((check_data.debut).substring(3,5)) != 30) {
      // SI LA DUREE EXCEDE 0 (en h) ET DONC DIFFERENT DE 00:30 min
      if (duree > 0) {
        // ON REMPLI LE TABLEAU EN FONCTION DES HEURES OCCUPEES PAR LE COUR (ex: 8h00 -> 10h00)
        for (let i = 0; i < duree; i ++) {
          mytable[check_data.jour][heure + i] = { id_matiere: check_data.id_matiere, nom : check_data.nom, nom_prof : check_data.nom_prof , prenom_prof : check_data.prenom_prof, jour : check_data.jour, debut : check_data.debut, fin : check_data.fin, duree : check_data.fin };
        }
      }
      // CONDITION POUR REMPLIR LA PREMIERE DEMI-HEURE SI LE COURS NE FINI PAS A PILE (ex: 8h00 -> 9h30)
      if (parseInt((check_data.fin).substring(3,5)) == 30 && duree > 0) {
        if (mytable[check_data.jour][heure + duree].length == undefined) mytable[check_data.jour][heure + duree] = [{ id_matiere: check_data.id_matiere, nom : check_data.nom, nom_prof : check_data.nom_prof , prenom_prof : check_data.prenom_prof, jour : check_data.jour, debut : check_data.debut, fin : check_data.fin, duree : check_data.fin }, {}];
        else mytable[check_data.jour][heure + duree][0] = { id_matiere: check_data.id_matiere, nom : check_data.nom, nom_prof : check_data.nom_prof , prenom_prof : check_data.prenom_prof, jour : check_data.jour, debut : check_data.debut, fin : check_data.fin, duree : check_data.fin };

      } else if (parseInt((check_data.fin).substring(3,5)) == 30 && duree == 0) { // SI LE COURS NE DURE QUE 30 MIN ET COMMENCE A PILE (ex: 9h00 -> 9h30)
        if (mytable[check_data.jour][heure + duree].length == undefined) mytable[check_data.jour][heure] = [ { id_matiere: check_data.id_matiere, nom : check_data.nom, nom_prof : check_data.nom_prof , prenom_prof : check_data.prenom_prof , jour : check_data.jour, debut : check_data.debut, fin : check_data.fin, duree : check_data.fin }, {} ]
        else mytable[check_data.jour][heure][0] = { id_matiere: check_data.id_matiere, nom : check_data.nom, nom_prof : check_data.nom_prof , prenom_prof : check_data.prenom_prof , jour : check_data.jour, debut : check_data.debut, fin : check_data.fin, duree : check_data.fin };
      }
    } else {
      // ON VERIFIE SI LA CASE CONTIENT DEJA UNE DEMI-HEURE, SI NON ON CREER LES DEUX CASES, SI OUI ON MET A JOUR LA CASE
      if (mytable[check_data.jour][heure].length == undefined) {
        mytable[check_data.jour][heure] = [ {}, { id_matiere: check_data.id_matiere, nom : check_data.nom, nom_prof : check_data.nom_prof , prenom_prof : check_data.prenom_prof, jour : check_data.jour, debut : check_data.debut, fin : check_data.fin, duree : check_data.fin } ];
        // ON REPREND LE PRINCIPE DE COURS QUI DURE PLUSIEURS HEURES
        if (duree > 0) {
          for (let i = 1; i < duree + 1; i ++) {
            mytable[check_data.jour][heure + i] = { id_matiere: check_data.id_matiere, nom : check_data.nom, nom_prof : check_data.nom_prof , prenom_prof : check_data.prenom_prof, jour : check_data.jour, debut : check_data.debut, fin : check_data.fin, duree : check_data.fin };
          }
        }
      } else {
        mytable[check_data.jour][heure][1] = { id_matiere: check_data.id_matiere, nom : check_data.nom, nom_prof : check_data.nom_prof , prenom_prof : check_data.prenom_prof, jour : check_data.jour, debut : check_data.debut, fin : check_data.fin, duree : check_data.fin };
        if (duree > 0) {
          for (let i = 1; i < duree + 1; i ++) {
            mytable[check_data.jour][heure + i] = { id_matiere: check_data.id_matiere, nom : check_data.nom, nom_prof : check_data.nom_prof , prenom_prof : check_data.prenom_prof, jour : check_data.jour, debut : check_data.debut, fin : check_data.fin, duree : check_data.fin };
          }
        }
      }
    }

    $('#mytable').empty();
    append_timetable(mytable);

  } else {
    $('#timetable_notif').append('<div class="toast"><div class="toast-header" ><img id="toast-img" src="/img/croix.png"></div><div class="toast-body"><p id="toast-error">La tranche horaire est déjà occupée</p></div></div>')
  }
}

// DELETE DATA ON CLICK ON "Supprimer"
function deleteData() {
  let complete_data = $('input[name=complete_data]').val();

  if (complete_data) {
    complete_data = JSON.parse(complete_data);
    first_data = JSON.parse($('input[name=complete_data]').val());
    secondary_data = JSON.parse($('input[name=complete_data]').val());

    let matiere = $('select[name=matieres]').val();
    let day = $('select[name=days]').val();
    let heure_debut = parseInt($('input[name=heure_debut]').val());
    let min_debut = parseInt($('select[name=min_debut]').val());
    let heure_fin = parseInt($('input[name=heure_fin]').val());
    let min_fin = parseInt($('select[name=min_fin]').val());


    // CALCUL START AND END
    function calc_time(hd, md, hf, mf) {
      let debut;
      let fin;

      if (hd < 10) debut = '0' + hd;
      else debut = hd;
      if (md == 0) debut += ':00';
      else debut += ':30'

      if (hf < 10) fin = '0' + hf;
      else fin = hf;
      if (mf == 0) fin += ':00';
      else fin += ':30'

      return [debut, fin];
    }

    // CALCUL DUREE
    function calc_duree(hd, md, hf, mf) {
      let duree
      if (mf == 0 && md == 30) {
        if (hf - hd - 1 < 10) duree = '0' + (hf - hd - 1);
        else duree = hf - hd
        if (Math.abs(mf - md) == 0) duree += ':00';
        else duree += ':30'
      } else {
        if (hf - hd < 10 ) duree = '0'+ (hf - hd);
        else duree = hf - hd
        if (Math.abs(mf - md) == 0) duree += ':00';
        else duree += ':30'
      }
      return duree
    }


    // COMPARE DATA
    if (((heure_debut == parseInt(complete_data.debut.substring(0,2)) && min_debut != parseInt(complete_data.debut.substring(3,5))) || heure_debut != parseInt(complete_data.debut.substring(0,2))) && heure_fin != parseInt(complete_data.fin.substring(0,2))) {
      // LE COURS EST DIVISE EN DEUX
      let debut = calc_time(heure_debut, min_debut, heure_fin, min_fin)[0];
      let fin = calc_time(heure_debut, min_debut, heure_fin, min_fin)[1];
      first_data.fin = debut;
      first_data.duree = calc_duree(parseInt(complete_data.debut.substring(0,2)), parseInt(complete_data.debut.substring(3,5)), heure_debut, min_debut);
      secondary_data.debut = fin;
      secondary_data.duree = calc_duree(heure_fin, min_fin,parseInt(complete_data.fin.substring(0,2)), parseInt(complete_data.fin.substring(3,5)));
    } else if (heure_debut == parseInt(complete_data.debut.substring(0,2)) && min_debut == parseInt(complete_data.debut.substring(3,5)) && heure_fin == parseInt(complete_data.fin.substring(0,2)) && min_fin == parseInt(complete_data.fin.substring(3,5))) {
      first_data = null;
      secondary_data = null;
    } else if (heure_debut == parseInt(complete_data.debut.substring(0,2)) && min_debut == parseInt(complete_data.debut.substring(3,5))) {
      first_data.debut = calc_time(heure_debut, min_debut, heure_fin, min_fin)[1];
      first_data.duree = calc_duree(heure_fin, min_fin, parseInt(first_data.fin.substring(0,2)), parseInt(first_data.fin.substring(3,5)));
      secondary_data = null;
    } else if (heure_fin == parseInt(complete_data.fin.substring(0,2))) {
      first_data.fin = calc_time(heure_debut, min_debut, heure_fin, min_fin)[0];
      first_data.duree = calc_duree(parseInt(first_data.debut.substring(0,2)), parseInt(first_data.debut.substring(3,5)), heure_debut, min_debut);
      secondary_data = null;
    }

    // REMOVE
    for (let i = heure_debut; i < heure_fin; i++) {
      if (mytable[day][i].length == undefined) {
        if (mytable[day][i].nom == matiere && parseInt(mytable[day][i].debut.substring(0,2)) == parseInt(complete_data.debut.substring(0,2))) mytable[day][i] = {};
      } else {
        if (mytable[day][i][0].nom != undefined) {
          if (mytable[day][i][0].nom == matiere && parseInt(mytable[day][i][0].debut.substring(0,2)) == parseInt(complete_data.debut.substring(0,2))) mytable[day][i][0] = {};
        }
        if (mytable[day][i][1].nom != undefined) {
          if (mytable[day][i][1].nom == matiere && parseInt(mytable[day][i][1].debut.substring(0,2)) == parseInt(complete_data.debut.substring(0,2))) mytable[day][i][1] = {};
        }
        if (mytable[day][i][0].nom == undefined && mytable[day][i][1].nom == undefined) mytable[day][i] = {};
      }
    }

    if (min_fin == 30) {
      if (mytable[day][heure_fin].length == undefined) {
        if (mytable[day][heure_fin].nom == matiere && parseInt(mytable[day][heure_fin].debut.substring(0,2))) mytable[day][heure_fin] = [{}, {}]
      } else {
        if (mytable[day][heure_fin][0].nom == matiere && parseInt(mytable[day][heure_fin][0].debut.substring(0,2)) == parseInt(complete_data.debut.substring(0,2))) mytable[day][heure_fin][0] = {};
        if (mytable[day][heure_fin][0].nom == undefined && mytable[day][heure_fin][1].nom == undefined) mytable[day][heure_fin] = {};
      }
    }

    if (first_data) updateData(true, first_data);
    else {
      $('#mytable').empty();
      append_timetable(mytable);
    }
    if (first_data && secondary_data) updateData(true, secondary_data);

  }
}

function compare_arrays(id, data_attribut) {
  if (JSON.stringify(timetable) != JSON.stringify(mytable)) {
    $(id).removeAttr("disabled");
    $(id).attr("data-target", data_attribut)
    return true
  } else {
    $(id).attr("data-target", "");
    $(id).attr("disabled", data_attribut);
    return false
  }
}

// REINITIALISATION OF TIMETABLE (FROM NOW TO DEFAULT)
function reinitialisation() {
  if (JSON.stringify(timetable) != JSON.stringify(mytable)) {
    mytable = JSON.stringify(timetable);
    mytable = JSON.parse(mytable);
    $('#mytable').empty();
    append_timetable(mytable);
  }
}

// ADD DATA TO FORM ON SUBMIT
function push_data() {
  $('#form_post_timetable input').val(JSON.stringify(mytable));
}

/*

/!\ ATTENTION, ERREUR JS DETECTEE !
LORSQUE QU'UNE VARIABLE A PREND LA VALEUR D'UNE VARIABLE B, SI A CHANGE, B CHANGE AUSSI. INCORRIGIBLE (passer par une variable C)


A FAIRE :

- Attribution des couleurs à une matiere spécifique (ce qui évite qu'elles change de couleur) -- fait --
- Algorithme qui vérifie si ce qui est dans l'"edit-zone" est correct, en comparant les heures et les mins. -- fait --
- les données seront répretoriés dans un tableau avec l'ajout de données comme UPDATE OU DELETE. -- changement d'idée --

*/
