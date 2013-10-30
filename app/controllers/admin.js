module.exports.get = function(req, res) {
	res.locals.page = 'dashboard'
	var data = {
			boxes: [
				{
					title: "Video views today",
					data: 0
				},
				{
					title: "Videos awaiting approval",
					data: 0
				},
				{
					title: "Transcriptions awaiting approval",
					data: 0
				},
				{
					title: "Some title here",
					data: "Data"
				},
				{
					title: "Some title here",
					data: "Data"
				},
				{
					title: "Some title here",
					data: "Data"
				}
			]
		}
		async.parallel([
			function(callback) { // Total views
				callback(null, '12,428')
			},
			function(callback) { // Videos awaiting approval
				Episode.findAll({ where: { approved: 0 } }).success(function(query) {
					var grammar = query.length === 1 ?
								  'Video awaiting approval' :
								  'Videos awaiting approval'
					callback(null, [grammar, query.length])
				})
			},
			function(callback) {
				callback(null, 15)
			}
		],
		function(err, callback) {
			for (var i in callback) {
				if (typeof(callback[i]) === 'object') { // Grammar easter egg
					data['boxes'][i].title = callback[i][0]
					data['boxes'][i].data = callback[i][1]
				} else {
					data['boxes'][i].data = callback[i]
					if (i == callback.length - 1) res.render('admin/admin', data)
				}
			}
		})
}


module.exports.getEpisodes = function(req, res) {
	res.locals.page = 'episodes'
	Episode.findAll({ where: { approved: 1 } }).success(function(query) {
		if (query.length > 0) {
			var data = {
				videos: []
			}
			data['videos'] = query
			for (var i=0;i<data['videos'].length;i++) {
				var element = data['videos'][i]
				var eId = element.id

				Shownotes.findAll({ where: { EpisodeId: eId }, limit: 1 }).success(function(shownotes) {
					if (shownotes.length > 0) {
						shownotes[0].content = shownotes[0].content.toString()
						shownotes[0].shortened = shownotes[0].content.replace(/(([^\s]+\s\s*){30})(.*)/,"$1…")
						element.shownotes = shownotes
					} else {
						element.shownotes = null
					}
					console.log(element)
					res.render('admin/admin-episodes', data)
				})
			}
		} else {
			res.render('admin/admin-episodes')
		}
	})
}

module.exports.getPendingEpisodes = function(req, res) {
	res.locals.page = 'episodes'
	Episode.findAll({ where: { approved: 0 } }).success(function(query) {
		if (query.length > 0) {
			var data = {
				videos: []
			}
			data['videos'] = query
			for (var i=0;i<data['videos'].length;i++) {
				var element = data['videos'][i]
				var eId = element.id

				Shownotes.findAll({ where: { EpisodeId: eId }, limit: 1 }).success(function(shownotes) {
					if (shownotes.length > 0) {
						shownotes[0].content = shownotes[0].content.toString()
						shownotes[0].shortened = shownotes[0].content.replace(/(([^\s]+\s\s*){30})(.*)/,"$1…")
						element.shownotes = shownotes
					} else {
						element.shownotes = null
					}
					console.log(element)
				})
			}
			res.render('admin/admin-episodes-pending', data)
		} else {
			res.render('admin/admin-episodes-pending')
		}
	})
}

