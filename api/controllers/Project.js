const Promise = require('bluebird');
const moment = require('moment-timezone');
const _ = require('lodash');
const { Project, validate } = require('../models/Project');
const AnnotatorController = require('./Annotator');
const Settings = require('../settings');

const ProjectController = {
    /** For usage via team dashboard, by participants */
    update: (project, annotator) => {
        const doc = {
            ...project,
            team: annotator.team.toString(),
            event: annotator.event.toString()
        };

        const options = {
            setDefaultsOnInsert: true,
            new: true
        };

        return validate(doc).then(validatedData => {
            if (project.hasOwnProperty('_id')) {
                return Project.findByIdAndUpdate(project._id, validatedData, options);
            } else {
                return Project.create(validatedData);
            }
        });
    },

    /** For usage via admin panel, for updating selected fields */
    edit: (data, projectId) => {
        return Project.findByIdAndUpdate(projectId, data, { new: true });
    },

    prioritize: projectId => {
        return Project.findByIdAndUpdate(projectId, { prioritized: true }, { new: true });
    },

    deprioritize: projectId => {
        return Project.findByIdAndUpdate(projectId, { prioritized: false }, { new: true });
    },

    disable: projectId => {
        return Project.findByIdAndUpdate(projectId, { active: false }, { new: true });
    },

    enable: projectId => {
        return Project.findByIdAndUpdate(projectId, { active: true }, { new: true });
    },

    setViewedBy: (projectId, annotatorId) => {
        return Project.findByIdAndUpdate(
            projectId,
            {
                $addToSet: {
                    viewed_by: annotatorId
                }
            },
            { new: true }
        );
    },

    setSkippedBy: (projectId, annotatorId) => {
        return Project.findByIdAndUpdate(
            projectId,
            {
                $addToSet: {
                    skipped_by: annotatorId
                }
            },
            { new: true }
        );
    },

    getByTeamId: teamId => {
        return Project.findOne({ team: teamId }).lean();
    },

    getByEvent: eventId => {
        return Project.find({ event: eventId }).lean();
    },

    getById: projectId => {
        return Project.findById(projectId).lean();
    },

    getByIdPublic: projectId => {
        return Project.findById(projectId)
            .lean()
            .then(project => {
                if (!project) {
                    return Promise.reject('No project found with _id ' + projectId);
                }

                return {
                    ...project,
                    viewed: null,
                    mu: null,
                    sigma_sq: null,
                    prioritized: null
                };
            });
    },

    getByAnnotatorId: annotatorId => {
        return AnnotatorController.getById(annotatorId).then(annotator => {
            if (annotator.hasOwnProperty('team')) {
                return ProjectController.getByTeamId(annotator.team);
            } else {
                return null;
            }
        });
    },

    getPreferredProjects: annotatorId => {
        let _event;

        return AnnotatorController.getById(annotatorId)
            .then(annotator => {
                _event = annotator.event;

                if (!annotator.read_welcome || !annotator.assigned_track) {
                    return Promise.reject('Annotator must be initialised before calling getPreferredProjects');
                }

                return Project.find({
                    active: true,
                    event: annotator.event,
                    _id: {
                        $nin: annotator.ignore
                    },
                    track: annotator.assigned_track,
                    team: {
                        $ne: annotator.team
                    }
                });
            })
            .then(available_items => {
                const prioritized_items = [];
                for (i = 0; i < available_items.length; i++) {
                    if (available_items[i].prioritized) {
                        prioritized_items.push(available_items[i]);
                    }
                }

                items = prioritized_items.length > 0 ? prioritized_items : available_items;

                return AnnotatorController.getActiveAnnotators(_event).then(annotators => {
                    const cutoff = moment().subtract(Settings.ANNOTATOR_TIMEOUT_MINS, 'minutes');
                    const nonbusy = _.filter(items, item => {
                        const annotator = _.find(annotators, a => {
                            return a.next === item._id.toString();
                        });

                        if (!annotator || moment(annotator.updated).isBefore(cutoff)) {
                            return true;
                        }
                    });

                    const preferred = nonbusy.length > 0 ? nonbusy : items;

                    const less_seen = _.filter(preferred, item => {
                        return Array.isArray(item.viewed) && item.viewed.length < Settings.ITEM_MIN_VIEWS;
                    });

                    return less_seen.length > 0 ? less_seen : preferred;
                });
            });
    },

    getUnseenProjects(annotatorId) {
        return AnnotatorController.getById(annotatorId).then(annotator => {
            return Project.find({
                active: true,
                event: annotator.event,
                _id: {
                    $nin: annotator.ignore
                },
                track: annotator.assigned_track,
                team: {
                    $ne: annotator.team
                }
            });
        });
    }
};

module.exports = ProjectController;
