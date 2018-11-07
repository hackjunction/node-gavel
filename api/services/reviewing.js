const mongoose = require('mongoose');
const Promise = require('bluebird');
const _ = require('lodash');
const Settings = require('../settings');
const Maths = require('./maths');

const AnnotatorController = require('../controllers/Annotator');
const ProjectController = require('../controllers/Project');

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
                    if (project !== null) {
                        counts = _.filter(counts, c => c.track !== project.track);
                    }

                    return _.minBy(counts, 'ratio').track;
                });
            })
            .then(selectedTrack => {
                return AnnotatorController.init(annotator._id, selectedTrack);
            });
    },

    performVote: (annotator, next, prev, next_won) => {
        let winner = next_won ? next : prev;
        let loser = next_won ? prev : next;

        console.log(winner);
        console.log(loser);

        const {
            updated_alpha,
            updated_beta,
            updated_mu_winner,
            updated_mu_loser,
            updated_sigma_sq_winner,
            updated_sigma_sq_loser
        } = Maths.update(annotator.alpha, annotator.beta, winner.mu, winner.sigma_sq, loser.mu, loser.sigma_sq);

        console.log('Updated alpha', updated_alpha);
        console.log('Updated beta', updated_beta);
        console.log('updated_mu_winner', updated_mu_winner);
        console.log('updated_sigma_sq_winner', updated_sigma_sq_winner);
        console.log('updated_mu_loser', updated_mu_loser);
        console.log('updated_sigma_sq_loser', updated_sigma_sq_loser);

        annotator.alpha = updated_alpha;
        annotator.beta = updated_beta;
        winner.mu = updated_mu_winner;
        winner.sigma_sq = updated_sigma_sq_winner;
        loser.mu = updated_mu_loser;
        loser.sigma_sq = updated_sigma_sq_loser;

        return {
            annotator,
            winner,
            loser
        };
    }
};

module.exports = ReviewingService;
