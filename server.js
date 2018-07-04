var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	bluebird = require('bluebird'),
	port = process.env.PORT || 3000;

/* Set mongoose  & global to use Bluebird promises */
global.Promise = bluebird;
mongoose.Promise = bluebird;
mongoose.connect('mongodb://localhost/nodeGavel');

app.use(bodyParser.urlencoded());
app.listen(port);

/* Routes */
//require('./api/routes/EXAMPLE')(app);
require('./api/routes/annotators')(app);

/* Models */
//require('./api/models/EXAMPLE');
require('./api/models/Annotator');
require('./api/models/Item');

console.log('Node gavel started at http://localhost:' + port);