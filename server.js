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
app.use(bodyParser.json());

/* Routes */
//require('./api/routes/EXAMPLE')(app);
require('./api/routes/annotators')(app);
require('./api/routes/items')(app);
require('./api/routes/reviewing')(app);

app.get('/api/hello', function (req, res) {
	res.send({
		message: 'Hello from the API'
	});
});

/* Models */
//require('./api/models/EXAMPLE');
require('./api/models/Annotator');
require('./api/models/Item');


// React config for production
if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'client/build')));
	// Handle React routing, return all requests to React app
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});
}


app.listen(port);
console.log('Node gavel started at http://localhost:' + port);
