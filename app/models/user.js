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
			type: DataTypes.INTEGER,
			validate: {
				isIn: [1, 2, 3, 4]
			}
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