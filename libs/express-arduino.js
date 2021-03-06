var five	= require('johnny-five'),
	board 	= new five.Board(),
	server	= require('./server');

var ExpressArduino = {
	__rules: {
		servo: {
			attrs: ['id', 'pin', 'type', 'range', 'fps', 'invert', 'startAt', 'center', 'speed'],
			defaults: {
				id: 'defaultId',
				pin: 10,
				type: 'standard',
				range: [0,180],
				fps: 100,
				invert: false,
				startAt: 0,
				center: 0,
				speed: 5.0 //volts
			}
		}
	},
	__variables: {
		__servos: [],
		__pinsUsed: []
	},
	__addUsedPin: function(pin) {
		this.__variables.__pinsUsed.push(pin);
	},
	ready: function(fn) {

		var that = this;
	
		board.on('error', console.error);

		board.on('ready', function(){

			console.info('\r===================================================== \r');
			console.info('\r Arduino Ready \r');
			console.info('\r----------------------------------------------------- \r');

			server.run({port:3000}, function(serverInstance){
				fn(serverInstance, that);
			});

		});
	},
	getUsedPines: function() {
		return this.__variables.__pinsUsed;
	},
	getServos: function() {
		return this.__variables.__servos;
	},
	getServoById: function(sid) {
		return this.__variables.__servos[sid];
	},
	getServosNames: function() {
		return Object.keys(this.__variables.__servos);
	},
	addServo: function(name, options) {

		var that = this;

		// check if servo name is defined
		if (typeof name !== 'string' || name === "")
			throw {name: 'ParamsException', msg:'Servo name is require'}

		if (typeof options === 'undefined') {
			options = {};
		}

		// check if options (exists) is an object
		if (typeof options !== 'object') {
			throw {name: 'ParamsException', msg:'options must be an object'}
		}

		// check if pin is already used
		var servoPin = (options.hasOwnProperty('pin'))
				? options.pin 
				: this.__rules.servo.defaults.pin;

		var pinsUsed = this.__variables.__pinsUsed;

		for (var i = pinsUsed.length - 1; i >= 0; i--) 
		{
			if ( pinsUsed[i] === servoPin )
				throw {name:"ArduinoException", msg:"Already use pin " + servoPin}
		};

		// parse servo options
		var optionsServo = {};

		if ( typeof options === 'object' ) {

			this.__rules.servo.attrs.map(function(rule){
				if (options.hasOwnProperty(rule)) {
					return optionsServo[rule] = options[rule];
				} else {
					optionsServo[rule] = that.__rules.servo.defaults[rule];
				}
			});
		}

		// set name as id
		optionsServo.id = name;

		// set speed 3.3V or 5.0V
		optionsServo['specs'] = {speed: five.Servo.Continuous.speeds["@" + optionsServo.speed + 'V']};

		// instantiate new servo with config
		var servo = new five.Servo(optionsServo);

		// push servo in servos array
		this.__variables.__servos[name] = servo;

		// push pin configurated for this servo
		this.__addUsedPin(optionsServo.pin);

		return servo;
	},
	removeServoById: function(id) {
		delete this.__variables.__servos[id];
	}
};

module.exports = ExpressArduino;