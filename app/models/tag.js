module.exports = function(sequelize, DataTypes) {

	return sequelize.define('Tag', {
		text: {
			type: DataTypes.STRING
		}
	})

}