module.exports.getApprovedEpisodes = function(req, res) {
	sequelize.query("SELECT * FROM Episodes WHERE `UserId` = " + req.user.id + " AND `approved` = 1").success(function(results) {
		res.send(results)
	})
}