function levelToPermissions(level) {
	level = Number(level).toString(2).split("").reverse()
	
	permissions = {}
	
	if (level[0] == 1) {
		permissions['view_episodes'] = 1
	} else {
		permissions['view_episodes'] = 0
	}
	
	if (level[1] == 1) {
		permissions['submit_videos'] = 1
	} else {
		permissions['submit_videos'] = 0
	}
	
	if (level[2] == 1) {
		permissions['submit_shownote_translations'] = 1
	} else {
		permissions['submit_shownote_translations'] = 0
	}
	
	if (level[3] == 1) {
		permissions['edit_shownote_translations'] = 1
	} else {
		permissions['edit_shownote_translations'] = 0
	}
	
	if (level[4] == 1) {
		permissions['approve_shownote_translations'] = 1
	} else {
		permissions['approve_shownote_translations'] = 0
	}
	
	if (level[5] == 1) {
		permissions['approve_episodes'] = 1
	} else {
		permissions['approve_episodes'] = 0
	}
	
	if (level[6] == 1) {
		permissions['promote_users'] = 1
	} else {
		permissions['promote_users'] = 0
	}

	if (level[7] == 1) {
		permissions['promote_users_to_admin'] = 1
	} else {
		permissions['promote_users_to_admin'] = 0
	}
	
	return permissions
}

function permissionsToLevel(permissions) {
	level = []
	
	level[0] = permissions['view_episodes']
	level[1] = permissions['submit_videos']
	level[2] = permissions['submit_shownote_translations']
	level[3] = permissions['edit_shownote_translations']
	level[4] = permissions['approve_shownote_translations']
	level[5] = permissions['approve_episodes']
	level[6] = permissions['promote_users']
	level[7] = permissions['promote_users_to_admin']

	level = parseInt(level.reverse().join(""),2)

	return level
}

module.exports.levelToPermissions = levelToPermissions
module.exports.permissionsToLevel = permissionsToLevel
module.exports.VIEWER_PERMISSIONS = permissionsToLevel({
	view_episodes: 1,
	submit_videos: 0,
	submit_shownote_translations: 0,
	edit_shownote_translations: 0,
	approve_shownotes_translations: 0,
	approve_episodes: 0,
	promote_users: 0,
	promote_users_to_admin: 0
})
module.exports.MODERATOR_PERMISSIONS = permissionsToLevel({
	view_episodes: 1,
	submit_videos: 0,
	submit_shownote_translations: 1,
	edit_shownote_translations: 1,
	approve_shownotes_translations: 1,
	approve_episodes: 1,
	promote_users: 0,
	promote_users_to_admin: 0
})
module.exports.SCREENCASTER_PERMISSIONS = permissionsToLevel({
	view_episodes: 1,
	submit_videos: 1,
	submit_shownote_translations: 1,
	edit_shownote_translations: 1,
	approve_shownotes_translations: 0,
	approve_episodes: 0,
	promote_users: 0,
	promote_users_to_admin: 0
})
module.exports.TRANSLATOR_PERMISSIONS = permissionsToLevel({
	view_episodes: 1,
	submit_videos: 0,
	submit_shownote_translations: 1,
	edit_shownote_translations: 1,
	approve_shownotes_translations: 1,
	approve_episodes: 0,
	promote_users: 0,
	promote_users_to_admin: 0
})
module.exports.ADMIN_PERMISSIONS = permissionsToLevel({
	view_episodes: 1,
	submit_videos: 1,
	submit_shownote_translations: 1,
	edit_shownote_translations: 1,
	approve_shownotes_translations: 1,
	approve_episodes: 1,
	promote_users: 0,
	promote_users_to_admin: 0
})
module.exports.WILL_PERMISSIONS = permissionsToLevel({
	view_episodes: 1,
	submit_videos: 1,
	submit_shownote_translations: 0,
	edit_shownote_translations: 0,
	approve_shownotes_translations: 0,
	approve_episodes: 0,
	promote_users: 0,
	promote_users_to_admin: 0
})