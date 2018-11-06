const status = require('http-status');
const passport = require('passport');
const Settings = require('../settings');

module.exports = function(app) {
    app.post('/api/login', adminLogin);
    app.post('/api/validate-token', passport.authenticate('admin', { session: false }), success);
};

function success(req, res) {
    return res.status(status.OK).send({
        status: 'success'
    });
}

function adminLogin(req, res) {
    const { username, password } = req.body;

    if (username === Settings.ADMIN_USER && password === Settings.ADMIN_PASS) {
        return res.status(status.OK).send({
            status: 'success',
            data: Settings.ADMIN_TOKEN
        });
    } else {
        return res.status(status.UNAUTHORIZED).send({
            status: 'error',
            message: 'Invalid admin username or password'
        });
    }
}
