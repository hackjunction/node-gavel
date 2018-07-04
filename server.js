var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	bluebird = require('bluebird'),
	port = process.env.PORT || 3000;

/* Set mongoose to use Bluebird promises */
global.Promise = bluebird;
mongoose.Promise = bluebird;

app.use(bodyParser.json());
app.listen(port);

/* Routes */
require('./api/routes/EXAMPLE')(app);
require('./api/routes/annotators')(app);

/* Models */
require('./api/models/EXAMPLE');
require('./api/models/Annotator');

console.log('Node gavel started at http://localhost:' + port);