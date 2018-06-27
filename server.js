var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bluebird = require('bluebird'),
	port = process.env.PORT || 3000;

/* Set mongoose to use Bluebird promises */
global.Promise = bluebird;
mongoose.Promise = bluebird;

app.listen(port);

/* Routes */
require('./api/routes/EXAMPLE')(app);

/* Models */
require('./api/models/EXAMPLE');

console.log('Node gavel started at http://localhost:' + port);