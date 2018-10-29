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

        console.log('DOC', doc);

        return validate(doc).then(validatedData => {
            console.log('VALIDATED', validatedData);
            if (project.hasOwnProperty('_id')) {
                return Project.findByIdAndUpdate(project._id, validatedData, options);
            } else {
                return Project.create(validatedData, options);
            }
        });
    },

    getByTeamId: teamId => {
        return Project.findOne({ team: teamId }).lean();
    }
};

module.exports = ProjectController;
