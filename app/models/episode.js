module.exports = function(sequelize, DataTypes) {

	return sequelize.define('Episode', {

		title: {
			type: DataTypes.STRING
		},
		ytURL: {
			type: DataTypes.STRING,
			isURL: true,
			is: ["^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))(?:\S+)?$"]
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

}