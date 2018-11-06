require('dotenv').config();
const _ = require('lodash');

const Settings = {
    check: (allowErrors = false) => {
        console.log('Checking for configuration errors...');
        let hasError = false;
        _.forOwn(Settings, (key, value) => {
            if (!value) {
                console.log('Missing config variable ' + key + ', please check settings.js');
                hasError = true;
            }
        });
        if (!hasError) {
            console.log('-> Configuration ok.');
        } else if (!allowErrors) {
            throw new Error(
                'Missing config variables, check settings.js. Call Settings.check(true) to run app with errors.'
            );
        }
    },
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/nodeGavel',
    ADMIN_USER: process.env.ADMIN_USER || 'admin',
    ADMIN_PASS: process.env.ADMIN_PASS || 'admin',
    ADMIN_TOKEN: process.env.ADMIN_TOKEN || 'foofoo',
    BASE_URL: process.env.BASE_URL || 'localhost:5000',

    /** Disable sending emails? Email message will be logged in console instead */
    DISABLE_EMAIL: process.env.DISABLE_EMAIL || false,
    /** Sendgrid API key */
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || null,
    /** Sender email address */
    EMAILSERVICE_FROM: process.env.EMAILSERVICE_FROM || 'no-reply@hackjunction.com',

    /** How long after last assigned project should an annotator be considered inactive? */
    ANNOTATOR_TIMEOUT_MINS: 5,

    /** If a project has less than this many views, it will be automatically prioritised */
    ITEM_MIN_VIEWS: 5,

    /** Math constants. DO NOT CHANGE unless you have good reason and understand the consequences */
    MATH: {
        GAMMA: 0.1,
        LAMBDA: 1.0,
        KAPPA: 0.0001,
        MU_PRIOR: 0.0,
        SIGMA_SQ_PRIOR: 1.0,
        ALPHA_PRIOR: 10.0,
        BETA_PRIOR: 1.0,
        EPSILON: 0.25
    }
};

module.exports = Settings;
