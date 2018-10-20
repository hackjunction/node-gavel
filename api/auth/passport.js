const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AnnotatorController = require('../controllers/Annotator');
const EventController = require('../controllers/Event');

//Admin token authentication
passport.use(
  'admin',
  new LocalStrategy(
    { usernameField: 'token', passwordField: 'token' },
    function(username, token, done) {
      if (token === process.env.ADMIN_TOKEN) {
        return done(null, {
          isAdmin: true
        });
      } else {
        return done(null, false, { message: 'Invalid admin token' });
      }
    }
  )
);

//Annotator token authentication
passport.use(
  'annotator',
  new LocalStrategy(
    { usernameField: 'secret', passwordField: 'secret' },
    function(username, secret, done) {
      if (!secret) {
        return done(null, false, { message: 'Annotator secret is required' });
      }

      AnnotatorController.getBySecret(secret).then(annotator => {
        if (!annotator) {
          return done(null, false, {
            message: 'No annotator found with secret ' + secret
          });
        }

        EventController.getEventWithId(annotator.event).then(event => {
          if (!event) {
            return done(null, false, {
              message: 'Unable to find annotator event with _id ' + event
            });
          }

          return done(null, {
            ...annotator,
            event: EventController.removeNonPublicFields(event)
          });
        });
      });
    }
  )
);
