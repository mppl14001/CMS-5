module.exports = function(sequelize, DataTypes) {

	return sequelize.define('Shownotes', {

		first_name: {
			allowNull: false,
			type: DataTypes.STRING
		},
		last_name: {
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

	},
	{
		instanceMethods: {
			getName: function() {
				return [this.first_name, this.last_name].join(' ')
			}
		}
	})

};