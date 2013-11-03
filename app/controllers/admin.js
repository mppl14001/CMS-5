function grammerify(string, count){

	if(count == 1){
		return string.replace('%', '')
	}
	else {
		return string.replace('%', 's')
	}

}

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
		res.render('admin/admin', {boxes: data})
	})
		
}

module.exports.getEpisodes = function(req, res) {
	res.locals.page = 'episodes'

	var viewData = {
		videos: []
	}

	async.series([
		function (callback) {
			models.Episode.find({ approved: 1 }, function(err, episodes) {
				if (episodes.length > 0) {
					var l = 0
					async.eachSeries(episodes, function (item, callback2) {
						viewData.videos.push(episodes[l].dataValues)
						sequelize.query('SELECT * FROM Shownotes INNER JOIN Episodes ON Episodes.id = Shownotes.EpisodeId WHERE Episodes.id = :eID ORDER BY approved DESC', null, {raw: true}, {eID: viewData.videos[l].id})
						.success(function(q2) {
							if (q2.length > 0) {
								for (var o = 0;o < q2.length;o++) {
									q2[o].content = q2[o].content.toString()
									q2[o].shortened = q2[o].content.replace(/(([^\s]+\s\s*){30})(.*)/,'$1…')
								}
								viewData.videos[l].shownotes = q2
								l++
								callback2(null, 'ShownotesAreABitch')
							} else {
								callback2(null, 'ShownotesAreABitchButDontExist')
							}
						})
					}, function (err, results) {
						callback(null, 'Episodes')
					})
				} else {
					res.render('admin/admin-episodes')
				}
			})
		}
	], function(err, results) {
		console.log(viewData)
		res.render('admin/admin-episodes', viewData)
	})
}

