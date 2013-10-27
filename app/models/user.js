module.exports = function(sequelize, DataTypes) {

	return sequelize.define('User', {

		name: {
			allowNull: false,
			type: DataTypes.STRING
		},
		role: {
			// 1: Admin
			// 2: Screencaster
			// 3: Moderator
			// 4: Viewer
			
			allowNull: false,
			type: DataTypes.INTEGER
		},
		twitter_username: {
			allowNull: false,
			type: DataTypes.STRING
		},
		twitter_access_token: {
			allowNull: false,
			type: DataTypes.STRING	
		},
		twitter_access_secret: {
			allowNull: false,
			type: DataTypes.STRING
		}

	})

};