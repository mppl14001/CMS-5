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
		},
		language: { // ISO 639-1
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'en',
			validate: {
				len: 2
			}
		}
	})
}