module.exports = function(sequelize, DataTypes) {

	return sequelize.define('Shownotes', {

		// Todo: Add author relationship

		content: {
			type: DataTypes.BLOB
		},
		language: { // ISO 639-1
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'en'
		}

	})

};