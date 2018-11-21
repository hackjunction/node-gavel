const mongoose = require('mongoose');
const Promise = require('bluebird');
const _ = require('lodash');
const moment = require('moment-timezone');
const Settings = require('../settings');
const Maths = require('./maths');

const AnnotatorController = require('../controllers/Annotator');
const ProjectController = require('../controllers/Project');
const DecisionController = require('../controllers/Decision');
const EventController = require('../controllers/Event');

const ReviewingService = {
    chooseNextProject: (items, annotator, current) => {
        if (Array.isArray(items) && items.length > 0) {
            const _items = _.shuffle(items);

            if (!current || Math.random() < Settings.MATH.EPSILON) {
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
    },

    canVote: async (annotator, choice) => {
        if (!annotator.next) {
            throw new Error('Cannot submit a vote with no project assigned');
        }

        if (!annotator.active) {
            throw new Error('Cannot submit votes when annotator is not active');
        }

        if (!annotator.read_welcome) {
            throw new Error('Cannot submit votes before reading welcome message');
        }

        let event;

        try {
            event = await EventController.getEventWithId(annotator.event);
        } catch (error) {
            console.log('ERROR', error);
            throw new Error('Error getting user event details');
        }

        const now = moment().tz(event.timezone);
        const endTime = moment(event.endTime).tz(event.timezone);
        const startTime = moment(event.startTime).tz(event.timezone);

        if (!now.isBetween(startTime, endTime)) {
            throw new Error('Voting is currently closed');
        }

        if (choice !== 'skip') {
            const nextVoteEarliest = moment(annotator.updated).tz(event.timezone);
            const diffSeconds = now.diff(nextVoteEarliest) / 1000;
            if (diffSeconds < Settings.ANNOTATOR_WAIT_SECONDS) {
                throw new Error('Annotator must wait ' + diffSeconds + ' seconds before voting again');
            }
        }

        return;
    },

    getNextProject(annotator) {
        const promises = [];
        promises.push(ProjectController.getPreferredProjects(annotator._id.toString()));

        if (annotator.next) {
            promises.push(ProjectController.getById(annotator.next));
        }
        return Promise.all(promises).then(data => {
            const items = data[0];
            const current = data.length > 1 ? data[1] : null;

            return ReviewingService.chooseNextProject(items, annotator, current);
        });
    },

    initAnnotator: annotator => {
        return Promise.all([
            ProjectController.getByEvent(annotator.event),
            AnnotatorController.getByEvent(annotator.event)
        ])
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


                return ProjectController.getByAnnotatorId(annotator._id.toString()).then(project => {
                    if (project !== null && counts.length > 1) {
                        counts = _.filter(counts, c => c.track !== project.track);
                    }

                    return _.minBy(counts, 'ratio').track;
                });
            })
            .then(selectedTrack => {
                return AnnotatorController.init(annotator._id, selectedTrack);
            })
            .then(annotator => {
                return ReviewingService.getNextProject(annotator).then(nextProject => {
                    return AnnotatorController.updateNext(
                        annotator._id.toString(),
                        nextProject ? nextProject._id.toString() : null
                    );
                });
            });
    },

    getNextDecision(annotator) {
        return new Promise(function (resolve, reject) {
            if (!annotator.next) {
                return ReviewingService.assignNextProject(annotator).then(annotator => {
                    resolve(annotator);
                });
            }
            resolve(annotator);
        }).then(updatedAnnotator => {
            if (!updatedAnnotator.next) {
                return ProjectController.getUnseenProjects(annotator._id).then(unseen => {
                    if (unseen.length === 0) {
                        return {
                            previous: null,
                            current: null,
                            viewed_all: true
                        };
                    }
                });
            } else {
                const previous = updatedAnnotator.prev
                    ? ProjectController.getById(updatedAnnotator.prev)
                    : Promise.resolve(null);
                const current = ProjectController.getById(updatedAnnotator.next);

                return Promise.all([previous, current]).then(data => {
                    return {
                        previous: data[0],
                        current: data[1],
                        viewed_all: false
                    };
                });
            }
        });
    },

    assignNextProject(annotator) {
        return ReviewingService.getNextProject(annotator).then(project => {
            const updateProject = ProjectController.setViewedBy(annotator.next, annotator._id.toString());
            const updateAnnotator = AnnotatorController.updateNext(
                annotator._id.toString(),
                project ? project._id.toString() : null
            );

            return Promise.all([updateProject, updateAnnotator]).then(data => {
                //Return the updated annotator
                return data[1];
            });
        });
    },

    skipCurrentProject(annotator) {
        return ReviewingService.getNextProject(annotator).then(project => {
            const updateProject = ProjectController.setSkippedBy(annotator.next, annotator._id.toString());
            const updateAnnotator = AnnotatorController.skipCurrent(
                annotator._id.toString(),
                project ? project._id.toString() : null
            );

            return Promise.all([updateProject, updateAnnotator]).then(data => {
                //Return the updated annotator
                return data[1];
            });
        });
    },

    submitVote: async (annotator, choice) => {
        //Throws error if conditions fail
        await ReviewingService.canVote(annotator, choice);

        const VALID_CHOICES = ['done', 'skip'];

        if (annotator.prev) {
            VALID_CHOICES.push('current');
            VALID_CHOICES.push('previous');
        }

        if (!_.includes(VALID_CHOICES, choice)) {
            throw new Error('Invalid choice ' + choice + ', must be one of ' + VALID_CHOICES.join(', '));
        }

        switch (choice) {
            //Set the annotator's first project as seen, and assign them another project
            case 'done': {
                return ReviewingService.assignNextProject(annotator);
            }
            //Switch the annotator's current project to another one
            case 'skip': {
                return ReviewingService.skipCurrentProject(annotator);
            }
            //Submit a vote where the annotator's previous project is the winner, and assign them a new project
            case 'previous': {
                return ReviewingService.performVote(annotator, false);
            }
            //Submit a vote where the annotator's current project is the winner, and assign them a new project
            case 'current': {
                return ReviewingService.performVote(annotator, true);
            }
        }
    },

    performVote: (annotator, current_won) => {
        let winner = current_won ? annotator.next : annotator.prev;
        let loser = current_won ? annotator.prev : annotator.next;

        return Promise.all([ProjectController.getById(loser), ProjectController.getById(winner)]).then(data => {
            loser = data[0];
            winner = data[1];

            const {
                updated_alpha,
                updated_beta,
                updated_mu_winner,
                updated_mu_loser,
                updated_sigma_sq_winner,
                updated_sigma_sq_loser
            } = Maths.update(annotator.alpha, annotator.beta, winner.mu, winner.sigma_sq, loser.mu, loser.sigma_sq);

            const updateAnnotator = AnnotatorController.update(annotator._id.toString(), {
                alpha: updated_alpha,
                beta: updated_beta
            });

            const updateNext = ProjectController.edit(
                {
                    mu: current_won ? updated_mu_winner : updated_mu_loser,
                    sigma_sq: current_won ? updated_sigma_sq_winner : updated_sigma_sq_loser,
                    $addToSet: {
                        viewed_by: annotator._id.toString()
                    }
                },
                annotator.next
            );

            const updatePrev = ProjectController.edit(
                {
                    mu: current_won ? updated_mu_loser : updated_mu_winner,
                    sigma_sq: current_won ? updated_sigma_sq_loser : updated_sigma_sq_winner
                },
                annotator.prev
            );

            const createDecision = DecisionController.create(
                annotator._id.toString(),
                annotator.event.toString(),
                winner._id.toString(),
                loser._id.toString()
            );

            return Promise.all([updatePrev, updateNext, createDecision, updateAnnotator]).then(data => {
                const updatedAnnotator = data[3];

                //After submitting the vote, assign the next project for the annotator;
                return ReviewingService.getNextProject(updatedAnnotator).then(nextProject => {
                    return AnnotatorController.updateNext(
                        annotator._id.toString(),
                        nextProject ? nextProject._id.toString() : null
                    );
                });
            });
        });
    }
};

module.exports = ReviewingService;
