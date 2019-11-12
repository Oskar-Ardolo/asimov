exports.doLogStuff = (req, res) => {
	if(req.session.login) {
		res.render("index.ejs");
	} else {
		res.render("login.ejs");
	}
}

exports.login = (req, res, db, crypto) => {
	if(req.body.pseudo.includes("-")) {
		let pseudo = req.body.pseudo;
		let password = crypto.createHmac('sha256', req.body.password)
	                   .update('jojofags suck')
	                   .digest('hex');
        let query = "SELECT * FROM asimov_users WHERE pseudo = '" + pseudo + "' AND password = '" + password + "'";
	    db.query(query, function (err, result) {
		    if (err) throw err;
		    if((result[0].nom)) {
		    	req.session.login = true;
		    	req.session.id = result[0].id;
		    	res.redirect("/home");
		    }
		 });

	} else {

	}
	
	
}