module.exports.getEpisodeById = function(req, res) {
	res.locals.page = 'episodes'
	var data = {
		title: null,
		id: null,
		thumbnail: null,
		video: null,
		author: null,
		shownotes: null,
		shownotesLang: null,
		tags: [],
		status: {
			approval: "unapproved"
		},
		transcriptions: [
			{
				language: "English",
				content: "TEST CONTENT 1",
				status: "Active",
				isActive: true,
				showApproval: false
			},
			{
				language: "Spanish",
				content: "TEST CONTENT 2",
				status: "Active",
				isActive: true,
				showApproval: false
			},
			{
				language: "German",
				content: "TEST CONTENT 3",
				status: "Not active",
				isActive: false,
				showApproval: true
			}
		]
	}
	sequelize.query('SELECT title, ytURL, approved, UserId, id FROM Episodes WHERE id = :id', null, {raw: true}, {id: req.params.id}).success(function(returned) {
		data.title = returned[0].title
		data.video = returned[0].ytURL
		data.status.approval = returned[0].approved
		data.id = returned[0].id
		sequelize.query('SELECT name FROM Users WHERE id = :id', null, {raw: true}, {id: returned[0].UserId}).success(function(user) {
			if (user[0].name) {
				data.author = user[0].name
			} else {
				data.author = "Unknown"
			}
			sequelize.query('SELECT content, language FROM Shownotes WHERE EpisodeId = :id LIMIT 1', null, {raw: true}, {id: returned[0].id}).success(function(shownotes) {
				if (shownotes.length > 0) {
					data.shownotes = shownotes[0].content.toString()
					data.shownotesLang = shownotes[0].language
				} else {
					data.shownotes = null
					data.shownotesLang = null
				}
				sequelize.query('SELECT tagId FROM EpisodesTags WHERE EpisodeId = :id', null, {raw: true}, {id: returned[0].id}).success(function(tags) {
					tags.forEach(function(item) {
						sequelize.query('SELECT text FROM Tags WHERE id = :tagId LIMIT 1', null, {raw: true}, {tagId: item.tagId}).success(function(tag) {
							tag.forEach(function(rawTag) {
								data.tags.push(rawTag.text)
							})
						})
					})
					res.render('admin/admin-episodes-specific', data)
				})
			})
		})
	})
}

module.exports.getUsers = function(req, res) {
	res.locals.page = 'users'
	User.findAll().success(function(query) {
		res.render('admin/admin-users', {
			users: query
		})
	})
}

module.exports.getUserById = function(req, res) {
	res.locals.page = 'users'
	res.render('admin/admin')
}

module.exports.approveScreencast = function(req, res) {
	if (req.xhr) {
		sequelize.query('UPDATE Episodes SET approved = 1 WHERE id = :id', null, {raw: true}, {id: req.body.id}).success(function(approved) {
			var successJson = {
				status: 'ok',
				rowsModified: 1
			}
			res.write(JSON.stringify(successJson))
			res.end()
		}).error(function(error) {
			var errorJson = {
				status: 'error',
				rowsModified: null
			}
			res.write(errorJson)
			res.end()
		})
	}
}

module.exports.removeScreencast = function(req, res) {
	if (req.xhr) {
		sequelize.query('UPDATE Episodes SET approved = 0 WHERE id = :id', null, {raw: true}, {id: req.body.id}).success(function(approved) {
			var successJson = {
				status: 'ok',
				rowsModified: 1
			}
			res.write(JSON.stringify(successJson))
			res.end()
		}).error(function(error) {
			var errorJson = {
				status: 'error',
				rowsModified: null
			}
			res.write(errorJson)
			res.end()
		})
	}
}

module.exports.addTag = function(req, res) {
	if (req.xhr) {
		sequelize.query('INSERT INTO Tags (text, episodeId) VALUES (:text, :id)', null, {raw: true}, {text: req.body.tag, id: req.body.id}).success(function(data) {
			var json = {
				status: 'ok',
				tagAdded: req.body.tag
			}
			res.write(JSON.stringify(json))
			res.end()
		}).error(function() {
			var json = {
				status: 'error',
				tagAdded: null,
				error: ''
			}
			res.write(JSON.write(json))
			res.end()
		})
	}
}

module.exports.removeTag = function(req, res) {
	if (req.xhr) {

	}
}

module.exports.editTranscription = function(req, res) {
	if (req.xhr) {

	}
}

