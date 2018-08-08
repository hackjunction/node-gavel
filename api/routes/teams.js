'use strict'

const status = require('http-status');
const Item = require('../models/Item');
const Annotator = require('../models/Annotator');
const Promise = require('bluebird');

module.exports = function (app) {

	app.route('/api/teams')
        .get(getAllTeams)
		.post(createTeam);

    app.route('/api/teams/:teamId')
        .get(getTeamById)
        .delete(deleteTeamById);
}

function getAllTeams(req, res) {
    // TODO
    throw new Error('function getAllTeams not implemented yet')
}

function getTeamById(req, res) {
    // TODO
    throw new Error('function getTeamById not implemented yet')
}

function deleteTeamById(req, res) {
    // TODO
    throw new Error('function deleteTeamById not implemented yet')
}

function createTeam(req, res) {

    const doc = {
        name: req.body.itemName,
        location: req.body.itemLocation,
    };

    const annotators = req.body.annotators
	console.log(req.body)

    Item.create(doc).then((item) => {
        Promise.map(annotators, (annotator) => {
            return Annotator.create(annotator)
        }).then((annotators) => {
            return res.status(status.OK).send({
                status: 'success',
                data: {
                    item,
                    annotators
                }
            })
        }).catch((error) => {
            console.log('Error1',error);
            Item.deleteById(item._id).then(() => {
                return res.status(status.INTERNAL_SERVER_ERROR).send({
                    status: 'error',
                    message: 'See console for details'
                });
            });
        });
    }).catch((error) => {
		console.log('Error2',error);
		return res.status(status.INTERNAL_SERVER_ERROR).send({
			status: 'error',
			message: 'See console for details'
		});
	});


}
