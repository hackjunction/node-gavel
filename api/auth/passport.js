const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AnnotatorController = require('../controllers/Annotator');
//Admin token authentication
passport.use(
    'admin',
    new LocalStrategy({ usernameField: 'token', passwordField: 'token' }, function(username, token, done) {
        if (token === process.env.ADMIN_TOKEN) {
            return done(null, {
                isAdmin: true
            });
        } else {
            return done(null, false, { message: 'Invalid admin token' });
        }
    })
);

passport.use(
    'annotator',
    new LocalStrategy({ usernameField: 'secret', passwordField: 'secret' }, function(username, secret, done) {
        if (!secret) {
            return done(null, false, { message: 'Annotator secret is required' });
        }

        AnnotatorController.getBySecret(secret)
            .populate('event team')
            .then(annotator => {
                if (!annotator) {
                    return done(null, false, { message: 'No annotator found with secret ' + secret });
                }

                return done(null, annotator);
            });
    })
);

// // User token authentication
// passport.use(
//     'token',
//     new LocalStrategy(
//         {
//             usernameField: 'token',
//             passwordField: 'token'
//         },
//         function(username, token, done) {
//             UserController.getUserWithToken(token)
//                 .then(user => {
//                     if (!user) {
//                         return done(null, false);
//                     }
//                     return done(null, user);
//                 })
//                 .catch(error => {
//                     return done(error);
//                 });
//         }
//     )
// );
