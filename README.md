# express-arduino
Express + Arduino

# How to install

Install dependences:
`npm install`

In your js file:

```
var eArduino  = require("./libs/express-arduino");


/*
*	----------------------------------
*		Initialize arduino and server
*	----------------------------------
*/
eArduino.ready(function(express, arduino){
	
	arduino.addServo('servoId',{pin:10});
	
	// Routes
	express.get('/hello/:name', function(req,res){
		res.json('Hello, ' + req.params.name +'!');
	});
})
```
