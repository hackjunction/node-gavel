var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000;

app.listen(port);

/* Routes */
require('./api/routes/EXAMPLE')(app);

/* Models */
require('./api/models/EXAMPLE');

console.log('Node gavel started at http://localhost:' + port);