module.exports.getPendingEpisodes = function(req, res) {
	res.locals.page = 'episodes'

	var viewData = {
		videos: []
	}

	async.series([
		function (callback) {
			models.Episode.findAll({ where: { approved: 0} }).success(function(query) {
				if (query.length > 0) {
					var l = 0
					async.eachSeries(query, function (item, callback2) {
						viewData.videos.push(query[l].dataValues)
						sequelize.query('SELECT * FROM Shownotes INNER JOIN Episodes ON Episodes.id = Shownotes.EpisodeId WHERE Episodes.id = :eID ORDER BY approved DESC', null, {raw: true}, {eID: viewData.videos[l].id})
						.success(function(q2) {
							if (q2.length > 0) {
								for (var o = 0;o < q2.length;o++) {
									q2[o].content = q2[o].content.toString()
									q2[o].shortened = q2[o].content.replace(/(([^\s]+\s\s*){30})(.*)/,'$1…')
								}
								viewData.videos[l].shownotes = q2
								l++
								callback2(null, 'ShownotesAreABitch')
							} else {
								callback2(null, 'ShownotesAreABitchButDontExist')
							}
						})
					}, function (err, results) {
						callback(null, 'Episodes')
					})
				} else {
					res.render('admin/admin-episodes')
				}
			})
		}
	], function(err, results) {
		console.log(viewData)
		res.render('admin/admin-episodes', viewData)
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
		shownotes: [],
		tags: [],
		status: {
			approval: 'unapproved'
		},
		transcriptions: []
	}
	async.series([
		function(callback) { // Load episode
			sequelize.query('SELECT title, ytURL, approved, UserId, id FROM Episodes WHERE id = :id', null, {raw: true}, {id: req.params.id}).success(function(returned) {
				data.title = returned[0].title
				data.video = returned[0].ytURL
				data.status.approval = returned[0].approved
				data.id = returned[0].id
				data.UserId = returned[0].UserId
				callback(null, 'data')
			})
		},
		function(callback) { // Load core data
			sequelize.query('SELECT name FROM Users WHERE id = :id', null, {raw: true}, {id: data.UserId}).success(function(user) {
				if (user[0].name) {
					data.author = user[0].name
				} else {
					data.author = 'Unknown'
				}
				callback(null, 'author')
			})
		},
		function(callback) { // Load shownotes
			sequelize.query('SELECT content, language FROM Shownotes WHERE EpisodeId = :id', null, {raw: true}, {id: data.id}).success(function(shownotes) {
				if (shownotes.lenght > 0) {
					data.shownotes = shownotes
				}
				callback(null, 'shownotes')
			})
		},
		function(callback) { // Load tags
			sequelize.query('SELECT tagId FROM EpisodesTags WHERE EpisodeId = :id', null, {raw: true}, {id: data.id}).success(function(tags) {
				if (tags.length > 0) {
					tags.forEach(function(item) {
						sequelize.query('SELECT id, text FROM Tags WHERE id = :tagId LIMIT 1', null, {raw: true}, {tagId: item.tagId}).success(function(tag) {
							tag.forEach(function(rawTag) {
								var tags = {}
								tags.id   = rawTag.id
								tags.text = rawTag.text
								data.tags.push(tags)
							})
							callback(null, 'tags')
						})
					})
				} else {
					callback(null, 'tags')
				}
			})
		},
		function(callback) { // Load transcriptions
			sequelize.query('SELECT * FROM Transcriptions WHERE EpisodeId = :id', null, {raw: true}, {id: data.id}).success(function(trans) {
				_.each(trans, function(item) {
					var elem = item
					var language = languages.getLanguageInfo(elem.language)
					if (language.name) {
						elem.language = language.name
					} else {
						elem.language = 'Unsupported language'
					}
					if (elem.approved == 1) {
						elem.isActive = true
						elem.showApproval = false
					} else {
						elem.isActive = false
						elem.showApproval = true
					}
					data.transcriptions.push(elem)
				})	
				callback(null, 'transcriptions')
			})
		}
	], function(err, results) {
		res.render('admin/admin-episodes-specific', data)
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
		var tag, episode
		async.parallel([
			function(callback) {
				Episode.find({where: {id: req.body.id}, limit: 1}).success(function(retrievedEpisode) {
					episode = retrievedEpisode
					callback(null, retrievedEpisode)
				}).failure(function(error) {
					callback(error, null)
				})
			}, function(callback) {
				Tag.findOrCreate({text: req.body.tag}, {}).success(function(retrievedTag) {
					tag = retrievedTag
					callback(null, retrievedTag)
				}).failure(function(error) {
					callback(error, null)
				})
			}
		], function(error, results) {
			if (error) {
				var json = {
					status: 'error',
					tagAdded: null,
					error: error
				}
				res.send(JSON.stringify(json))
				return
			}
			episode.addTag(tag).success(function() {
				var json = {
					status: 'ok',
					tagAdded: req.body.tag
				}
				res.send(JSON.stringify(json))
			}).failure(function(error) {
				var json = {
					status: 'error',
					tagAdded: null,
					error: error
				}
				res.send(JSON.stringify(json))
			})
		})
	}
}

module.exports.removeTag = function(req, res) {
	if (req.xhr) {
		sequelize.query('DELETE FROM EpisodesTags WHERE TagId = :id LIMIT 1', null, {raw: true}, {id: req.body.tag}).success(function() {
			var json = {
				status: 'ok',
				rowsModified: 1
			}
			res.write(JSON.stringify(json))
			res.end()
		}).error(function(error) {
			var json = {
				status: 'error',
				rowsModified: null,
				error: error
			}
			res.write(JSON.stringify(json))
			res.end()
		})
	}
}

module.exports.editTranscription = function(req, res) {
	if (req.xhr) {
		sequelize.query('UPDATE Transcriptions SET text = :text AND language = :language WHERE id = :id', null, {raw: true}, {text: req.body.text, language: req.body.language, id: req.body.id}).success(function(data) {
			var json = {
				status: 'ok',
				rowsModified: 1
			}
			res.write(JSON.stringify(json))
			res.end()
		}).error(function(error) {
			var json = {
				status: 'error',
				rowsModified: 0
			}
			res.write(JSON.stringify(json))
			res.end()
		})
	}
}

module.exports.addTranscription = function(req, res) {
	if (req.xhr) {
		sequelize.query('INSERT INTO Transcriptions (approved, text, language, EpisodeId) VALUES (0, :content, :language, :episode)', null, {raw: true}, {
		  content: req.body.content,
		  language: req.body.language,
		  episode: req.body.episodeId
		}).success(function(success) {
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
		//sequelize.query('')
	}
}

module.exports.activateTranscription = function(req, res) {
	if (req.xhr) {
		sequelize.query('UPDATE Transcriptions SET approved = 1 WHERE id = :id AND EpisodeId = :eId', null, {raw: true}, {id: req.body.id, eId: req.body.eId}).success(function(query) {
			var json = {
				status: 'ok',
				rowsModified: 1
			}
			res.write(JSON.stringify(json))
			res.end()
		}).error(function(error) {
			var json = {
				status: 'error',
				rowsModified: null,
				error: 'sequelize'
			}
			res.write(JSON.stringify(json))
			res.end()
		})
	}
}

module.exports.deactivateTranscription = function(req, res) {
	if (req.xhr) {
		sequelize.query('UPDATE Transcriptions SET approved = 0 WHERE id = :id AND EpisodeId = :eId', null, {raw: true}, {id: req.body.id, eId: req.body.eId}).success(function(query) {
			var json = {
				status: 'ok',
				rowsModified: 1
			}
			res.write(JSON.stringify(json))
			res.end()
		}).error(function(error) {
			var json = {
				status: 'error',
				rowsModified: null,
				error: 'sequelize'
			}
			res.write(JSON.stringify(json))
			res.end()
		})
	}
}

module.exports.addUser = function(req, res) {
	if (req.xhr) {

		User.create({
		  name: res.body.name,
		  role: res.body.role,
		  twitter_username: res.body.twHandle,
		  twitter_access_token: res.body.twAccessToken,
		  twitter_access_secret: res.body.twAccessSecret
		}).success(function(user) {
			var json = {
				status: 'ok',
				rowsModified: 1
			}
			res.write(JSON.stringify(json))
			res.end()
		}).error(function(error) {
			var errorJson = {
				status: 'error',
				rowsModified: null,
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
			admin: 1,
			screencaster: 2,
      moderator: 3,
			viewer: 4
		}
		sequelize.query('UPDATE Users SET active = 0 WHERE id = :id AND role = :role', null, {raw: true}, {
		  id: req.body.id,
		  role: roles[req.body.role]
		}).success(function(deleted) {
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
			admin: 1,
			screencaster: 2,
			moderator: 3,
			viewer:4
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
			admin: 1,
			screencaster: 2,
			moderator: 3,
			viewer:4
		}
		sequelize.query('Update Users SET role = :role WHERE id = :id', null, {raw: true}, {
		  role: roles[req.body.role],
		  id: req.body.id
		}).success(function(data) {
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
