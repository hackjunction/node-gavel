const mongoose = require('mongoose');
const Promise = require('bluebird');
const _ = require('lodash');
const settings = require('../../settings.json');
const Maths = require('./maths');

const ReviewingService = {
    getPreferredItems: annotator => {
        return new Promise(function(resolve, reject) {
            let items = [];
            const ignored_ids = annotator.ignore;
            if (annotator.teamId) {
                ignored_ids.push(annotator.teamId);
            }
            mongoose
                .model('Item')
                .find({
                    active: true,
                    _id: { $nin: ignored_ids }
                })
                .then(available_items => {
                    const prioritized_items = [];
                    for (i = 0; i < available_items.length; i++) {
                        if (available_items[i].prioritized) {
                            prioritized_items.push(available_items[i]);
                        }
                    }

                    items = prioritized_items.length > 0 ? prioritized_items : available_items;

                    mongoose
                        .model('Annotator')
                        .find({
                            active: true,
                            next: { $exists: false },
                            updated: { $exists: false }
                        })
                        .then(annotators => {
                            const nonbusy = _.filter(annotators, annotator => {
                                if (Date.now() - annotator.updated > settings.ANNOTATOR_TIMEOUT_MINUTES * 60 * 1000) {
                                    return annotator.next;
                                }
                            });

                            const preferred = nonbusy.length > 0 ? nonbusy : items;

                            const less_seen = _.filter(preferred, item => {
                                item.viewed.length < settings.ITEM_MIN_VIEWS;
                            });

                            const result = less_seen.length > 0 ? less_seen : preferred;

                            resolve(result);
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
        });
    },

    initAnnotator: annotator => {
        /**
         * This method:
         * - Should set the 'next' field of the annotator to a new project, if that field is currently empty (or null if no good projects found)
         * - Should return annotator.save()
         */
        return ReviewingService.getPreferredItems(annotator).then(preferredItems => {
            if (Array.isArray(preferredItems) && preferredItems.length > 0) {
                annotator.next = _.sample(preferredItems);
                return annotator.save();
            }
            return annotator;
        });
    },

    skipDecision: annotator => {
        /**
         * This method:
         * - Should add the current 'next' field to the 'ignore' list of the annotator
         * - Should get a new project to review and set it to the 'next' field (or null if no good projects found)
         * - Should return annotator.save()
         */
        annotator.ignore.push(annotator.next);
        return ReviewingService.getPreferredItems(annotator).then(preferredItems => {
            if (Array.isArray(preferredItems) && preferredItems.length > 0) {
                annotator.next = _.sample(preferredItems);
            } else {
                annotator.next = null;
            }

            return annotator.save();
        });
    },

    performVote: (annotator, next, prev, next_won) => {
        const winner = next_won ? next : prev;
        const loser = next_won ? prev : next;

        const {
            updated_alpha,
            updated_beta,
            updated_mu_winner,
            updated_mu_loser,
            updated_sigma_sq_winner,
            updated_sigma_sq_loser
        } = Maths.update(annotator.alpha, annotator.beta, winner.mu, winner.sigma_sq, loser.mu, loser.sigma_sq);

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
