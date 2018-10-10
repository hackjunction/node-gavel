const nodemailer = require('nodemailer');
const Email = require('email-templates');
const path = require('path');

const transporter = nodemailer.createTransport({
    port: parseInt(process.env.EMAILSERVICE_PORT || "587"),
    host: process.env.EMAILSERVICE_HOST || "",
    auth: {
        user: process.env.EMAILSERVICE_USER || "",
        pass: process.env.EMAILSERVICE_PASS || ""
    }
});
const email = new Email({
    message: {
        from: process.env.EMAILSERVICE_FROM || process.env.EMAILSERVICE_USER || ''
    },
    transport: {
        jsonTransport: true
    },
    views: {
        root: path.join(__dirname, 'email-templates')
    }
});

const sendEmail = (obj) => transporter.sendMail(obj);

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
    loadTemplate(template, {user, ...context})
        .then((data) => {

            let message = {
                to: user.email,
                from: process.env.EMAILSERVICE_FROM || process.env.EMAILSERVICE_USER || "",
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
