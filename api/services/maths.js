const { exp, log } = require('numjs');
const { betaln, psi } = require('scipy');


const GAMMA = 0.1;
const LAMBDA = 1.0;
const KAPPA = 0.0001;
const MU_PRIOR = 0.0;
const SIGMA_SQ_PRIOR = 1.0;
const ALPHA_PRIOR = 10.0;
const BETA_PRIOR = 1.0;
const EPSILON = 0.25;


/**
 * This should be equivalent to scipy.special.betaln
 * https://docs.scipy.org/doc/scipy-0.14.0/reference/generated/scipy.special.betaln.html
 */
function betaln(a, b) {
	//TODO: Implement this
}

/** 
 * Absolutely no clue how to do this, but should be equivalent to scipy.special.psi
 * https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.psi.html
*/
function psi() {
	//TODO: Implement this
}


// Port of gavel/crowd_bt.py in original Gavel. 

const QuickMATHS = {

	argmax: (f, xs) => {
		return Math.max(xs, f);
	},

	divergenceGaussian: (mu_1, sigma_sq_1, mu_2, sigma_sq_2) => {
		const ratio = sigma_sq_1 / sigma_sq_2;

		return (
			Math.pow(mu_1 - mu_2, 2)
			/ (2 * sigma_sq_2)
			+ (ratio - 1 - log(ratio)) / 2
		);
	},

	divergenceBeta: (alpha_1, beta_1, alpha_2, beta_2) => {
		//TODO: Implement this
	},

	update: (alpha, beta, mu_winner, sigma_sq_winner, mu_loser, sigma_sq_loser) => {
		//TODO: Implement this
	},

	expectedInformationGain: (alpha, beta, mu_a, sigma_sq_a, mu_b, sigma_sq_b) => {
		//TODO: Implement this
	},

	updatedMus: (alpha, beta, mu_winner, sigma_sq_winner, mu_loser, sigma_sq_loser) => {
		//TODO: Implement this
	},

	updatedSigmaSqs: (alpha, beta, mu_winner, sigma_sq_winner, mu_loser, sigma_sq_loser) => {
		//TODO: Implement this
	},

	updatedAnnotator: (alpha, beta, mu_winner, sigma_sq_winner, mu_loser, sigma_sq_loser) => {
		//TODO: Implement this
	},


};

module.exports = QuickMATHS;