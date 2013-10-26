module.exports = function(sequelize, DataTypes) {

	return sequelize.define('Episode', {

		// Todo: Add author relationship
		// Todo: Add tags relationship

		title: {
			type: DataTypes.STRING
		},
		ytURL: {
			type: DataTypes.STRING
			// Todo: Add YouTube URL validation
		},
		published: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		approved: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}

	})

};