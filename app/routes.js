module.exports = function(app, controllers) {
  app.get('/', function(req, res) {
    res.render('home', {
      user: req.user
    })
  })

  app.get('/auth/twitter', controllers.passport.authenticate('twitter'))

  app.get('/auth/twitter/callback', controllers.passport.authenticate('twitter', {failureRedirect: '/fail'}), function(req, res) {
    res.redirect('/')
  })

  app.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
  })

  /*
    Screencast submission
  */

  app.get('/fail', controllers.userController.authError)

  app.get('/screencaster', submitVideos, controllers.screencasterController.getPending)

  app.get('/heyDanielYouShouldImplementThis', submitVideos, controllers.screencasterController.heyDanielYouShouldImplementThis)

  app.get('/screencaster/approved', submitVideos, controllers.screencasterController.getApproved)

  app.get('/:id(\\d+)', viewEpisodes, controllers.episodeController.getEpisodeById)

  app.get('/settings', authenticated, controllers.userController.getSettings)

  app.post('/settings', authenticated, controllers.userController.postSettings)

  app.get('/transcription/:id', viewEpisodes, controllers.episodeController.getTranscription)

  app.post('/transcription/:id', viewEpisodes, controllers.episodeController.postTranscription)

  app.get('/transcript/:id', viewEpisodes, controllers.episodeController.getTranscript)

  /*
    Admin routing
  */

  app.get('/admin', /*requireAdmin, */controllers.adminController.get)

  app.get('/admin/episodes', /*requireAdmin, */controllers.adminController.getEpisodes)

  app.get('/admin/episodes/pending', /*requireAdmin, */controllers.adminController.getPendingEpisodes)

  app.get('/admin/episodes/pending/:id(\\d+)', /*requireAdmin, */controllers.adminController.getEpisodeById)

  app.get('/admin/episodes/:id(\\d+)', /*requireAdmin, */controllers.adminController.getEpisodeById)

  app.get('/admin/users', /*requireAdmin, */controllers.adminController.getUsers)

  app.get('/admin/users/:id(\\d+)', /*requireAdmin, */controllers.adminController.getUserById)

  // Admin APIs

  app.post('/api/admin/episode/approve', /*requireAdmin, */controllers.adminController.approveScreencast)

  app.post('/api/admin/episode/remove', /*requireAdmin, */controllers.adminController.removeScreencast)

  app.post('/api/admin/episode/tags/add', /*requireAdmin, */controllers.adminController.addTag)

  app.post('/api/admin/episode/tags/remove', /*requireAdmin, */controllers.adminController.removeTag)

  app.post('/api/admin/episode/transcript/edit', /*requireAdmin, */controllers.adminController.editTranscription)

  app.post('/api/admin/episode/transcript/add', /*requireAdmin, */controllers.adminController.addTranscription)

  app.post('/api/admin/episode/transcript/remove', /*requireAdmin, */controllers.adminController.removeTranscription)

  app.post('/api/admin/episode/transcript/activate', /*requireAdmin, */controllers.adminController.activateTranscription)

  app.post('/api/admin/episode/transcript/deactivate', /*requireAdmin, */controllers.adminController.deactivateTranscription)

  app.post('/api/admin/user/add', /*requireAdmin, */controllers.adminController.addUser)

  app.post('/api/admin/user/deactivate', /*requireAdmin, */controllers.adminController.deactivateUser)

  app.post('/api/admin/user/activate', /*requireAdmin, */controllers.adminController.activateUser)

  app.post('/api/admin/user/role', controllers.adminController.changeRole)

  // Screencaster APIs

  app.post('/api/approvedEpisodes', controllers.userController.postApprovedEpisodes)

  app.post('/api/pendingEpisodes', controllers.userController.postPendingEpisodes)

  // Search

  app.get('/search', controllers.searchController.getSearch)
}

function authenticated(req, res, next) {
	if (req.user) {
		next()
	} else {
		res.render('status/403')
	}
}

function viewEpisodes(req, res, next) {
	next()
}

function submitVideos(req, res, next) {
	if (req.user) {
		var permissions = permissions.levelToPermissions(req.user.permissions)
		if (permissions.submit_videos === 1) {
    		next()
  		} else {
    		res.render('status/403')
  		}
	}
}

function submitShownoteTranslations(req, res, next) {
	if (req.user) {
		var permissions = permissions.levelToPermissions(req.user.permissions)
		if (permissions.submit_shownote_translations === 1) {
    		next()
  		} else {
    		res.render('status/403')
  		}
	}
}

function editShownoteTranslations(req, res, next) {
	if (req.user) {
		var permissions = permissions.levelToPermissions(req.user.permissions)
		if (permissions.submit_shownote_translations === 1) {
    		next()
  		} else {
    		res.render('status/403')
  		}
	}
}

function approveShownoteTranslations(req, res, next) {
	if (req.user) {
		var permissions = permissions.levelToPermissions(req.user.permissions)
		if (permissions.approve_shownote_translations === 1) {
    		next()
  		} else {
    		res.render('status/403')
  		}
	}
}

function approveEpisodes(req, res, next) {
	if (req.user) {
		var permissions = permissions.levelToPermissions(req.user.permissions)
		if (permissions.approve_episodes === 1) {
    		next()
  		} else {
    		res.render('status/403')
  		}
	}
}

function promoteUsers(req, res, next) {
	if (req.user) {
		var permissions = permissions.levelToPermissions(req.user.permissions)
		if (permissions.promote_users === 1) {
    		next()
  		} else {
    		res.render('status/403')
  		}
	}
}

function promoteUsersToAdmin(req, res, next) {
	if (req.user) {
		var permissions = permissions.levelToPermissions(req.user.permissions)
		if (permissions.promoteUsersToAdmin === 1) {
    		next()
  		} else {
    		res.render('status/403')
  		}
	}
}