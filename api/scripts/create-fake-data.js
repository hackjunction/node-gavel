require('dotenv').config();
const mongoose = require('mongoose');
const Chance = require('chance');
const chance = new Chance();
const moment = require('moment-timezone');
const uuid = require('uuid/v4');
const _ = require('lodash');
const Promise = require('bluebird');
const loremIpsum = require('lorem-ipsum');

const EventController = require('../controllers/Event');
const TeamController = require('../controllers/Team');
const ProjectController = require('../controllers/Project');

const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost/nodeGavel';

// How many events to create?
const EVENT_COUNT = 4;

// What is the min/max team size?
const PEOPLE_PER_TEAM_MIN = 1;
const PEOPLE_PER_TEAM_MAX = 5;

// How many teams per event?
const TEAMS_PER_EVENT_MIN = 10;
const TEAMS_PER_EVENT_MAX = 50;

const script = function() {
    mongoose.connect(
        MONGODB_URI,
        function(err) {
            if (err) {
                console.log('Failed to connect to database at ', MONGODB_URI);
                process.exit(1);
            }

            let _events = [];

            console.log('=== GENERATING EVENTS ===');
            Promise.map(generateEvents(EVENT_COUNT), event => {
                return EventController.create(event);
            }).then(events => {
                _events = events;
                console.log('-> Generated ' + events.length + ' events');
                console.log('=== GENERATING TEAMS ===');
                return Promise.map(events, event => {
                    const teams = generateTeams(TEAMS_PER_EVENT_MIN, TEAMS_PER_EVENT_MAX);

                    return Promise.map(teams, team => {
                        return TeamController.create(event._id.toString(), team.members, team.contactPhone, false);
                    }).then(teams => {
                        console.log('-> Generated ' + teams.length + ' teams for event ' + event.name);
                        return teams;
                    });
                })
                    .then(teamsByEvent => {
                        console.log('=== GENERATING PROJECTS ===');
                        return Promise.map(teamsByEvent, (teams, eventIdx) => {
                            return Promise.map(teams, team => {
                                const annotator = {
                                    event: _events[eventIdx]._id,
                                    team: team._id
                                };

                                const project = generateProject();

                                return ProjectController.update(project, annotator);
                            });
                        }).then(projectsPerEvent => {
                            return _.flatten(projectsPerEvent);
                        });
                    })
                    .then(projects => {
                        console.log('-> Generated ' + projects.length + ' projects');
                        process.exit(0);
                    });
            });
        }
    );
};

function generateEvents(count) {
    const events = [];

    for (let i = 0; i < count; i++) {
        events.push({
            name: 'JUNCTIONx' + chance.city(),
            hasTracks: true,
            tracks: generateTracks(10),
            hasChallenges: true,
            challenges: generateChallenges(10),
            timezone: 'Europe/Helsinki',
            startTime: moment().tz('Europe/Helsinki'),
            endTime: moment()
                .tz('Europe/Helsinki')
                .add(3, 'days'),
            submissionDeadline: moment()
                .tz('Europe/Helsinki')
                .add(60, 'hours'),
            votingStartTime: moment()
                .tz('Europe/Helsinki')
                .add(62, 'hours'),
            votingEndTime: moment()
                .tz('Europe/Helsinki')
                .add(64, 'hours'),
            participantCode: chance.word({ length: 16 }),
            apiKey: uuid()
        });
    }

    return events;
}

function generateTracks(count) {
    const tracks = [];

    for (let i = 0; i < count; i++) {
        tracks.push('Track ' + i);
    }

    return tracks;
}

function generateChallenges(count) {
    const challenges = [];

    for (let i = 0; i < count; i++) {
        challenges.push('Challenge ' + chance.company());
    }

    return challenges;
}

function generateTeams(min, max) {
    const teamCount = chance.natural({ min, max });
    const teams = [];

    for (let i = 0; i < teamCount; i++) {
        teams.push({
            members: generateTeamMembers(PEOPLE_PER_TEAM_MIN, PEOPLE_PER_TEAM_MAX),
            contactPhone: chance.phone()
        });
    }

    return teams;
}

function generateTeamMembers(min, max) {
    const memberCount = chance.natural({ min, max });
    const members = [];

    for (let i = 0; i < memberCount; i++) {
        members.push({
            name: chance.name(),
            email: chance.email()
        });
    }

    return members;
}

function generateProject() {
    return {
        name: 'Project ' + chance.word({ length: 10 }),
        description: loremIpsum({
            count: 10,
            units: 'sentences',
            sentenceLowerBound: 5,
            sentenceUpperBound: 15,
            paragraphLowerBound: 2,
            paragraphUpperBound: 6,
            format: 'plain'
        }),
        location: chance.letter().toUpperCase() + chance.natural({ min: 1, max: 50 })
    };
}

script();
