const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const TokenStrategy = require('passport-token').Strategy;
const mongoose = require('mongoose');

//Admin token authentication
passport.use(
    'admin',
    new TokenStrategy(function(username, token, done) {
        if (token === process.env.ADMIN_TOKEN) {
            return done(null, {
                isAdmin: true
            });
        } else {
            return done(null, false, { message: 'Invalid admin token' });
        }
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
