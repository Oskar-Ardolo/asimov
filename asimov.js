exports.doLogStuff = (req, res) => {
	if(req.session.login) {
		res.render("index.ejs");
	} else {
		res.render("login.ejs");
	}
}

exports.login = (req, res, db, crypto) => {
	let users = db.collection("users");
	let pseudo = req.body.pseudo;
	let password = crypto.createHmac('sha256', req.body.password)
                   .update('jojofags suck')
                   .digest('hex');

    users.findOne({pseudo : pseudo, password : password}, function(err, result) {
    	if(result) {
    		req.session.login = true;
			res.redirect("/home");
    	} else {
    		res.redirect("/");
    	}
    })

	
}