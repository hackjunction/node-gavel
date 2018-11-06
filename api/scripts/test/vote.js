const mongoose = require('mongoose');
const _ = require('lodash');

const Settings = require('../../settings');

const AnnotatorController = require('../../controllers/Annotator');
const ProjectController = require('../../controllers/Project');

const ReviewingService = require('../../services/reviewing');
const Maths = require('../../services/maths');

// Test voting

// USAGE: node vote.js ANNOTATOR_ID NEXT_WON=true/false

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
            const NEXT_WON = args[1];
            let _annotator;

            return AnnotatorController.getById(ANNOTATOR_ID)
                .then(annotator => {
                    _annotator = annotator;
                    if (!annotator.read_welcome) {
                        return Promise.reject('Annotator has not read welcome message');
                    }

                    if (!annotator.next || !annotator.prev) {
                        return Promise.reject('Annotator must have next and prev to submit vote');
                    }
                    return annotator;
                })
                .then(annotator => {
                    return Promise.all([
                        ProjectController.getById(annotator.prev),
                        ProjectController.getById(annotator.next)
                    ]).then(data => {
                        return {
                            annotator,
                            prev: data[0],
                            next: data[1]
                        };
                    });
                })
                .then(data => {
                    const { annotator, prev, next } = data;
                    // console.log('BEFORE ANNOTATOR', annotator);
                    // console.log('BEFORE PREV', prev);
                    // console.log('BEFORE NEXT', next);
                    let winner = NEXT_WON ? next : prev;
                    let loser = NEXT_WON ? prev : next;

                    const {
                        updated_alpha,
                        updated_beta,
                        updated_mu_winner,
                        updated_mu_loser,
                        updated_sigma_sq_winner,
                        updated_sigma_sq_loser
                    } = Maths.update(
                        annotator.alpha,
                        annotator.beta,
                        winner.mu,
                        winner.sigma_sq,
                        loser.mu,
                        loser.sigma_sq
                    );

                    // annotator.alpha = updated_alpha;
                    // annotator.beta = updated_beta;
                    // winner.mu = updated_mu_winner;
                    // winner.sigma_sq = updated_sigma_sq_winner;
                    // loser.mu = updated_mu_loser;
                    // loser.sigma_sq = updated_sigma_sq_loser;

                    return {
                        annotator: {
                            alpha_before: annotator.alpha,
                            alpha_after: updated_alpha,
                            beta_before: annotator.beta,
                            beta_after: updated_beta
                        },
                        winner: {
                            mu_before: winner.mu,
                            mu_after: updated_mu_winner,
                            sigma_before: winner.sigma_sq,
                            sigma_after: updated_sigma_sq_winner
                        },
                        loser: {
                            mu_before: loser.mu,
                            mu_after: updated_mu_loser,
                            sigma_before: loser.sigma_sq,
                            sigma_after: updated_sigma_sq_loser
                        }
                    };
                })
                .then(result => {
                    console.log('===============');
                    console.log('RESULT', result);
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
