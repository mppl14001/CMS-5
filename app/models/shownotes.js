module.exports = function(sequelize, DataTypes) {

	return sequelize.define('Shownotes', {

		content: {
			allowNull: false,
			type: DataTypes.BLOB
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