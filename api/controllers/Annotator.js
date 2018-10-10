const Promise = require('bluebird');
const uuid = require('uuid/v4');
const { Annotator, validate } = require('../models/Annotator');

const AnnotatorController = {
    create: (name, email, teamId, eventId) => {
        const doc = {
            name,
            email,
            team: teamId,
            event: eventId
        };

        return validate(doc).then(validated => {
            validated.secret = uuid();
            return Annotator.create(validated);
        });
    },

    createMany: data => {
        return Promise.map(data, annotator => {
            return AnnotatorController.create(annotator.name, annotator.email, annotator.team, annotator.event);
        });
    },

    getBySecret: secret => {
        return Annotator.findOne({ secret }).then(annotator => {
            if (!annotator) {
                return Promise.reject('No annotator found with the secret ' + secret);
            }

            return annotator;
        });
    },

    getByEmail: email => {
        return Annotator.findOne({ email }).then(annotator => {
            if (!annotator) {
                return Promise.reject('No annotator found with the email ' + email);
            }

            return annotator;
        });
    }
};

//TODO: Implement these again as needed

// /* Get all annotators, returns promise */
// const getAll = function() {
//     return Annotator.find({});
// };

// const getByTeamId = function(teamId, throwsError = true) {
//     return Annotator.find({ teamId }).then(annotators => {
//         if (throwsError && !annotators) {
//             return Promise.reject('No annotator found with teamId: ' + teamId);
//         }
//         return Promise.resolve(annotators);
//     });
// };

// /* Find an annotator by theirs id, returns promise */
// const findById = function(id, throwsError = true) {
//     return Annotator.findById(id).then(annotator => {
//         if (throwsError && !annotator) {
//             return Promise.reject('No annotator found with id: ' + id);
//         }
//         return Promise.resolve(annotator);
//     });
// };

// /* Find an annotator by their secret, return promise */
// const findBySecret = function(secret, throwsError = true) {
//     return Annotator.findOne({ secret }).then(annotator => {
//         if (throwsError && !annotator) {
//             return Promise.reject('No annotator found with secret: ' + secret);
//         }
//         return Promise.resolve(annotator);
//     });
// };

// /* Delete an annotator by their id, returns promise */
// const deleteById = function(id, throwsError = true) {
//     return Annotator.findByIdAndRemove(id)
//         .exec()
//         .then(annotator => {
//             if (throwsError && !annotator) {
//                 return Promise.reject('No annotator found with id: ' + id);
//             }
//             return Promise.resolve(annotator);
//         });
// };

// /* Delete an annotator by their secret, returns promise */
// const deleteBySecret = function(secret, throwsError = true) {
//     return Annotator.findOneAndDelete({ secret })
//         .exec()
//         .then(annotator => {
//             if (throwsError && !annotator) {
//                 return Promise.reject('No annotator found with secret: ' + secret);
//             }
//             return Promise.resolve(annotator);
//         });
// };

// /* Sets the annotator read_welcome to true */
// const setHasReadWelcome = function(secret, throwsError = true) {
//     return Annotator.findOneAndUpdate({ secret }, { read_welcome: true }, { new: true }).then(annotator => {
//         if (throwsError && !annotator) {
//             return Promise.reject('No annotator found with secret: ' + secret);
//         }

//         return Promise.resolve(annotator);
//     });
// };

module.exports = AnnotatorController;
