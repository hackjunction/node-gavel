const Promise = require('bluebird');

const ReviewingService = {
	getPreferredItems: (annotator) => {
		return new Promise(function (resolve, reject) {

		});
	},

	initAnnotator: (annotator) => {
		/**
		 * This method:
		 * - Should set the 'next' field of the annotator to a new project, if that field is currently empty (or null if no good projects found)
		 * - Should return annotator.save()
		 */
		throw new Error('initAnnotator not implemented');
	},

	skipDecision: (annotator) => {
		/**
		 * This method:
		 * - Should add the current 'next' field to the 'ignore' list of the annotator
		 * - Should get a new project to review and set it to the 'next' field (or null if no good projects found)
		 * - Should return annotator.save()
		 */
		throw new Error('skipDecision not implemented');
	},

	updateNext: (annotator) => {

	},

	anotherFunction: function () {

	},
}

module.exports = ReviewingService;