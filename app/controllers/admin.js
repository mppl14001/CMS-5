var async = require('async')

module.exports.get = function(req, res) {
	res.locals.page = 'dashboard'

	async.parallel([
		function(callback) { // Total views
			callback(null, {title: 'Total views', data: '12,428'})
		},
		function(callback) { // Videos awaiting approval
			models.Episode.find({ approved: false }, function(err, videos) {
				callback(err, {title: grammerify('Video% awaiting approval', videos.length), data: videos.length})
			})
		},
		function(callback) {
			models.Transcription.find({ approved: false }, function(err, transcriptions){
				callback(err, {title: grammerify('Transcription% awaiting approval', transcriptions.length), data: transcriptions.length})
			})
		}
	],
	function(err, data) {
		res.render('admin/dashboard', {boxes: data})
	})
}

module.exports.getEpisodes = function(req, res) {
	res.locals.page = 'episodes'

	models.Episode.find({approved: true}, function(err, episodes){
		if(err){ res.send(404) }
		else res.render('admin/episodes', { videos: episodes })
	})
}

module.exports.getPendingEpisodes = function(req, res) {
	res.locals.page = 'episodes'

	models.Episode.find({approved: false}, function(err, episodes){
		if(err){ res.send(404) }
		else res.render('admin/episodes', { videos: episodes })
	})
}

/**
 * Requires:
 *   - id : ID of the episode
 */
module.exports.getEpisodeById = function(req, res) {
	res.locals.page = 'episodes'

	models.Episode.findOne({id: req.params.id}, function(err, episode){
		if(!episode){ res.send(404) }
		else {
			res.render('admin/episode', episode)
		}
	})
}

module.exports.getUsers = function(req, res) {
	res.locals.page = 'users'
	
	models.User.find({}, function(err, users) {
		if(err){ res.send(404) }
		else {
			res.render('admin/users', {users: users})
		}
	})
}

/**
 * Requires: 
 *   - id : ID of the user
 */
module.exports.getUserById = function(req, res) {
	res.locals.page = 'users'

	models.User.findOne({id: req.params.id}).success(function(users) {
		if(!users){ res.send(404) }
		else {
			res.render('admin/user', {user: users})
		}
	})
}

/**
 * Requires:
 *   - id : ID of the episode
 */
module.exports.approveScreencast = function(req, res) {
	if (req.xhr) {
		models.Episode.findOne({id: req.body.id}, function(episode){
			if(episode.approved){ res.send(304)	}
			else {
				episode.approved = true
				episode.save()
				res.send(200)
			}
		})
	}
	else { res.send(404) }
}

/**
 * Requires:
 *   - id : ID of the episode 
 */
module.exports.removeScreencast = function(req, res) {
	if (req.xhr) {
		models.Episode.findOne({id: req.body.id}, function(episode){
			if(!episode.approved){ res.send(304) }
			else {
				episode.approved = false
				episode.save()
				res.send(200)
			}
		})
	}
	else { res.send(404) }
}

/**
 * Requires:
 *   - id : ID of the episode
 *   - tag : Text of the tag
 */
module.exports.addTag = function(req, res) {
	if (req.xhr) {

		models.Episode.find({id: req.body.id}, function(episode){

			if(_.contains(episode.tags, req.body.tag)){
				res.send(304)
			}
			else {
				episode.tags.concat({ text: req.body.tag })
				episode.save()
				res.send(200)
			}

		})
	}
	else { res.send(400) }
}

/**
 * Requires:
 *   - id : ID of the episode
 *   - tag : Text of the tag
 */
module.exports.removeTag = function(req, res) {
	if (req.xhr) {

		models.Episode.find({id: req.body.id}, function(episode){

			if(!_.contains(episode.tags, req.body.tag)){
				res.send(304)
			}
			else {
				episode.tags[{ text: req.body.tag }] = undefined
				episode.save()
				res.send(200)
			}

		})
	}
	else { res.send(400) }
}

/**
 * Requires:
 *   - id : ID of the episode
 *   - language : Language of the transcription to be modified
 *   - text : Text of the transcription
 */
module.exports.editTranscription = function(req, res) {

	if (req.xhr) {
		models.Transcription.findByIdAndUpdate(req.body.id, { text: req.body.text, language: req.body.language }, function(err, result) {
			if (err) res.send(500, 'An unknown error occured.')
			res.send(result)
		})

	}

}

