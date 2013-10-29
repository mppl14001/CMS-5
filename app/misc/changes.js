function trackChanges(table) {
	var historyTable = table + '_history'
	async.series([
		function(callback) {
			executeQuery('DROP TABLE IF EXISTS ' + historyTable, callback)
		}, function(callback) {
			executeQuery('CREATE TABLE ' + historyTable + ' LIKE ' + table, callback)
		}, function(callback) {
			executeQuery('ALTER TABLE ' + historyTable + ' MODIFY COLUMN id int(11) \
NOT NULL, DROP PRIMARY KEY, ENGINE = MyISAM, \
ADD action VARCHAR(8) DEFAULT \'insert\' FIRST, \
ADD revision INT(6) NOT NULL AUTO_INCREMENT AFTER action, \
ADD dt_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER revision, \
ADD PRIMARY KEY (id, revision)', callback)
		}, function(callback) {
			executeQuery('DROP TRIGGER IF EXISTS ' + table + '__ai', callback)
		}, function(callback) {
			executeQuery('DROP TRIGGER IF EXISTS ' + table + '__au', callback)
		}, function(callback) {
			executeQuery('DROP TRIGGER IF EXISTS ' + table + '__bd', callback)
		}, function(callback) {
			executeQuery('CREATE TRIGGER ' + table + '__ai AFTER INSERT ON ' + table + ' FOR EACH ROW \
INSERT INTO ' + historyTable + ' SELECT \'insert\', NULL, NOW(), d.* \
FROM ' + table + ' AS d WHERE d.id = NEW.id', callback)
		}, function(callback) {
			executeQuery('CREATE TRIGGER ' + table + '__au AFTER UPDATE ON ' + table + ' FOR EACH ROW \
INSERT INTO ' + historyTable + ' SELECT \'update\', NULL, NOW(), d.* \
FROM ' + table + ' AS d WHERE d.id = NEW.id', callback)
		}, function(callback) {
			executeQuery('CREATE TRIGGER ' + table + '__bd BEFORE DELETE ON ' + table + ' FOR EACH ROW \
INSERT INTO ' + historyTable + ' SELECT \'delete\', NULL, NOW(), d.* \
FROM ' + table + ' AS d WHERE d.id = OLD.id', callback)
		}
	], function(error, results) {
		if (error) {
			console.log('Error occurred while attempting to set up change tracking: ' + error)
		}
	})
}

function executeQuery(query, callback) {
	sequelize.query(query).success(function(result) {
		callback(null, result)
	}).failure(function(error) {
		callback(error, null)
	})
}

module.exports = trackChanges