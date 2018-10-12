const Promise = require('bluebird');
const { Project, validate } = require('../models/Project');

const ProjectController = {
    create: (name, location, description, teamId, image, github) => {
        const doc = {
            name,
            location,
            description,
            team: teamId,
            image,
            github
        };

        return validate(doc).then(validatedData => {
            return Project.create(validatedData);
        });
    },

    createItems: data => {
        return Promise.map(data, item => {
            return ProjectController.createItem(item.name, item.location, item.description, item.team);
        });
    }
};

module.exports = ProjectController;
