'use strict'

const status = require('http-status');
const Item = require('../models/Item');
const Annotator = require('../models/Annotator');
const Promise = require('bluebird');
const _ = require('lodash')

module.exports = function (app) {

	app.route('/api/teams')
        .get(getAllTeams)
		.post(createTeam);

    app.route('/api/teams/:teamId')
        .get(getTeamById)
        .delete(deleteTeamById);	// Item.deleteById(req.id).then((item) => {


}

function getAllTeams(req, res) {
	// Item.getAll().then((items) => {
	//
	// })

    throw new Error('function getAllTeams not implemented yet')

}

function getTeamById(req, res) {
	Item.findById(req.params.teamId).then(item => {
		Annotator.getByTeamId(req.params.teamId).then(annotators => {
			return res.status(status.OK).send({
				status: 'success',
				data: {
					item,
					annotators
				}
			});
		}).catch((error) => {
			console.log('Error', error);
			return res.status(status.INTERNAL_SERVER_ERROR).send({
				status: 'error',
				message: 'See console for details'
			});
		})
	}).catch((error) => {
		console.log('Error', error);
		return res.status(status.INTERNAL_SERVER_ERROR).send({
			status: 'error',
			message: 'See console for details'
		});
	})

    //
    // throw new Error('function getTeamById not implemented yet')
}

function deleteTeamById(req, res) {
	const teamId = req.params.teamId

	Item.deleteById(teamId).then(() => {
		Annotator.getByTeamId(teamId).then((annotators) => {

			const annotatorIds = _.map(annotators, (annotator) => {
				return annotator._id
			})
			Promise.map(annotatorIds, (id) => {
	            return Annotator.deleteById(id)
			}).then((deletedAnnotators) => {
				return res.status(status.OK).send({
					status: 'success'
				});
			}).catch((error) => {
				console.log('Error', error);
				return res.status(status.INTERNAL_SERVER_ERROR).send({
					status: 'error',
					message: 'See console for details'
				});
			});

		}).catch((error) => {
			console.log('Error', error);
			return res.status(status.INTERNAL_SERVER_ERROR).send({
				status: 'error',
				message: 'See console for details'
			});
		});

	}).catch((error) => {
		console.log('Error', error);
		return res.status(status.INTERNAL_SERVER_ERROR).send({
			status: 'error',
			message: 'See console for details'
		});
	});

	// throw new Error('function deleteTeamById not implemented yet')
}

function createTeam(req, res) {

    const doc = {
        name: req.body.teamName,
        location: req.body.teamLocation,
    };

    Item.create(doc).then((item) => {
		const annotators = _.map(req.body.annotators, (annotator) => {
			annotator.teamId = item._id
			return annotator
		});

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
