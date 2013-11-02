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