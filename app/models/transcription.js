module.exports = function(sequelize, DataTypes) {

	return sequelize.define('Transcriptions', {
		approved: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	})
}