const Promise = require('bluebird');

const ReviewingService = {
	getPreferredItems: (annotator) => {

		items = [];
		ignored_ids = annotator.ignore;


		available_items = [];
		// TODO judge.py rivi 162-167
		// if (ignored_ids.length > 0) {
		// 	Item.query.filter???
		// }

		prioritized_items = []
		for (i = 0; i < available_items.length; i++) {
			if (available_items[i].prioritized) {
				prioritized_items.push(available_items[i])
			}
		}


		if (prioritized.length > 0) {
			items = prioritized_items
		} else {
			items = available_items
		}


		// TODO judge.py rivi 173-175

		busy = []
		






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
		//TODO: define this
	},

	anotherFunction: function () {

	},
}

module.exports = ReviewingService;
