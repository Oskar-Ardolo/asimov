/*
======================
MISC FUNCTIONS
======================

Liste fonctions :

cap(string) : renvoie un string avec la première lettre en majuscule et le reste en minuscule

double(nom, prenom, pseudo, db) : renvoie true lorsque l'utilisateur se trouve déjà dans la BDD
                                  et false lorsqu'il ne s'y trouve pas (évite les duplicatas)
verifier(dataOne, dataOneVar, dataTwo) : renvoie true lorsque la valeur 2 est présente dans la valeur 1 et false dans le cas contraire
                                        dataOneVar est un string, avec la fonction eval() => transform str en fonction
                                        à personaliser en fonction des besoins.
                                        /!\ attention, remplacer dataOneVar par : "dataOne[i].attribut"

getdate() : renvoie la date du jour au format dd/jj/yyyy
gethours() : renvoie l'heure au format h:min
*/







/*
======================
MODULES GENERAUX
======================

Liste modules :

getAdminInfo :
doLogStuff :
login :

*/

exports.doLogStuff = (req, res) => {
  
}


exports.login = (req, res, db, crypto, fs) => {
	
}

// Profil page
exports.getProfil = (req, res, db) => {
  
}

exports.getParameters = (req, res, db) => {
  
}

exports.getDiscussions = (req, res, db) => {
  
}

exports.postMessage = (req, res, db, msg) => {
  
}

/*
======================
MODULES ADMINISTRATION
======================

Liste modules :

getAdminInfo :
getUsers : affiche admin/users.ejs avec la liste des élèves


*/



// ADMINISTRATION GENERALE PROFS + PERSONNEL
exports.getAdminInfo = (req, res, db) => {
	
}



// GESTION DES UTILISATEURS (ELEVES)
exports.getUsers = (req, res, db) => {
	
}

// AJOUTER DES ELEVES
exports.addUser = (req, res, db, crypto, fs) => {
	
}

// AFFICHER LA FICHE D'UN ELEVE
exports.editUsersView = (req, res, db) => {
    
}

// METTRE A JOUR LES DONNEES D'UN ELEVE
exports.editUserData = (req, res, db, fs) => {
  
}

// REINITIALISER LE MOT DE PASSE D'UN ELEVE
exports.defaultPasswordForUser = (req, res, db, crypto, fs) => {

}

// SUPPRIMER UN ELEVE
exports.deleteUser = (req, res, db, fs) => {
  
}

// GESTION DES UTILISATEURS (PROFESSEURS + ADMINISTRATION)
exports.getProfs = (req, res, db) => {

}

// AJOUTER UN PROFESSEURS
exports.addProf = (req, res, db, crypto, fs) => {
	
}

// AFFICHER LA LISTE DES PROFESSEURS
exports.editProfView = (req, res, db) => {
	
}

// METTRE A JOUR LES DONNEES D'UN PROFESSEURS
exports.editProfData = (req, res, db, fs) => {
  
}

// REINITIALISER LE MOT DE PASSE D'UN PROFESSEUR
exports.defaultPasswordForProf = (req, res, db, crypto, fs) => {
  
}

// MODIFIER L'ATTRIBUTION DES MATIERE A UN PROFESSEUR
exports.matiereToProf = (req, res, db, fs) => {

}

// ADD USER TO CLASS
exports.addUserToClasse = (req, res, db, crypto, fs) => {
	
}

// METTRE A JOUR LES DONNEES D'UNE CLASSE
exports.doModifClasse = (req, res, db, fs) => {
	
}



// GESTION DES CLASSES
exports.getClasses = (req, res, db) => {
	
}

// AFFICHER LA LISTE DES CLASSES
exports.editClasse = (req, res, db) => {
	
}

// AJOUTER UNE CLASSE
exports.addClasse = (req, res, db, fs) => {
	
}

// SUPPRIMER UNE CLASSE
exports.deleteClasse = (req, res, db, fs) => {
  
}

// SUPPRIMER DES ELEVES DE LA CLASSE
exports.modifElevesInClasse = (req, res, db, fs) => {
    
}

// GESTION DES MATIERES
exports.getMatieres = (req, res, db) => {
	
}

// AJOUTER DES MATIERES
exports.addMatiere = (req, res, db, fs) => {
	
}

// SUPPRIMER DES MATIERES
exports.deleteMatiere = (req, res, db, fs) => {
  
}

// AFFICHER LA LISTE DES MATIERES
exports.editmatiere = (req, res, db) => {
    
}

// SUPPRIMER UN PROFESSEUR D'UNE MATIERE
exports.deleteProfFromMatiere = (req, res, db, fs) => {
 
}

// MODIFIER UNE MATIERE
exports.editMatiereData = (req, res, db, fs) => {
  
}

exports.addProfToMatiere = (req, res, db, fs) => {
  
}

exports.getEdt = (req, res, db) => {
  
}

exports.postEdt = (req, res, db) => {
  
}

/*
======================
MODULES PROFESSEURS
======================
*/

exports.getNotesForUsers = (req, res, db) => {
  
}

exports.postAddNewDs = (req, res, db) => {
  
}

exports.postModifiyDs = (req, res, db) => {
  
}

exports.postDeleteDs = (req, res, db) => {
  
}

/*
======================
MODULES UTILISATEURS
======================
*/

exports.getNotes = (req, res, db) => {
  
}


/*
======================
MODULES DE LOGS
======================
*/

// GESTION DES LOGS

exports.getLog = (req, res, fs) => {
  
}

// AFFICHER LES DETAILS D'UN LOG
exports.getLogforUser = async (req, res, fs) => {
  
}
