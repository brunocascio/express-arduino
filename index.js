// Dependences
var eArduino  = require("./libs/express-arduino");


/*
*	----------------------------------
*		Initialize arduino and server
*	----------------------------------
*/
eArduino.ready(function(express, arduino){
	
	var servoFeed = arduino.addServo('servoFeed',{range:[0, 60], startAt:60});

	var dispenser = {
		feed: function(fn) {
			servoFeed.step(-60);
			setTimeout(function(){
				servoFeed.step(60)
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