module.exports.addTranscription = function(req, res) {
	if (req.xhr) {
		sequelize.query('INSERT INTO Transcriptions (approved, text, language, EpisodeId) VALUES (0, :content, :language, :episode)', null, {raw: true}, {content: req.body.content, language: req.body.language, episode: req.body.episodeId}).success(function(success) {
			var sJSON = {
				status: 'ok',
				rowsModified: 1
			}
			res.write(JSON.stringify(sJSON))
			res.end()
		}).error(function(error) {
			var eJSON = {
				status: 'error',
				rowsModified: null,
				error: 'sequelize'
			}
			res.write(JSON.stringify(eJSON))
			res.end()
		})
	}
}

module.exports.removeTranscription = function(req, res) {
	if (req.xhr) {

	}
}

module.exports.addUser = function(req, res) {
	if (req.xhr) {

		User.create({ name: res.body.name, role: res.body.role, twitter_username: res.body.twHandle, twitter_access_token: res.body.twAccessToken, twitter_access_secret: res.body.twAccessSecret }).success(function(user) {
			var json = {
				status:'ok',
				rowsModified:1
			}
			res.write(JSON.stringify(json))
			res.end()
		}).error(function(error) {
			var errorJson = {
				status:'error',
				rowsModified:null,
				error: error
			}
			res.write(JSON.stringify(errorJson))
			res.end()
		})
	}
}

module.exports.deactivateUser = function(req, res) {
	if (req.xhr) {
		var roles = {
			"admin": 1,
			"screencaster": 2,
			"moderator": 3,
			"viewer":4
		}
		sequelize.query('UPDATE Users SET active = 0 WHERE id = :id AND role = :role', null, {raw: true}, {id: req.body.id, role: roles[req.body.role]}).success(function(deleted) {
			var successJson = {
				status: 'ok',
				rowsModified: 1,
				recordRemoved: req.body.twHandle
			}
			res.write(JSON.stringify(successJson))
			res.end()
		}).error(function(error) {
			var errorJson = {
				status: 'error',
				rowsModified: null,
				error: 'sequelize'
			}
			res.write(JSON.stringify(errorJson))
			res.end()
		})
	}
}

module.exports.activateUser = function(req, res) {
	if (req.xhr) {
		var roles = {
			"admin": 1,
			"screencaster": 2,
			"moderator": 3,
			"viewer":4
		}
		sequelize.query('UPDATE Users SET active = 1 WHERE id = :id AND role = :role', null, {raw: true}, {id: req.body.id, role: roles[req.body.role]}).success(function(deleted) {
			var successJson = {
				status: 'ok',
				rowsModified: 1,
				recordRemoved: req.body.twHandle
			}
			res.write(JSON.stringify(successJson))
			res.end()
		}).error(function(error) {
			var errorJson = {
				status: 'error',
				rowsModified: null,
				error: 'sequelize'
			}
			res.write(JSON.stringify(errorJson))
			res.end()
		})
	}
}

module.exports.changeRole = function(req, res) {
	if (req.xhr) {
		var roles = {
			"admin": 1,
			"screencaster": 2,
			"moderator": 3,
			"viewer":4
		}
		sequelize.query('Update Users SET role = :role WHERE id = :id', null, {raw: true}, {role: roles[req.body.role], id:req.body.id}).success(function(data) {
			var successJson = {
				status: 'ok',
				rowsModified: 1
			}
			res.write(JSON.stringify(successJson))
			res.end()
		}).error(function(error) {
			var errorJson = {
				status: 'error',
				rowsModified: null,
				error: 'sequelize'
			}
			res.write(JSON.stringify(errorJson))
			res.end()
		})
	}
}

function requireViewer(req, res, next) {
	if (req.user && req.user.role === 4) {
		next()
	} else {
		res.redirect('/')
	}
}

function requireModerator(req, res, next) {
	if (req.user && (req.user.role === 3 || req.user.role === 1)) {
		next()
	} else {
		res.redirect('/')
	}
}

function requireScreencaster(req, res, next) {
	if (req.user && (req.user.role === 2 || req.user.role === 1)) {
		next()
	} else {
		res.redirect('/')
	}
}

function requireAdmin(req, res, next) {
	if (req.user && req.user.role === 1) {
		next()
	} else {
		res.redirect('/')
	}
}
