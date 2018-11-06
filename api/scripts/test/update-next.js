const mongoose = require('mongoose');
const _ = require('lodash');

const Settings = require('../../settings');

const AnnotatorController = require('../../controllers/Annotator');
const ProjectController = require('../../controllers/Project');

const Maths = require('../../services/maths');

// Test updating the next project for an annotator
// - Should only assign projects from the annotator's 'assigned_track'
// - Should not assign their own project
// - Should fail if annotator read_welcome=false
// - Should fail if annotator does not have 'assigned_track'

// USAGE: node update-next.js ANNOTATOR_ID

const script = function() {
    Settings.check();
    mongoose.connect(
        Settings.MONGODB_URI,
        function(err) {
            if (err) {
                console.error('Error connecting to database', err);
                process.exit(0);
            }

            const args = process.argv.slice(2);
            const ANNOTATOR_ID = args[0];
            let _annotator;

            return AnnotatorController.getById(ANNOTATOR_ID)
                .then(annotator => {
                    _annotator = annotator;
                    if (!annotator.read_welcome) {
                        return Promise.reject('Annotator has not read welcome message');
                    }
                    return ProjectController.getPreferredProjects(ANNOTATOR_ID);
                })
                .then(preferredItems => {
                    return ProjectController.getById(_annotator.next).then(next => {
                        const _next = choose_next(preferredItems, _annotator, next);
                        if (_next) {
                            return AnnotatorController.updateNext(ANNOTATOR_ID, _next._id);
                        } else {
                            return _annotator;
                        }
                    });
                })
                .then(annotator => {
                    console.log('SUCCESS, UPDATED ANNOTATOR', annotator);
                    process.exit(0);
                })
                .catch(error => {
                    console.log('ERR', error);
                    process.exit(0);
                });
        }
    );
};

function choose_next(items, annotator, current) {
    if (Array.isArray(items) && items.length > 0) {
        const _items = _.shuffle(items);

        if (Math.random() < Settings.MATH.EPSILON) {
            return _items[0];
        } else {
            return _.maxBy(_items, i => {
                return Maths.expectedInformationGain(
                    annotator.alpha,
                    annotator.beta,
                    current.mu,
                    current.sigma_sq,
                    i.mu,
                    i.sigma_sq
                );
            });
        }
    } else {
        return null;
    }
}

script();
