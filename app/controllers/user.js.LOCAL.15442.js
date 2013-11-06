var languages = require('languages')

module.exports.postApprovedEpisodes = function(req, res) {
	if(req.xhr) {
		models.Episode.find({ creator: req.body.id, approved: 1 }, function(err, results) {
			if (err) res.send(500, 'An unknown error occured.')
			res.send(results)
		})
	}
}

module.exports.postPendingEpisodes = function(req, res) {
	if (req.xhr) {
		models.Episode.find({ creator: req.body.id, approved: 0 }, function(err, results) {
			if (err) res.send(500, 'An unknown error occured.')
			res.send(results)
		})
	}
}

module.exports.getSettings = function(req, res) {
	if(req.user) {
		res.render('admin/settings', {
			user: req.user,
			languages: languages.getAllLanguageCode().map(function(languageCode) {
				return {
					 code: languageCode,
					 selected: languageCode == req.user.language
				}
			})
		})
	}
	else {
		res.redirect('/')
	}
}

module.exports.authError = function(req, res) {
	res.render('status/403')
}

module.exports.postSettings = function (req, res) {
	if (req.xhr) {	
		models.User.findByIdAndUpdate(req.user.id, { language: req.body.language }, function(err, results) {
			if (err) res.send(500, 'An unknown error has occured.')
			res.send(results)
		})
	}
}
