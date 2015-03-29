var server = require('express')();

var Server = {

	run: function(options, fn) {

		// Add headers
		server.use(function (req, res, next) {

		    // Website you wish to allow to connect
		    res.setHeader('Access-Control-Allow-Origin', '*');

		    // Request methods you wish to allow
		    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

		    // Request headers you wish to allow
		    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

		    // Set to true if you need the website to include cookies in the requests sent
		    // to the API (e.g. in case you use sessions)
		    res.setHeader('Access-Control-Allow-Credentials', true);

		    // Pass to next layer of middleware
		    next();
		});

		// ================== Dafault Routes

		server.get('/', function ( req, res){
			res.json('index');
		});

		server.get('/check', function ( req, res){
			res.json('Running');
		});

		// ================== Run Server

		var serverRunning = server.listen((options.port || 3000), function () {

		  var host = serverRunning.address().address
		  var port = serverRunning.address().port

		  console.info('\r HTTP Running on: http://%s:%s', host, port)
		  console.info('\r===================================================== \r');

		  fn(server);

		});
	}
}

module.exports = Server;