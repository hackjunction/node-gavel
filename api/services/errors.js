const status = require('http-status');

const INVALID_SECRET = 'INVALID_SECRET';
const VOTING_CLOSED = 'VOTING_CLOSED';
const ANNOTATOR_DISABLED = 'ANNOTATOR_DISABLED';
const ANNOTATOR_WAIT = 'ANNOTATOR_WAIT';
const ANNOTATOR_NOT_READ_WELCOME = 'ANNOTATOR_NOT_READ_WELCOME'
const INVALID_ACTION = 'INVALID_ACTION';

function invalidSecretError(res) {
	return res.status(status.UNAUTHORIZED).send({
		status: 'error',
		message: 'Invalid secret - no annotators found',
		errorType: INVALID_SECRET
	});
}

function votingClosedError(res) {
	return res.status(status.FORBIDDEN).send({
		status: 'error',
		message: 'Voting is currently closed',
		errorType: VOTING_CLOSED
	});
}

function annotatorDisabledError(res) {
	return res.status(status.FORBIDDEN).send({
		status: 'error',
		message: 'This annotator has been disabled via the admin panel',
		errorType: ANNOTATOR_DISABLED
	});
}

function annotatorWaitError(res) {
	return res.status(status.NOT_FOUND).send({
		status: 'error',
		message: 'No new projects to evaluate found. Please wait a moment and try again later.',
		errorType: ANNOTATOR_WAIT
	});
}

function annotatorNotReadWelcomeError(res) {
	return res.status(status.FORBIDDEN).send({
		status: 'error',
		message: 'Annotator has not read instructions yet. Annotator needs to read them to be able to perform this action.',
		errorType: ANNOTATOR_NOT_READ_WELCOME
	});
}

function invalidActionError(res, message) {
	return res.status(status.BAD_REQUEST).send({
		status: 'error',
		message,
		errorType: INVALID_ACTION
	})
}

module.exports = {
	INVALID_SECRET,
	VOTING_CLOSED,
	ANNOTATOR_DISABLED,
	ANNOTATOR_WAIT,
	ANNOTATOR_NOT_READ_WELCOME,
	INVALID_ACTION,
	invalidSecretError,
	votingClosedError,
	annotatorDisabledError,
	annotatorWaitError,
	annotatorNotReadWelcomeError,
	invalidActionError
}