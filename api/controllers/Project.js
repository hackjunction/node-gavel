const Promise = require('bluebird');
const { Project, validate } = require('../models/Project');

const ProjectController = {
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

    getByTeamId: teamId => {
        return Project.findOne({ team: teamId }).lean();
    }
};

module.exports = ProjectController;
