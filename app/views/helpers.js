module.exports = {
	activeHelper: function(that, page){
		if(that.page == page){
			return 'active'
		}
	},
	userRoleToString: function(role) {
		switch (role) {
			case 1:	return 'Admin'
			case 2:	return 'Screencaster'
			case 3:	return 'Moderator'
			// 4 should be viewer, so just let it hit default.
			default: return 'Viewer'
		}
	},
	languageName: function(languageCode) {
		return languages.getLanguageInfo(languageCode).name
	},
	languageNativeName: function(languageCode) {
		return languages.getLanguageInfo(languageCode).nativeName
	},
	ifViewEpisodes: function(user, block) {
		if (user) {
			var permissions = permissions.levelToPermissions(user.permissions)
			if (permissions.view_episodes === 1) {
				return block.fn(this)
			} else {
				return block.inverse(fn)
			}
		}
	},
	submitVideos: function(user, block) {
		if (user) {
			var permissions = permissions.levelToPermissions(user.permissions)
			if (permissions.submit_videos === 1) {
	    		return block.fn(this)
	  		} else {
	    		return block.inverse(this)
	  		}
		}
	},
	submitShownoteTranslations: function(user, block) {
		if (user) {
			var permissions = permissions.levelToPermissions(user.permissions)
			if (permissions.submit_shownote_translations === 1) {
	    		return block.fn(this)
	  		} else {
	    		return block.inverse(this)
	  		}
		}
	},
	editShownoteTranslations: function(user, block) {
		if (user) {
			var permissions = permissions.levelToPermissions(user.permissions)
			if (permissions.submit_shownote_translations === 1) {
	    		block.fn(this)
	  		} else {
	    		block.inverse(this)
	  		}
		}
	},
	approveShownoteTranslations: function(user, block) {
		if (user) {
			var permissions = permissions.levelToPermissions(user.permissions)
			if (permissions.approve_shownote_translations === 1) {
	    		block.fn(this)
	  		} else {
	    		block.inverse(this)
	  		}
		}
	},
	approveEpisodes: function(user, block) {
		if (user) {
			var permissions = permissions.levelToPermissions(user.permissions)
			if (permissions.approve_episodes === 1) {
	    		block.fn(this)
	  		} else {
	    		block.inverse(this)
	  		}
		}
	},
	promoteUsers: function(user, block) {
		if (user) {
			var permissions = permissions.levelToPermissions(user.permissions)
			if (permissions.promote_users === 1) {
	    		block.fn(this)
	  		} else {
	    		block.inverse(this)
	  		}
		}
	},
	promoteUsersToAdmin: function(user, block) {
		if (user) {
			var permissions = permissions.levelToPermissions(user.permissions)
			if (permissions.promoteUsersToAdmin === 1) {
	    		block.fn(this)
	  		} else {
	    		block.inverse(this)
	  		}
		}
	},
	ifUserLanguage: function(user, code, block) {
		return block[code == user.language ? 'fn' : 'inverse'](this)
	},
	ifUserIsAdmin: function(user, block) {
		if (user && user.role == 1 /* admin */) return block.fn(this)
		return block.inverse(this)
	},
	ifUserIsScreencaster: function(user, block) {
		if (user && user.role == 2 /* screencaster */) return block.fn(this)
		return block.inverse(this)
	},
	ifUserIsModerator: function(user, block) {
		if (user && user.role == 3 /* moderator */) return block.fn(this)
		return block.inverse(this)
	},
	ifUserIsViewer: function(user, block) {
		if (user && user.role == 4 /* viewer */) return block.fn(this)
		return block.inverse(this)
	}
}