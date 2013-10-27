

module.exports.get = function(req, res) {
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
			sequelize.query('SELECT * FROM Episodes WHERE approved = 0').success(function(query) {
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
	sequelize.query('SELECT * FROM Episodes WHERE approved = 1').success(function(query) {
		if (query.length > 0) {
			var data = {
				videos: []
			};
			data['videos'] = query;
			for (var i=0;i<data['videos'].length;i++) {
				var element = data['videos'][i]
				var eId = element.id
				sequelize.query('SELECT * FROM Shownotes WHERE EpisodeId = ? LIMIT 1', null, {raw: true}, [eId]).success(function(shownotes) {
					shownotes[0].content = shownotes[0].content.toString()
					shownotes[0].shortened = shownotes[0].content.replace(/(([^\s]+\s\s*){30})(.*)/,"$1…")
					if (shownotes) {
						element.shownotes = shownotes
					} else {
						element.shownotes = null
					}
					console.log(element)
					res.render('admin-episodes', data)
				})
			}
		} else {
			res.render('admin/admin-episodes')
		}
	})
}

module.exports.getEpisodeById = function(req, res) {
	res.render('admin/admin-episodes-specific')
}

module.exports.getPendingEpisodes = function(req, res) {
	sequelize.query('SELECT * FROM Episodes WHERE approved = 0').success(function(query) {
		if (query.length > 0) {
			var data = {
				videos: []
			}
			data['videos'] = query;
			for (var i=0;i<data['videos'].length;i++) {
				var element = data['videos'][i]
				var eId = element.id
				sequelize.query('SELECT * FROM Shownotes WHERE EpisodeId = ? LIMIT 1', null, {raw: true}, [eId]).success(function(shownotes) {
					shownotes[0].content = shownotes[0].content.toString()
					shownotes[0].shortened = shownotes[0].content.replace(/(([^\s]+\s\s*){30})(.*)/,"$1…")
					if (shownotes) {
						element.shownotes = shownotes
					} else {
						element.shownotes = null
					}
					console.log(element)
					res.render('admin/admin-episodes-pending', data)
				})
			}
		} else {
			res.render('admin/admin-episodes-pending')
		}
	})
}

module.exports.getPendingEpisodeById = function(req, res) {
	res.render('admin/admin-episodes-specific')
}

module.exports.getUsers = function(req, res) {
	res.render('admin/admin-users')
}


module.exports.getUserById = function(req, res) {
	res.render('admin/admin')
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




