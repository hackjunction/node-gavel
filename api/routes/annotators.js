'use strict';

const status = require('http-status');
const passport = require('passport');

module.exports = function(app) {
    /* Requires annotator secret */

    app.get('/api/annotators/:secret', passport.authenticate('annotator', { session: false }), getAnnotator);
};

function getAnnotator(req, res) {
    //Passport already gets us the annotator in req.user
    return res.status(status.OK).send({
        status: 'success',
        data: req.user
    });
}
