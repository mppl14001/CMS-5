function userRoleToString(role){
	switch (role) {
		case 1:	return 'Admin'
		case 2:	return 'Screencaster'
		case 3:	return 'Moderator'
		// 4 should be viewer, so just let it hit default.
		default: return 'Viewer'
	}	
}

module.exports.userRoleToString = userRoleToString