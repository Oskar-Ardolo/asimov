class DB {
   	constructor(db) {
   		this.db = db;
  	}




  	// GET
  		// USERS
  	async getUsers() {
  		let query = "SELECT asimov_users.id, asimov_users.nom, asimov_users.prenom, asimov_users.pseudo, asimov_classes.nomclasse FROM asimov_users, asimov_classes, asimov_dansclasse WHERE rang = '1' AND asimov_users.id = asimov_dansclasse.iduser AND asimov_dansclasse.idclasse = asimov_classes.idclasse ORDER BY nom ASC"
		  return this.doQuery(query)
  	}
  	async getUserByPseudo(pseudo) {
  		let query = "SELECT id, nom, prenom, pseudo FROM asimov_users WHERE asimov_users.pseudo = '"+ pseudo +"'"
		  return this.doQuery(query)
  	}
    async getUserById(id) {
      let query = "SELECT id, nom, prenom, pseudo FROM asimov_users WHERE asimov_users.id = '"+ id +"'"
      return this.doQuery(query)
    }
    async getUsersFromClasse(idclasse) {
      let query = "SELECT asimov_users.* FROM asimov_users, asimov_dansclasse WHERE asimov_dansclasse.iduser = asimov_users.id AND asimov_dansclasse.idclasse = '"+ idclasse +"' ORDER BY asimov_users.nom"
      return this.doQuery(query)
    }

  		// CLASSES
  	async getClasses() {
  		let query = "SELECT * FROM asimov_classes ORDER BY nomclasse"
	    return this.doQuery(query)
  	}
  	async getClassesAndUserCount() {
  		let query = "SELECT asimov_classes.idclasse, nomclasse, count(iduser) as effectif FROM asimov_classes LEFT JOIN asimov_dansclasse ON asimov_classes.idclasse = asimov_dansclasse.idclasse GROUP BY nomclasse";
	    return this.doQuery(query)
  	}
    async getClasseById(idclasse) {
      let query = "SELECT * FROM asimov_classes WHERE idclasse = '"+idclasse+"'"
      return this.doQuery(query)
    }

  		// PROFS
  	async getProfs() {
  		let query = "SELECT asimov_users.id, asimov_users.nom, asimov_users.prenom, asimov_users.pseudo FROM asimov_users WHERE rang = 5 ORDER BY nom";
	    return this.doQuery(query)
  	}


  		// MATIERES
  	async getMatieres() {
  		let query = "SELECT * FROM asimov_matieres ORDER BY nommatiere";
  		return this.doQuery(query)
  	}
  	async getMatieresAndProfCount() {
  		let query = "SELECT nommatiere, count(idprof) as effectif FROM asimov_matieres LEFT JOIN asimov_enseignematiere ON asimov_matieres.id = asimov_enseignematiere.idmatiere GROUP BY nommatiere";
  		return this.doQuery(query)
  	}
    async getMatieresForOneProf(id) {
      let query = "SELECT idmatiere FROM asimov_enseignematiere WHERE asimov_enseignematiere.idprof = '"+id+"'"
      return this.doQuery(query)
    }
    async addMatiereToProf(idprof, idmatiere) {
      let query = "INSERT INTO asimov_enseignematiere(idprof, idmatiere) VALUES (?, ?)";
      return this.doInsert(query, [idprof, idmatiere]);
    }


  	// COUNTS
  	async userCount() {
  		let query = "SELECT Count(*) as nbre FROM asimov_users WHERE rang = 1;";
	    return this.doQuery(query)
  	}
  	async profCount() {
  		let query = "SELECT Count(*) as nbre FROM asimov_users WHERE rang = 5;";
	    return this.doQuery(query)
  	}
  	async classeCount() {
  		let query = "SELECT Count(*) as nbre FROM asimov_classes;";
	    return this.doQuery(query)
  	}
  	async matiereCount() {
  		let query = "SELECT Count(*) as nbre FROM asimov_matieres;";
	    return this.doQuery(query)
  	}

  	// INSERTS
  	async addUser(userInfos, classe) {
  		let query = "INSERT INTO asimov_users(id, nom, prenom, pseudo, password, rang, titre) VALUES (NULL, ?, ?, ?, ?, ?, ?)";
  		let insertedQuery = this.doInsert(query, userInfos);
  		return insertedQuery.then((r, e) => {
  			let iduser = r.insertId;
		    let queryClasse = "INSERT INTO asimov_dansclasse(iduser, idclasse) VALUES (?, ?)";
		    return this.doInsert(queryClasse, [iduser, classe]);
  		})
  	}
  	async addProf(profInfos) {
  		let query = "INSERT INTO asimov_users(id, nom, prenom, pseudo, password, rang, titre) VALUES (NULL, ?, ?, ?, ?, ?, ?)";
  		return this.doInsert(query, profInfos);
  	}
  	async addClasse(classe) {
  		let query = "INSERT INTO asimov_classes(idclasse, nomclasse) VALUES (NULL, ?)"
  		return this.doInsert(query, [classe])
  	}
  	async addMatiere(matiere) {
  		let query = "INSERT INTO asimov_matieres(id, nommatiere) VALUES (NULL, ?)"
  		return this.doInsert(query, [matiere])
  	}



    //MODIFICATIONS

      // Classes
    async editClasse(idclasse, nomclasse, profprincipal) {
      let query = "UPDATE asimov_classes SET nomclasse = '"+nomclasse+"', profprincipal = '"+profprincipal+"' WHERE idclasse = '"+idclasse+"' "
      return this.doQuery(query)
    }



  	// VERIFICATIONS
  	async login(pseudo, password) {
  		let query = "SELECT * FROM asimov_users WHERE pseudo = '" + pseudo + "' AND password = '" + password + "'";
  		return this.doQuery(query);
  	}




  	// CORE FUNCTIONS
  	async doQuery(queryToDo) {
  		let pro = new Promise((resolve,reject) => {
  			let query = queryToDo;
  			this.db.query(query, function (err, result) {
  			    if (err) throw err; // GESTION D'ERREURS
  			    resolve(result);
  			});
  		})
  		return pro.then((val) => {
  			return val;
  		})
  	}




  	async doInsert(queryToDo, array) {
  		let pro = new Promise((resolve,reject) => {
			let query = queryToDo;
			this.db.query(query, array, function (err, result) {
			    if (err) throw err; // GESTION D'ERREURS
			    resolve(result);
			});
		})
		return pro.then((val) => {
			return val;
		})
  	}
}

module.exports = DB;
