const mongoose = require('mongoose');
const _ = require('lodash');

const Settings = require('../../settings');

const AnnotatorController = require('../../controllers/Annotator');
const ProjectController = require('../../controllers/Project');

// Test assigning an annotator to a track
// - Should assign annotator to a track at the event they are at
// - Should assign them to the track with the lowest annotators/projects ratio
// - Should not assign them to their own track

// USAGE: node init-annotator.js ANNOTATOR_ID

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

            return AnnotatorController.getById(ANNOTATOR_ID)
                .then(annotator => {
                    console.log('-> Annotator ', annotator.name);
                    return Promise.all([
                        ProjectController.getByEvent(annotator.event),
                        AnnotatorController.getByEvent(annotator.event)
                    ]);
                })
                .then(data => {
                    const projects = data[0];
                    const annotators = data[1];

                    let counts = {};

                    _.each(projects, p => {
                        if (counts.hasOwnProperty(p.track)) {
                            counts[p.track].projects += 1;
                        } else {
                            counts[p.track] = {
                                track: p.track,
                                projects: 1,
                                annotators: 1
                            };
                        }
                    });

                    _.each(annotators, a => {
                        if (a.hasOwnProperty('assigned_track')) {
                            counts[a.assigned_track].annotators += 1;
                        }
                    });

                    counts = _.map(counts, c => {
                        return {
                            ...c,
                            ratio: (c.annotators * 1.0) / c.projects
                        };
                    });

                    return ProjectController.getByAnnotatorId(ANNOTATOR_ID).then(project => {
                        if (project !== null) {
                            counts = _.filter(counts, c => c.track !== project.track);
                        }

                        return _.minBy(counts, 'ratio');
                    });
                })
                .then(selectedTrack => {
                    return AnnotatorController.init(ANNOTATOR_ID, selectedTrack.track).then(annotator => {
                        console.log('SUCCESS, INITED ANNOTATOR: ', annotator);
                        return;
                    });
                })
                .then(() => {
                    process.exit(0);
                })
                .catch(error => {
                    console.log('ERR', error);
                    process.exit(0);
                });
        }
    );
};

script();
