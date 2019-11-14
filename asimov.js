const cap = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

exports.doLogStuff = (req, res) => {
	if(req.session.login) {
		res.render("index.ejs");
	} else {
		res.render("login.ejs");
	}
}


exports.login = (req, res, db, crypto) => {
	let pseudo = req.body.pseudo;
	let password = crypto.createHmac('sha256', req.body.password)
	               .update('jojofags suck')
	               .digest('hex');
	let query = "SELECT * FROM asimov_users WHERE pseudo = '" + pseudo + "' AND password = '" + password + "'";
	db.query(query, function (err, result) {
	    if (err) throw err;
	    if(result.length != 0) {
	    	req.session.login = true;
	    	req.session.rang = result[0].rang;
	    	if(result[0].rang >= 5) {
	    		res.redirect("/admin");
	    	} else {
	    		res.redirect("/home");
	    	}
	    } else {
	    	res.redirect("/home");
	    }
	});
}

/* 
======================
MODULES ADMINISTRATION
====================== 

Liste modules :

getAdminInfo : 
getUsers : affiche admin/users.ejs avec la liste des élèves


*/


exports.getAdminInfo = (req, res, db) => {
	if(req.session.rang >= 5) {
		let queries = "SELECT Count(*) as nbre FROM asimov_users WHERE rang = 1;SELECT Count(*) as nbre FROM asimov_users WHERE rang = 5;SELECT Count(*) as nbre FROM asimov_classes;SELECT Count(*) as nbre FROM asimov_matieres;";

		db.query(queries, function (err, results, fields) {
			let counts = JSON.stringify(results);
			counts =  JSON.parse(counts);
		    res.render("admin/admin.ejs", {counts : counts});
		});


	}
}


exports.getUsers = (req, res, db) => {
	if(req.session.rang >= 5) {
		let query = "SELECT asimov_users.id, asimov_users.nom, asimov_users.prenom, asimov_users.pseudo, asimov_classes.nomclasse FROM asimov_users, asimov_classes, asimov_dansclasse WHERE rang = '1' AND asimov_users.id = asimov_dansclasse.iduser AND asimov_dansclasse.idclasse = asimov_classes.idclasse ORDER BY nom ASC"
	    db.query(query, function (err, result) {
		    if (err) throw err;
		    let query2 = "SELECT * FROM asimov_classes ORDER BY nomclasse";
		    db.query(query2, function (err, result2) {
			    if (err) throw err;
			    res.render("admin/users.ejs", {data : result, classe : result2});
			});
		    
		});


	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home")
	}
	
}


exports.addUser = (req, res, db, crypto) => {
	if(req.session.rang >= 5) {
	    let nom = req.body.nom.toUpperCase();
	    let prenom = cap(req.body.prenom.toLowerCase());
	    let classe = req.body.classe;
	    let pseudo = nom.substr(0, 7).toLowerCase().replace(" ", "").replace("-", "") + prenom.substr(0,2).toLowerCase().replace(" ", "").replace("-", "");
	    let password = crypto.createHmac('sha256', nom + "-" + prenom)
	               .update('jojofags suck')
	               .digest('hex');
	    let rang = 1
	    let titre = "Élève";


	    let query = "INSERT INTO asimov_users(id, nom, prenom, pseudo, password, rang, titre) VALUES ('', '" + nom + "', '" + prenom + "', '" + pseudo + "', '" + password + "', '" + rang + "', '" + titre + "')";
	    db.query(query, function (err, result) {
		    if (err) throw err;
		    let iduser = result.insertId;
		    let queryClasse = "INSERT INTO asimov_dansclasse(iduser, idclasse) VALUES ('"+ iduser +"', '"+ classe +"')"
		    db.query(queryClasse, function (err, result2) {
			    if (err) throw err;
			    res.redirect("/admin/users");
			});
		});
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home")
	}
}

exports.getClasses = (req, res, db) => {
	if(req.session.rang >= 5) {
		let query = "SELECT nomclasse, count(iduser) as effectif FROM asimov_classes LEFT JOIN asimov_dansclasse ON asimov_classes.idclasse = asimov_dansclasse.idclasse GROUP BY nomclasse";
	    db.query(query, function (err2, result) {
		    if (err2) throw err2;
		    res.render("admin/classes.ejs", {data : result});
		});
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home")
	}
}

exports.addClasse = (req, res, db) => {
	if(req.session.rang >= 5) {
	    
	    let query = "INSERT INTO asimov_classes(idclasse, nomclasse) VALUES ('', '"+ req.body.nomclasse +"')"
	    db.query(query, function (err, result) {
		    if (err) throw err;
		    res.redirect("/admin/classes");
		});
	} else {
		req.session.login = false;
		req.session.rang = 0;
		res.redirect("/home")
	}
}




