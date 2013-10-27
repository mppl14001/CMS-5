var path = require('path')
var fs = require('fs')
var nconf = require('nconf')
var mysql = require('mysql')
var config = nconf.file({ file: path.join(__dirname, 'app', 'config.json') })

if(!config.get('db')){
	console.log('Please set up your config.json file.')
}
else {
	var dbConfig = config.get('db')
	var connection = mysql.createConnection({
		host: 'localhost',
		user: dbConfig.user,
		password: dbConfig.password,
		database: dbConfig.name
	})

	fs.readFile('./schema.sql', 'utf8', function (err, data) {
		if(err) return console.log(err)
		else {
			connection.query(data, function(err, rows, fields) {
			  if (err) throw err;

			  console.log('a');
			});
		}

	})
}