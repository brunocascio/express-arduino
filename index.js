// Dependences
var eArduino  = require("./libs/express-arduino");


/*
*	----------------------------------
*		Initialize arduino and server
*	----------------------------------
*/
eArduino.ready(function(express, arduino){
	
	try {
		var servoFeed = arduino.addServo('servoFeed');
		var servoHydrate = arduino.addServo('servoHydrate',{pin: 15});
	} catch(err) {
		console.error(err.name + ': ' +err.msg);
		process.exit(1);
	}

	var dispenser = {
		feed: function(fn) {
			servoFeed.step(180);
			setTimeout(function(){
				servoFeed.step(-180)
				fn();
			}, 1000)
		}
	}

	// Routes
	express.get('/feed', function(req,res){
		dispenser.feed(function(){
			res.json('Feeded!')
		});
	});
})