/**
 * Requires:
 *   - id : ID of the episode
 *   - language : Language of the new transcription
 *   - text : Text of the transcription
 *   - approved : Status of the transcription 
 */
module.exports.addTranscription = function(req, res) {

	if (req.xhr) {

		models.Episode.findById(req.body.id, function(err, episode) {
			if (_.contains(episode.transcriptions, req.body.language)) {
				res.send(304)
			}
			else {
				episode.transcriptions.push({approved: false, text: req.body.text, language: req.body.language })
				episode.save(function(err, episode) {
					if (!err) {
						res.send(200)
					} else {
						res.send(500)
					}
				})
			}
		})

	}
	else { res.send(400) }

}

/**
 * Requires:
 *   - id : ID of the episode
 *   - language : Language of the transcription
 */
module.exports.removeTranscription = function(req, res) {

	if (req.xhr) {
		models.Episode.findById(req.body.id, function(err, episode) {
			if (!_.contains(episode.transcriptions, req.body.language)) {
				res.send(304)
			}
			else {
				episode.transcriptions.find({language: req.body.language}, function(err, transcription) {
					if (!err) {
						transcription.approved = false
						transcription.save()
						res.send(200)
					}
					else {
						res.send(500)
					}
				})
			}
		})
	}
}

/**
 * Requires:
 *   - id : ID of the episode
 *   - language : Language of the transcription
 */
module.exports.activateTranscription = function(req, res) {

	if (req.xhr) {
		models.Transcription.findByIdAndUpdate(req.body.id, { approved: 1 }, function(err, results) {
			if(err) res.send(500, 'An unknown error occured.')
			res.send(results)
		})
	}
}

module.exports.deactivateTranscription = function(req, res) {

	if (req.xhr) {
		models.Transcription.findByIdAndUpdate(req.body.id, { approved: 0 }, function(err, results) {
			if(err) res.send(500, 'An unknown error occured.')
			res.send(results)
		})

	}
	else {
		res.send(404)
	}

}

/**
 * Requires:
 *   - name : name of the user
 *   - role : role of the user
 *   - twHandle : Twitter handle
 *   - twAccessToken: Twitter Access Token
 *   - twAccessSecret: Twitter Access Secret
 */
module.exports.addUser = function(req, res) {

	var user = new models.User({
		name: req.body.name,
		role: req.body.role,
		twitter_username: req.body.twHandle,
		twitter_access_token: req.body.twAccessToken,
		twitter_access_secret: req.body.twAccessSecret
	})

	user.save(function(err, user){

		if (err){
			res.send(200)
		}
		else {
			res.send(304)
		}

	})
}

/**
 * Requires:
 *   - id : ID of the user 
 */
module.exports.deactivateUser = function(req, res) {

	if (req.xhr) {
		var roles = {
			admin: 1,
			screencaster: 2,
			moderator: 3,
			viewer: 4
		}
		models.User.findByIdAndUpdate(req.body.id, { active: 0 }, function(err, result) {
			if (err) res.send(500, 'An unkown error occured')
			res.send(result)
		})

	}
	else {
		res.send(404)
	}
}

/**
 * Requires:
 *   - id : ID of the user
 */
module.exports.activateUser = function(req, res) {

	if (req.xhr) {
		var roles = {
			admin: 1,
			screencaster: 2,
			moderator: 3,
			viewer:4
		}
		models.User.findByIdAndUpdate(req.body.id, { active: 1 }, function(err, result) {
			if (err) res.send(500, 'An unkown error occured')
			res.send(result)
		})

	}
}

/**
 * Requires:
 *   - id : ID of the user
 *   - role : New role of the user (string)
 */
module.exports.changeRole = function(req, res) {

	if (req.xhr) {
		var roles = {
			admin: 1,
			screencaster: 2,
			moderator: 3,
			viewer:4
		}
		models.User.findByIdAndUpdate(req.body.id, { role: req.body.role }, function(err, result) {
			if (err) res.send(500, 'An unkown error occured')
			res.send(result)
		})
	}
}

function grammerify(string, count) {

	if (count == 1) {
		return string.replace('%', '')
	}
	else {
		return string.replace('%', 's')
	}

}