const mongoose = require('mongoose');
const Chance = require('chance');
const chance = new Chance();
const _ = require('lodash');
const Promise = require('bluebird');
const EventController = require('../controllers/events');
const TeamController = require('../controllers/teams');
const AnnotatorController = require('../controllers/annotators');
const ItemController = require('../controllers/items');

require('../models/Annotator');
require('../models/Item');
require('../models/Team');
require('../models/Event');

const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost/nodeGavel';

const script = function() {
    mongoose.connect(
        MONGODB_URI,
        function(err) {
            if (err) {
                console.log('Error connecting to database', err);
                process.exit(1);
            }

            const EVENTS = generateEvents();

            return Promise.map(EVENTS, event => {
                return EventController.createEvent(event.name, event.secretCode);
            })
                .then(events => {
                    console.log('-> Created ' + events.length + ' events');
                    const TEAMS = generateTeams(100, events);

                    return Promise.map(TEAMS, team => {
                        return TeamController.createTeam(team.eventId);
                    });
                })
                .then(teams => {
                    console.log('-> Created ' + teams.length + ' teams');

                    const PROJECTS = generateProjects(teams);
                    const ANNOTATORS = generateAnnotators(teams);
                    return AnnotatorController.createAnnotators(ANNOTATORS).then(annotators => {
                        return ItemController.createItems(PROJECTS).then(projects => {
                            return {
                                annotators,
                                projects
                            };
                        });
                    });
                })
                .then(data => {
                    console.log('-> Created ' + data.annotators.length + ' annotators');
                    console.log('-> Created ' + data.projects.length + ' projects');

                    return process.exit(0);
                })
                .catch(error => {
                    console.error('Script failed', error);
                    return process.exit(1);
                });
        }
    );
};

function generateTeams(count = 100, events) {
    if (!events || events.length === 0) {
        throw new Error('Cannot generate teams without any events!');
    }

    const teams = [];

    for (let i = 0; i < count; i++) {
        teams.push({
            eventId: events[Math.floor(Math.random() * events.length)]._id.toString()
        });
    }

    return teams;
}

const TEAM_SIZES = [1, 2, 3, 4, 5];
function generateAnnotators(teams) {
    const annotators = [];

    _.each(teams, team => {
        const TEAM_SIZE = TEAM_SIZES[Math.floor(Math.random() * TEAM_SIZES.length)];

        for (let i = 0; i < TEAM_SIZE; i++) {
            annotators.push({
                name: chance.name(),
                email: chance.email(),
                teamId: team._id.toString()
            });
        }
    });

    return annotators;
}

function generateEvents(count) {
    return [
        {
            name: 'JUNCTIONxBUDAPEST',
            secretCode: 'HACKBUDA123'
        },
        {
            name: 'Junction Main Event',
            secretCode: 'MAINEVENT123'
        }
    ];
}

const LETTERS = 'ABCDEFGHIJK';
function generateProjects(teams) {
    const projects = [];

    _.each(teams, team => {
        projects.push({
            name: 'Project ' + chance.animal(),
            location: LETTERS[Math.floor(Math.random() * LETTERS.length)] + Math.floor(Math.random() * 100),
            description: 'Description for an awesome project',
            team: team._id.toString()
        });
    });

    return projects;
}

script();
