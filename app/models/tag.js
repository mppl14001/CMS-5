module.exports = function(sequelize, DataTypes) {

	return sequelize.define('Tag', {

		text: {
			type: DataTypes.STRING
		},
		episodeId: {
			type: DataTypes.INTEGER,
			allowNull: true
		}

	})

}