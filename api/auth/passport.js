const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AnnotatorController = require('../controllers/Annotator');
const EventController = require('../controllers/Event');
const Settings = require('../settings');

//Admin token authentication
passport.use(
    'admin',
    new LocalStrategy({ usernameField: 'token', passwordField: 'token' }, function(username, token, done) {
        if (token === Settings.ADMIN_TOKEN) {
            return done(null, {
                isAdmin: true
            });
        } else {
            return done(null, false, { message: 'Invalid admin token' });
        }
    })
);

//Annotator token authentication
passport.use(
    'annotator',
    new LocalStrategy({ usernameField: 'secret', passwordField: 'secret' }, function(username, secret, done) {
        if (!secret) {
            return done(null, false, { message: 'Annotator secret is required' });
        }

        AnnotatorController.getBySecret(secret)
            .then(annotator => {
                if (!annotator) {
                    return done(null, false, {
                        message: 'No annotator found with secret ' + secret
                    });
                }

                return done(null, annotator);
            })
            .catch(() => {
                return done(null, false, {
                    message: 'No annotator found with secret ' + secret
                });
            });
    })
);

//External API Key authentication
passport.use(
    'apiKey',
    new LocalStrategy({ usernameField: 'key', passwordField: 'key' }, function(username, key, done) {
        if (!key) {
            return done(null, false, { message: 'API Key is required' });
        }

        EventController.getEventWithApiKey(key)
            .then(event => {
                if (!event) {
                    return done(null, false, {
                        message: 'No event found with API Key ' + key
                    });
                }

                return done(null, event);
            })
            .catch(() => {
                return done(null, false, {
                    message: 'No event found with API Key ' + key
                });
            });
    })
);
