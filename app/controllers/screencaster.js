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
	sequelize.query('SELECT * FROM Episodes WHERE approved = 0 & userId = ?', req.user.id).success(function(query) {
		if (query.length > 0) {
			var data = {
				videos: []
			}
			data['videos'] = query
			for (var i=0;i<data['videos'].length;i++) {
				var element = data['videos'][i]
				var eId = element.id
				sequelize.query('SELECT * FROM Shownotes WHERE EpisodeId = ? LIMIT 1', null, {raw: true}, [eId]).success(function(shownotes) {
					if (shownotes.length > 0) {
						shownotes[0].content = shownotes[0].content.toString()
						shownotes[0].shortened = shownotes[0].content.replace(/(([^\s]+\s\s*){30})(.*)/,"$1…")
						element.shownotes = shownotes
					} else {
						element.shownotes = null
					}
					res.render("screencasters/screencasters-episodes-waiting-list", data)
				})
			}
		} else {
			res.render("screencasters/screencasters-episodes-waiting-list")
		}
	}).failure(function(query) {
		res.render("screencasters/screencasters-episodes-waiting-list")
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

	// Access Granted
	sequelize.query('SELECT * FROM Episodes WHERE approved = 1 & userId = ?', req.user.id).success(function(query) {
		if (query.length > 0) {
			var data = {
				videos: []
			}
			data['videos'] = query
			for (var i=0;i<data['videos'].length;i++) {
				var element = data['videos'][i]
				var eId = element.id
				sequelize.query('SELECT * FROM Shownotes WHERE EpisodeId = ? LIMIT 1', null, {raw: true}, [eId]).success(function(shownotes) {
					if (shownotes.length > 0) {
						shownotes[0].content = shownotes[0].content.toString()
						shownotes[0].shortened = shownotes[0].content.replace(/(([^\s]+\s\s*){30})(.*)/,"$1…")
						element.shownotes = shownotes
					} else {
						element.shownotes = null
					}
					console.log(element)
					res.render("screencasters/screencasters-episodes-approved-list", data)
				})
			}
		} else {
			res.render("screencasters/screencasters-episodes-approved-list")
		}
	}).failure(function(query) {
		res.render("screencasters/screencasters-episodes-approved-list")
	})
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

	res.render("screencasters/screencasters-new-episode");

}
