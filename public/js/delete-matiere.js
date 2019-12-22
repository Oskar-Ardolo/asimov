function verifier(id) {
  let btn = document.getElementById('btn-delete');
  btn.setAttribute('form', 'deletematiere-' + id);
}
verifier();

function redirect(id) {
  let btn = document.getElementById('btn-redirect');
  btn.setAttribute('onclick', "location.href='/admin/matieres/edit/" + id +"'");
}
redirect();
