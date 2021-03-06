const db = require('./database_connect')

class DB {

// ======================================== CORE FUNCTION ==========================================================================================================================================================================================================================================================================================================================================================================================================================================================

  static doQuery(queryToDo) {
    return new Promise( async (resolve,reject) => {
      try {
        const query = queryToDo;
        db.query(query, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      } catch (err) {
        console.log(err);
        reject(err)
      }
    })
  }

  static doInsert(queryToDo, array) {
    return new Promise( async (resolve,reject) => {
      try {
        const query = queryToDo;
        db.query(query, array, function (err, result) {
            if (err) console.log(err); // GESTION D'ERREURS
            else resolve(result);
        });
      } catch (err) {
        console.log(err);
        reject(err);
      }
      
    });
  }

// ======================================== SELECT / GET ===========================================================================================================================================================================================================================================================================================================================================================================================================================================================

// _______________________________________
//
//                USERS
// _______________________________________

  	static getUsers() {
  		const query = "SELECT asimov_users.id, asimov_users.nom, asimov_users.prenom, asimov_users.pseudo, asimov_classes.nomclasse FROM asimov_users, asimov_classes, asimov_dansclasse WHERE rang = '1' AND asimov_users.id = asimov_dansclasse.iduser AND asimov_dansclasse.idclasse = asimov_classes.idclasse ORDER BY nom ASC"
		return this.doQuery(query)
  	}
  	 static getUserByPseudo(pseudo) {
  		const query = `SELECT id, nom, prenom, pseudo, titre, rang FROM asimov_users WHERE asimov_users.pseudo = '${pseudo}'`
		  return this.doQuery(query)
  	}
     static getUserById(id) {
      const query = `SELECT id, nom, prenom, pseudo FROM asimov_users WHERE asimov_users.id = '${id}'`
      return this.doQuery(query)
    }
     static getUsersWithoutClasses() {
      let query = "SELECT asimov_users.* FROM asimov_users LEFT JOIN asimov_dansclasse ON asimov_users.id=asimov_dansclasse.iduser WHERE asimov_dansclasse.iduser IS NULL AND asimov_users.rang ='1' ORDER BY asimov_users.nom"
      return this.doQuery(query)
    }
     static getUsersFromClasse(idclasse) {
      let query = "SELECT asimov_users.* FROM asimov_users, asimov_dansclasse WHERE asimov_dansclasse.iduser = asimov_users.id AND asimov_dansclasse.idclasse = '"+ idclasse +"' ORDER BY asimov_users.nom"
      return this.doQuery(query)
    }
     static getRangUserWithId(user) {
      let query = "SELECT rang FROM asimov_users WHERE asimov_users.id = '"+ user +"'"
      return this.doQuery(query)
    }
     static getUserClasseFromId(id) {
      let query = "SELECT asimov_classes.nomclasse FROM asimov_classes LEFT JOIN asimov_dansclasse ON asimov_classes.idclasse = asimov_dansclasse.idclasse WHERE asimov_dansclasse.iduser ='"+id+"'"
      return this.doQuery(query)
    }
     static getUserDuplicate(nom, prenom, pseudo) {
      let query = "SELECT id, nom, prenom, pseudo, rang FROM asimov_users WHERE nom='"+nom+"' AND prenom='"+prenom+"' AND pseudo='"+pseudo+"'"
      return this.doQuery(query)
    }
     static getProfWithoutThisMatiere(idmatiere) {
      let query = "SELECT asimov_users.* FROM asimov_users LEFT JOIN asimov_enseignematiere ON asimov_users.id=asimov_enseignematiere.idprof WHERE (asimov_users.id=asimov_enseignematiere.idprof) AND (asimov_users.rang ='5') AND (asimov_enseignematiere.idmatiere != '"+idmatiere+"') ORDER BY asimov_users.nom"
      return this.doQuery(query)
    }
     static getUsersByIdProf(id_prof) {
      let query = 'SELECT users.id, users.nom, users.prenom, DA.idclasse, classes.nomclasse FROM asimov_dansclasse AS DA JOIN asimov_users AS users ON users.id = DA.iduser JOIN asimov_classes AS classes ON classes.idclasse = DA.idclasse WHERE DA.idclasse IN (SELECT DA2.idclasse FROM asimov_dansclasse AS DA2 WHERE DA2.iduser = "'+id_prof+'") AND DA.iduser != "'+id_prof+'" ORDER BY classes.nomclasse';
      return this.doQuery(query);
    }

// _______________________________________
//
//                CLASSES
// _______________________________________

  	 static getClasses() {
  		let query = "SELECT * FROM asimov_classes ORDER BY nomclasse"
	    return this.doQuery(query)
  	}
  	 static getClassesAndUserCount() {
  		let query = "SELECT asimov_classes.idclasse, nomclasse, count(iduser) as effectif FROM asimov_classes LEFT JOIN asimov_dansclasse ON asimov_classes.idclasse = asimov_dansclasse.idclasse GROUP BY nomclasse";
	    return this.doQuery(query)
  	}
     static getClasseById(idclasse) {
      let query = "SELECT * FROM asimov_classes WHERE idclasse = '"+idclasse+"'"
      return this.doQuery(query)
    }
     static getClasseByNom(nomclasse) {
      let query = "SELECT * FROM asimov_classes WHERE nomclasse = '"+nomclasse+"'"
      return this.doQuery(query)
    }
     static getCountForOneClasse(classe) {
      let query = "SELECT asimov_classes.idclasse, nomclasse, count(iduser) as effectif FROM asimov_classes LEFT JOIN asimov_dansclasse ON asimov_classes.idclasse = asimov_dansclasse.idclasse WHERE asimov_classes.idclasse ='"+classe+"'";
      return this.doQuery(query)
    }

// _______________________________________
//
//                PROFS
// _______________________________________

  	 static getProfs() {
  		let query = "SELECT asimov_users.id, asimov_users.nom, asimov_users.prenom, asimov_users.pseudo FROM asimov_users WHERE rang = 5 ORDER BY nom";
	    return this.doQuery(query)
  	}


// _______________________________________
//
//                MATIERES
// _______________________________________

  	 static getMatieres() {
  		let query = "SELECT * FROM asimov_matieres ORDER BY nommatiere";
  		return this.doQuery(query)
  	}
  	 static getMatieresById(id) {
  		let query = "SELECT * FROM asimov_matieres WHERE id='"+ id +"' ORDER BY nommatiere";
  		return this.doQuery(query)
  	}
     static getMatiereByNom(nom) {
      let query = "SELECT * FROM asimov_matieres WHERE nommatiere='"+ nom +"' ORDER BY nommatiere";
      return this.doQuery(query)
    }
  	 static getMatieresAndProfCount() {
  		let query = "SELECT id, nommatiere, count(idprof) as effectif FROM asimov_matieres LEFT JOIN asimov_enseignematiere ON asimov_matieres.id = asimov_enseignematiere.idmatiere GROUP BY nommatiere";
  		return this.doQuery(query)
  	}
     static getMatieresForOneProf(id) {
      let query = "SELECT E.idmatiere, M.nommatiere FROM asimov_enseignematiere AS E JOIN asimov_matieres AS M ON M.id = E.idmatiere WHERE E.idprof = '"+id+"'"
      return this.doQuery(query)
    }
     static getProfsForOneMatiere(id) {
      let query = "SELECT asimov_users.id,  asimov_users.nom,  asimov_users.prenom,  asimov_users.pseudo FROM asimov_users LEFT JOIN  asimov_enseignematiere ON  asimov_users.id =  asimov_enseignematiere.idprof WHERE asimov_enseignematiere.idmatiere ='"+id+"'";
      return this.doInsert(query);
    }
     static getMatieresForOneClasse(id_classe) {
      let query = "SELECT EM.idclasse, C.nomclasse, EM.idmatiere, M.nommatiere FROM asimov_enseignematiere AS EM JOIN asimov_matieres AS M ON M.id = EM.idmatiere JOIN asimov_classes AS C ON C.idclasse = EM.idclasse WHERE EM.idclasse='"+id_classe+"'"
      return this.doQuery(query);
    }
     static getMatieresAndTheseProfsForOneClasse(id_classe) {
      let query = "SELECT EM.idclasse, C.nomclasse, EM.idmatiere, M.nommatiere, Users.id, Users.nom FROM asimov_enseignematiere AS EM JOIN asimov_matieres AS M ON M.id = EM.idmatiere JOIN asimov_classes AS C ON C.idclasse = EM.idclasse JOIN asimov_users AS Users ON Users.id = EM.idprof WHERE EM.idclasse='"+id_classe+"'"
      return this.doQuery(query);
    }

// _______________________________________
//
//               DISCUSSIONS
// _______________________________________

     static getAllDiscussionById(iduser) {
      let query = "select msg1.*, users1.pseudo, CASE WHEN convers1.id_firstuser != '"+iduser+"' THEN users2.pseudo WHEN convers1.id_seconduser != '"+iduser+"' THEN users3.pseudo END AS destinataire from asimov_messages AS msg1 JOIN asimov_users AS users1 ON users1.id = msg1.iduser JOIN asimov_conversations AS convers1 ON convers1.id = msg1.idconvers JOIN asimov_users AS users2 ON users2.id = convers1.id_firstuser JOIN asimov_users AS users3 ON users3.id = convers1.id_seconduser where msg1.id = (select max(msg2.id) from asimov_messages AS msg2, asimov_conversations AS convers where msg2.idconvers = msg1.idconvers AND (convers.id_firstuser = '"+iduser+"' OR convers.id_seconduser = '"+iduser+"')) AND (convers1.id_firstuser = '"+iduser+"' OR convers1.id_seconduser = '"+iduser+"') ORDER BY msg1.id DESC"
      return this.doQuery(query);
    }

     static getDiscussionById(id_convers, id_user) {
      let query = "SELECT C.id AS idconv, M.id AS idmsg, M.iduser AS iduser, M.libelle AS content, CASE WHEN C.id_firstuser != '"+id_user+"' THEN users1.pseudo WHEN C.id_seconduser != '"+id_user+"' THEN users2.pseudo END AS destinataire, M.vu FROM asimov_messages AS M, asimov_conversations as C JOIN asimov_users AS users1 ON users1.id = C.id_firstuser JOIN asimov_users AS users2 ON users2.id = C.id_seconduser WHERE C.id = M.idconvers AND C.id ='"+id_convers+"' ORDER BY M.id";
      return this.doQuery(query);
    }

     static getDiscussionsByUsers(id_one, id_two) {
      let query = 'SELECT C.id FROM asimov_conversations AS C WHERE (C.id_firstuser = "'+id_one+'" AND C.id_seconduser = "'+id_two+'") OR (C.id_firstuser = "'+id_two+'" AND C.id_seconduser = "'+id_one+'")';
      return this.doQuery(query)
    }

     static getListOfUsersByStr(str) {
      let query = 'SELECT users.id, users.pseudo, users.nom, users.prenom FROM asimov_users AS users WHERE users.pseudo LIKE "%'+str+'%" OR users.nom LIKE "%'+str+'%" OR users.prenom LIKE "%'+str+'%" ORDER BY users.pseudo';
      return this.doQuery(query);
    }

     static conversExist(id_sender, id_destinataire) {
      let query = 'SELECT CASE WHEN C.id_seconduser = "'+id_destinataire+'" AND C.id_firstuser = "'+id_sender+'" THEN "true" WHEN C.id_firstuser = "'+id_destinataire+'" AND C.id_seconduser = "'+id_sender+'" THEN "true" END AS exist FROM asimov_conversations AS C WHERE (C.id_firstuser = "'+id_sender+'" AND C.id_seconduser = "'+id_destinataire+'") OR (C.id_firstuser = "'+id_destinataire+'" AND C.id_seconduser = "'+id_sender+'")';
      return this.doQuery(query);
    }

// _______________________________________
//
//               NOTES
// _______________________________________

     static getNotesByIdUser(id) {
      let query = 'SELECT N.id, N.note, C.bareme, C.description, DATE_FORMAT(C.date, "%d-%m-%Y") AS date, C.coefficient, C.id_matiere, M.nommatiere FROM asimov_notes AS N JOIN asimov_control AS C ON C.id = N.id_ds JOIN asimov_matieres AS M ON M.id = C.id_matiere WHERE N.id_user = "'+id+'"';
      return this.doQuery(query);
    }

// _______________________________________
//
//               CONTRÔLES
// _______________________________________

     static getControlByIdProf(id) {
      let query = 'SELECT C.id, C.id_prof, C.id_classe, C.id_matiere, C.description, C.coefficient, C.bareme, DATE_FORMAT(C.date, "%Y-%m-%d") AS date, classes.nomclasse FROM asimov_control AS C JOIN asimov_classes AS classes ON classes.idclasse = C.id_classe WHERE C.id_prof ="'+id+'";';
      return this.doQuery(query);
    }

     static getDataControlById(id) {
      let query = 'SELECT N.*, U.nom, U.prenom FROM asimov_notes AS N JOIN asimov_users AS U ON U.id = N.id_user WHERE N.id_ds =' + id;
      return this.doQuery(query);
    }

// _______________________________________
//
//               TIMESTABLE
// _______________________________________

     static getEdtForOneClasse(id) {
      let query ='SELECT E.*, C.nomclasse, M.nommatiere, U.nom, U.prenom FROM asimov_edt AS E JOIN asimov_classes AS C ON C.idclasse = E.id_classe JOIN asimov_matieres AS M ON M.id = E.id_matiere JOIN asimov_enseignematiere AS EM ON EM.idclasse = E.id_classe AND EM.idmatiere = E.id_matiere JOIN asimov_users AS U ON U.id = EM.idprof WHERE E.id_classe = "'+id+'" ORDER BY E.debut'
      return this.doQuery(query);
    }

// ======================================== COUNT ===========================================================================================================================================================================================================================================================================================================================================================================================================================================================

  	 static userCount() {
  		let query = "SELECT Count(*) as nbre FROM asimov_users WHERE rang = 1";
	    return this.doQuery(query)
  	}
  	 static profCount() {
  		let query = "SELECT Count(*) as nbre FROM asimov_users WHERE rang = 5";
	    return this.doQuery(query)
  	}
  	 static classeCount() {
  		let query = "SELECT Count(*) as nbre FROM asimov_classes";
	    return this.doQuery(query)
  	}
  	 static matiereCount() {
  		let query = "SELECT Count(*) as nbre FROM asimov_matieres";
	    return this.doQuery(query)
  	}

// ======================================== INSERT ===========================================================================================================================================================================================================================================================================================================================================================================================================================================================

  	 static addUser(userInfos, classe) {
  		let query = "INSERT INTO asimov_users(id, nom, prenom, pseudo, password, rang, titre) VALUES (NULL, ?, ?, ?, ?, ?, ?)";
  		let insertedQuery = this.doInsert(query, userInfos);
  		return insertedQuery.then((r, e) => {
  			let iduser = r.insertId;
		    let queryClasse = "INSERT INTO asimov_dansclasse(iduser, idclasse) VALUES (?, ?)";
		    return this.doInsert(queryClasse, [iduser, classe]);
  		})
  	}
  	 static addProf(profInfos) {
  		let query = "INSERT INTO asimov_users(id, nom, prenom, pseudo, password, rang, titre) VALUES (NULL, ?, ?, ?, ?, ?, ?)";
  		return this.doInsert(query, profInfos);
  	}
  	 static addClasse(classe) {
  		let query = "INSERT INTO asimov_classes(idclasse, nomclasse) VALUES (NULL, ?)"
  		return this.doInsert(query, [classe])
  	}
  	 static addMatiere(matiere) {
  		let query = "INSERT INTO asimov_matieres(id, nommatiere) VALUES ('', ?)"
  		return this.doInsert(query, [matiere])
  	}
     static addMatiereToProf(idprof, idmatiere, idclasse) {
      let query = "INSERT INTO asimov_enseignematiere(idprof, idmatiere, idclasse) VALUES (?, ?, ?)";
      return this.doInsert(query, [idprof, idmatiere, idclasse]);
    }
     static addClasseForUser(id, classe) {
      let query = "INSERT INTO asimov_dansclasse(iduser, idclasse) VALUES ('"+id+"', '"+classe+"')"
  		return this.doInsert(query)
    }

// _______________________________________
//
//               DISCUSSIONS
// _______________________________________

     static addNewMessage(idconvers, iduser, msg) {
      let query = `INSERT INTO asimov_messages (id, idconvers, iduser, libelle, date, vu) VALUES (NULL, "`+idconvers+`", "`+iduser+`", "`+msg+`", date, 0)`
      return this.doQuery(query)
    }

     static addNewConvers(id_sender, id_destinataire) {
      let query = 'INSERT INTO asimov_conversations (id, id_firstuser, id_seconduser) VALUES (NULL,'+id_sender+', '+id_destinataire+')'
      return this.doQuery(query);
    }

// _______________________________________
//
//               CONTRÔLES
// _______________________________________

     static addControl(data, id_prof) {
      let query = 'INSERT INTO asimov_control (id, id_prof, id_classe, id_matiere, description, coefficient, bareme, date) VALUES (NULL, '+id_prof+', '+data["header"].classe.id+', '+data["header"].matiere.id+', "'+data["header"].description+'", '+data["header"].coefficient+', '+data["header"].bareme+', "'+data["header"].date+'")'
      return this.doQuery(query).then((r, e) => {
        let second_query = '';
        for (let items in data["body"]) {
          second_query += 'INSERT INTO asimov_notes (id, note, id_user, id_ds) VALUES (NULL, "'+data["body"][items].notes+'", '+data["body"][items].id+', '+r.insertId+');'
        }
        return this.doQuery(second_query);
      });
    }

// _______________________________________
//
//               EMPLOI DU TEMPS
// _______________________________________

   static addTimeTable(array, id_classe) {
    let query = ''
    for (let items in array) {
      query +='INSERT INTO asimov_edt (id, id_classe, id_matiere, debut, fin, jour, duree) VALUES (NULL,'+id_classe+','+array[items].id_matiere+','+array[items].debut+','+array[items].fin+','+array[items].id_jour+','+array[items].duree+');'
    }
    return this.doQuery(query);
  }

// ======================================== UPDATE ===========================================================================================================================================================================================================================================================================================================================================================================================================================================================


    // Classes
     static editClasse(idclasse, nomclasse, profprincipal) {
      let query = "UPDATE asimov_classes SET nomclasse = '"+nomclasse+"', profprincipal = '"+profprincipal+"' WHERE idclasse = '"+idclasse+"' "
      return this.doQuery(query)
    }

     static updateClasseOfUser(iduser, newclasse) {
      let query = "UPDATE asimov_dansclasse SET idclasse = '"+newclasse+"' WHERE iduser = '"+iduser+"' "
      return this.doQuery(query)
    }

    // User

     static editUser(iduser, firstname, lastname, pseudo) {
      let query = "UPDATE asimov_users SET nom = '"+lastname+"', prenom = '"+firstname+"', pseudo = '"+pseudo+"' WHERE id = '"+iduser+"'"
      return this.doQuery(query)
    }

     static defaultPassword(id, password){
      let query = "UPDATE asimov_users SET password = '"+password+"' WHERE id = '"+id+"'"
      return this.doQuery(query)
    }

    // Matières

     static editMatiere(id, nom){
      let query = "UPDATE asimov_matieres SET nommatiere = '"+nom+"' WHERE id = '"+id+"'"
      return this.doQuery(query)
    }

// _______________________________________
//
//               DISCUSSIONS
// _______________________________________

   static readMessage(id_user, id_convers) {
    let query = 'UPDATE asimov_messages SET vu = "1" WHERE  iduser!="'+id_user+'" AND idconvers="'+id_convers+'" AND vu="0"';
    return this.doQuery(query);
  }

// _______________________________________
//
//               CONTRÔLES
// _______________________________________

   static update_DS(header, body, id_ds) {
    let query = 'UPDATE asimov_control SET id_classe = '+header[0][1]+', description = "'+header[2][1]+'", coefficient = '+header[5][1]+', bareme = '+header[4][1]+', date = "'+header[3][1]+'" WHERE id = '+id_ds;
    return this.doQuery(query).then((r,e) => {
      let second_query = '';
      for (let items in body) {
        second_query += 'UPDATE asimov_notes SET note="'+body[items][1]+'" WHERE id_ds="'+id_ds+'" AND id_user="'+body[items][0]+'";'
      }
      console.log(second_query);
      return this.doQuery(second_query);
    });
  }

// ======================================== DELETE ===========================================================================================================================================================================================================================================================================================================================================================================================================================================================


    //USERS
     static deleteUser(user) {
      let query = "DELETE FROM asimov_users WHERE id='"+user+"'"
      return this.doQuery(query)
    }

    //CLASSES

     static deleteClasse(classe) {
      let query = "DELETE FROM asimov_classes WHERE idclasse='"+classe+"'"
      return this.doQuery(query)
    }
     static deleteEleveFromClasse(classe, user) {
      let query = "DELETE FROM asimov_dansclasse WHERE (idclasse='"+classe+"' AND iduser='"+user+"')"
      return this.doQuery(query)
    }

    //MATIERE

     static deleteMatiere(matiere) {
      let query = "DELETE FROM asimov_matieres WHERE id='"+matiere+"'"
      return this.doQuery(query)
    }

     static deleteMatiereForOneProf(matiere, prof) {
      let query = "DELETE FROM asimov_enseignematiere WHERE (idmatiere='"+matiere+"' AND idprof ='"+prof+"')"
      return this.doQuery(query)
    }

     static delete_ds(id) {
      let query = 'DELETE C, N FROM asimov_control AS C JOIN asimov_notes AS N ON N.id_ds = C.id WHERE C.id = ' + id;
      return this.doQuery(query);
    }

// _______________________________________
//
//               EMPLOI DU TEMPS
// _______________________________________

       static deleteTimeTable(id) {
        let query = 'DELETE FROM asimov_edt WHERE id_classe ="'+id+'"';
        return this.doQuery(query);
      }

// ======================================== VERIFICATIONS ==========================================================================================================================================================================================================================================================================================================================================================================================================================================================
  	 static login(pseudo, password) {
  		const query = "SELECT * FROM asimov_users WHERE pseudo = '" + pseudo + "' AND password = '" + password + "'";
  		return this.doQuery(query);
  	}

     static verifyProfAndDS(id) {
      let query = 'SELECT * FROM asimov_control AS C WHERE C.id = '+id;
      return this.doQuery(query);
    }

    
    static verifyExistingDSforProf(id, id_prof) {
      const query = `SELECT * FROM asimov_control AS C WHERE C.id = '${id}' AND id_prof='${id_prof}'`
      return this.doQuery(query);
    }

}

module.exports = DB;
