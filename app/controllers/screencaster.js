module.exports.getPending = function(req, res) {
	var auth = false
	if (req.user && req.user.role <= 3) {
		auth = true
	}

	if (auth == false) {
		res.redirect('http://' + req.headers.host)
		res.end()
	}

	// Access Granted
	models.Episode.find({ creator: req.user.id, approved: 0 }, function(err, result) {
		if (err) res.send(500, 'An unkown error occured.')
		res.render('screencasters/screencasters-episodes-waiting-list', result)
	})
}

module.exports.getApproved = function(req, res) {
	var auth = false
	if (req.user && req.user.role <= 3) {
		auth = true
	}

	if (auth == false) {
		req.redirect('../')
		res.end()
	}
	models.Episode.find({ creator: req.user.id, approved: 1 }, function(err, result) {
		if (err) res.send(500, 'An unkown error occured.')
		res.render('screencasters/screencasters-episodes-approved-list', result)
	})
	// Access Granted
}

module.exports.getNew = function(req, res) {
	var auth = false
	if (req.user && req.user.role <= 3) {
		auth = true
	}

	if (auth == false) {
		req.redirect('http://' + req.headers.host)
		res.end()
	}

	res.render('screencasters/screencasters-new-episode')

}

module.exports.heyDanielYouShouldImplementThis = function(req, res) {

	res.render('screencasters/screencasters-new-episode')
}