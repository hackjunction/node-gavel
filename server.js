var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    bluebird = require('bluebird'),
    passport = require('passport'),
    Settings = require('./api/settings'),
    port = process.env.PORT || 3000;

/* Check env settigns */
Settings.check();

/* Set mongoose  & global to use Bluebird promises */
global.Promise = bluebird;
mongoose.Promise = bluebird;
mongoose.connect(process.env.MONGODB_URI);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(passport.initialize());

/* Passport auth config */
require('./api/auth/passport');

/* Routes */
require('./api/routes/login')(app);
require('./api/routes/events')(app);
require('./api/routes/annotators')(app);
require('./api/routes/teams')(app);
require('./api/routes/projects')(app);

/* Models */
require('./api/models/Event');
require('./api/models/Project');
require('./api/models/Team');
require('./api/models/Annotator');
require('./api/models/Decision');

app.get('/api/hello', function(req, res) {
    res.send({
        message: 'Hello from the API'
    });
});

// React config for production
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port);
console.log('Node gavel started at http://localhost:' + port);
