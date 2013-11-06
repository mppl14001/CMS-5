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
<<<<<<< HEAD
		models.User.findByIdAndUpdate(req.user.id, { language: req.body.language }, function(err, results) {
			if (err) res.send(500, 'An unknown error has occured.')
			res.send(results)
=======
		sequelize.query('UPDATE Users SET language = :language WHERE id = :id', null, { raw: true }, {
			language: req.body.language,
			id: req.user.id
		}).success(function() {
			res.send(JSON.stringify({
				status: 'ok',
				rowsModified: 1
			}))
		}).error(function() {
			res.send(JSON.stringify({
				status: 'error',
				rowsModified: null,
				error: 'sequelize'
			}))
>>>>>>> 6010babe16c8f29e80e99fa027a66b1879e03782
		})
	}
}
