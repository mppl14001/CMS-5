function roleToString(role){
	switch (role) {
		case 1:	return 'Admin'
		case 2:	return 'Screencaster'
		case 3:	return 'Moderator'
		default: return 'Viewer'
	}	
}

module.exports.roleToString = roleToString