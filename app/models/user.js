module.exports = function(sequelize, DataTypes) {

	return sequelize.define('Shownotes', {

		first_name: {
			type: DataTypes.STRING
		},
		last_name: {
			type: DataTypes.STRING
		},
		role: {
			// 1: Admin
			// 2: Screencaster
			// 3: Moderator
			// 4: Viewer
			
			type: DataTypes.INTEGER
		},
		twitter_username: {
			type: DataTypes.STRING
		},
		twitter_access_token: {
			type: DataTypes.STRING	
		},
		twitter_access_secret: {
			type: DataTypes.STRING
		}

	})

};