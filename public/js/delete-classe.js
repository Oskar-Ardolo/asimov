function verifier(id) {
  let btn = document.getElementById('btn-delete');
  btn.setAttribute('form', 'deleteclasse-' + id);
}
verifier();

function redirect(id) {
  let btn = document.getElementById('btn-redirect');
  btn.setAttribute('onclick', "location.href='/admin/classes/edit/" + id +"'");
}
redirect();
