const mongoose = require('mongoose');
const Chance = require('chance');
const Promise = require('bluebird');
const Annotator = require('../models/Annotator');
const Item = require('../models/Item');
const chance = new Chance();


const script = function () {
	console.log('Creating fake data...');
	mongoose.connect('mongodb://localhost/nodeGavel', function (err) {
		if (err) {
			console.log('Error connecting to database', err);
			process.exit(0);
		}

		const annotators = generateAnnotators(100);
		const projects = generateProjects(100);

		return Promise.each(annotators, (annotator) => {
			return Annotator.create(annotator);
		}).then(() => {
			return Promise.each(projects, (project) => {
				return Item.create(project);
			});
		}).then(() => {
			console.log('Generated projects and annotators');
			process.exit(0);
		}).catch((err) => {
			console.log('Error generating fake data', err);
			process.exit(1);
		});
	});
};

function generateProjects(count = 100) {
	const projects = [];

	for (var i = 0; i < count; i++) {
		projects.push({
			name: 'Project ' + chance.animal(),
			location: randomLetter() + randomNumber()
		});
	}

	return projects;
}

function randomLetter() {
	const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
	return letters[Math.floor(Math.random() * letters.length)];
}

function randomNumber() {
	return Math.floor(Math.random() * 100);
}

function generateAnnotators(count = 100) {
	const annotators = [];

	for (var i = 0; i < count; i++) {
		annotators.push({
			name: chance.name(),
			email: chance.email()
		});
	}

	return annotators;
}

script();