const Email = require('email-templates');
const path = require('path');
const sgMail = require('@sendgrid/mail');
const Promise = require('bluebird');

const EventController = require('../controllers/Event');
const AnnotatorController = require('../controllers/Annotator');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const email = new Email({
    message: {
        from: process.env.EMAILSERVICE_FROM,
    },
    transport: {
        jsonTransport: true
    },
    views: {
        root: path.join(__dirname, 'email-templates')
    }
});

const sendEmail = (msg) => sgMail.send(msg);

const loadTemplate = (templateName, context) => new Promise((resolve, reject) => {
    email.renderAll(templateName, context)
        .then((data) => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
});

const prepareMessage = (template, user, context) => new Promise((resolve, reject) => {
    loadTemplate(template, { user, ...context })
        .then((data) => {

            let message = {
                to: user.email,
                from: process.env.EMAILSERVICE_FROM || "",
                ...data
            };

            resolve(message);
        })
        .catch(err => {
            reject(err);
        })
});

const sendOne = (template, user, context) => new Promise((resolve, reject) => {
    prepareMessage(template, user, context)
        .then(message => {
            sendEmail(message);
            resolve();
        })
        .catch(reject);
});

const sendAll = (template, users, context) => new Promise((resolve, reject) => {
    let messages = [];

    users.forEach((u) => {
        messages.push(prepareMessage(template, u, context))
    });

    Promise.all(messages)
        .then(data => {
            data.forEach((message) => {
                sendEmail(message);
            });
            resolve();
        })
        .catch(reject);
});

const teamMemberAddedEmail = (annotatorId, eventId) => {

    return EventController.getEventWithId(eventId).then(event => {
        return AnnotatorController.getById(annotatorId).then((annotator) => {
            const context = {
                userName: annotator.name,
                eventName: event.name,
                loginLink: process.env.BASE_URL + '/login/' + annotator.secret,
            };

            return sendOne('create-team', annotator, context);
        });
    });
}

module.exports = {
    teamMemberAddedEmail,
}