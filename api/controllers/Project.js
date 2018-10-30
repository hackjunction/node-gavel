const Promise = require('bluebird');
const { Project, validate } = require('../models/Project');

const ProjectController = {
    /** For usage via team dashboard, by participants */
    update: (project, annotator) => {
        const doc = {
            ...project,
            team: annotator.team.toString(),
            event: annotator.event.toString()
        };

        const options = {
            setDefaultsOnInsert: true
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

    getByTeamId: teamId => {
        return Project.findOne({ team: teamId }).lean();
    },

    getByEvent: eventId => {
        return Project.find({ event: eventId }).lean();
    },

    getById: projectId => {
        return Project.findById(projectId).lean();
    }
};

module.exports = ProjectController;
