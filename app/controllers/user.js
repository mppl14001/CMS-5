module.exports.postApprovedEpisodes = function(req, res) {
	if(req.xhr) {
		sequelize.query("SELECT * FROM Episodes WHERE `UserId` = " + req.body.id + " AND `approved` = 1").success(function(results) {
			res.send(results)
		})
	}
}

module.exports.postPendingEpisodes = function(req, res) {
	if (req.xhr) {
		sequelize.query("SELECT * FROM Episodes WHERE `UserId` = " + req.body.id + " AND `approved` = 0").success(function(results) {
			res.send(results)
		})
	}
}