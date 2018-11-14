require('dotenv').config();
const mongoose = require('mongoose');
const Chance = require('chance');
const chance = new Chance();
const moment = require('moment-timezone');
const uuid = require('uuid/v4');
const _ = require('lodash');
const Promise = require('bluebird');
const loremIpsum = require('lorem-ipsum');

const Settings = require('../settings');

const EventController = require('../controllers/Event');
const TeamController = require('../controllers/Team');
const ProjectController = require('../controllers/Project');
const AnnotatorController = require('../controllers/Annotator');

// How many events to create?
const EVENT_COUNT = 4;

// What is the min/max team size?
const PEOPLE_PER_TEAM_MIN = 1;
const PEOPLE_PER_TEAM_MAX = 5;

// How many teams per event?
const TEAMS_PER_EVENT_MIN = 30;
const TEAMS_PER_EVENT_MAX = 200;

//What is the timezone for the events?
const TIMEZONE = 'Europe/Helsinki';

// Track_weights
// Generate some natural deviation between how many teams choose which track, to better simulate real world situation;
const TRACK_WEIGHTS = [1, 2, 1.1, 2.4, 1.3, 1.1, 0.7, 1.4, 2, 2];

const EVENTS = [
    //Starts in 1 hour from generating
    {
        name: 'JUNCTIONxBudapest',
        timezone: TIMEZONE,
        startTimeOffset: 1,
        endTimeOffset: 73,
        submissionDeadlineOffset: 60,
        votingStartTimeOffset: 61,
        votingEndTimeOffset: 63,
        trackCount: 10,
        challengeCount: 30
    },
    //Already running
    {
        name: 'JUNCTIONxHelsinki',
        timezone: TIMEZONE,
        startTimeOffset: 0,
        endTimeOffset: 72,
        submissionDeadlineOffset: 60,
        votingStartTimeOffset: 61,
        votingEndTimeOffset: 63,
        trackCount: 10,
        challengeCount: 30
    },
    //Voting active
    {
        name: 'JUNCTIONxEspoo',
        timezone: TIMEZONE,
        startTimeOffset: -60,
        endTimeOffset: 12,
        submissionDeadlineOffset: -1,
        votingStartTimeOffset: 0,
        votingEndTimeOffset: 2,
        trackCount: 10,
        challengeCount: 30
    },
    //Voting ended
    {
        name: 'JUNCTIONxVantaa',
        timezone: TIMEZONE,
        startTimeOffset: -62,
        endTimeOffset: 10,
        submissionDeadlineOffset: -3,
        votingStartTimeOffset: -2,
        votingEndTimeOffset: 0,
        trackCount: 10,
        challengeCount: 30
    }
];

const script = function() {
    Settings.check();
    mongoose.connect(
        Settings.MONGODB_URI,
        function(err) {
            if (err) {
                console.log('Failed to connect to database at ', MONGODB_URI);
                process.exit(1);
            }

            let _annotator;
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
                        return TeamController.create(event._id.toString(), team.members, false);
                    }).then(teams => {
                        _annotator = teams[0].members[0];
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

                                const project = generateProject(_events[eventIdx]);

                                return ProjectController.update(project, annotator);
                            });
                        }).then(projectsPerEvent => {
                            return _.flatten(projectsPerEvent);
                        });
                    })
                    .then(projects => {
                        console.log('-> Generated ' + projects.length + ' projects');

                        console.log('=== SAMPLE USERS ===');
                        return Promise.each(_events, event => {
                            return AnnotatorController.getByEvent(event._id).then(annotators => {
                                console.log(event.name);
                                console.log('-> Start time: ' + moment(event.startTime).fromNow());
                                console.log(
                                    '-> Submissions open: ' +
                                        (moment().isBetween(event.startTime, event.submissionDeadline) ? 'YES' : 'NO')
                                );
                                console.log(
                                    '-> Voting open: ' +
                                        (moment().isBetween(event.votingStartTime, event.votingEndTime) ? 'YES' : 'NO')
                                );
                                console.log('-> Annotator: ' + annotators[0].name + ' / ' + annotators[0]._id);
                                console.log('-> Login link: ' + Settings.BASE_URL + '/login/' + annotators[0].secret);
                                return;
                            });
                        });
                    })
                    .then(() => {
                        console.log('DONE.');
                        process.exit(0);
                    });
            });
        }
    );
};

function generateEvents(count) {
    return _.map(EVENTS, event => {
        return {
            name: event.name,
            hasTracks: true,
            tracks: generateTracks(event.trackCount),
            hasChallenges: true,
            challenges: generateChallenges(event.challengeCount),
            timezone: event.timezone,
            startTime: moment()
                .tz(event.timezone)
                .add(event.startTimeOffset, 'hours'),
            endTime: moment()
                .tz(event.timezone)
                .add(event.endTimeOffset, 'hours'),
            submissionDeadline: moment()
                .tz(event.timezone)
                .add(event.submissionDeadlineOffset, 'hours'),
            votingStartTime: moment()
                .tz(event.timezone)
                .add(event.votingStartTimeOffset, 'hours'),
            votingEndTime: moment()
                .tz(event.timezone)
                .add(event.votingEndTimeOffset, 'hours'),
            participantCode: chance.word({ length: 16 }),
            apiKey: uuid()
        };
    });
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
            members: generateTeamMembers(PEOPLE_PER_TEAM_MIN, PEOPLE_PER_TEAM_MAX)
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

function generateProject(event) {
    return {
        name: 'Project ' + chance.word({ length: 10 }),
        punchline: 'My amazing elevator pitch',
        description: loremIpsum({
            count: 10,
            units: 'sentences',
            sentenceLowerBound: 5,
            sentenceUpperBound: 15,
            paragraphLowerBound: 2,
            paragraphUpperBound: 6,
            format: 'plain'
        }),
        contactPhone: chance.phone(),
        location: chance.letter().toUpperCase() + chance.natural({ min: 1, max: 50 }),
        track: chance.weighted(event.tracks, TRACK_WEIGHTS),
        challenges: chance.pickset(event.challenges, Math.floor(Math.random() * 5) + 1),
        event: event._id.toString()
    };
}

script();
