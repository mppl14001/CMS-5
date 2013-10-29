module.exports = function(sequelize, DataTypes) {

	return sequelize.define('User', {

		name: {
			allowNull: false,
			type: DataTypes.STRING
		},
		role: {
			// documented in userRoleToString (server.js)
			allowNull: false,
			type: DataTypes.INTEGER,
			validate: {
				min: 1,
				max: 4
			}
		},
		twitter_id: {
			allowNull: false,
			type: DataTypes.STRING
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
		},
		active: {
			type: DataTypes.INTEGER,
			defaultValue: '1',
			allowNull:false
		}

	})

}