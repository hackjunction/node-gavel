import slugify from 'slugify';
import _ from 'lodash';

const DEFAULT_IMG = require('../assets/default_img.png');
const DEFAULT_IMG_THUMB = require('../assets/default_img_small.png');
const THUMBNAIL_WIDTH = 480;

const Utils = {
    sleep: (ms = 1) => {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, ms);
        });
    },

    minDelay: (promise, ms = 1) => {
        return Promise.all([promise, Utils.sleep(ms)]).then(data => {
            return data[0];
        });
    },

    slugify: (string) => {
        return slugify(string, { lower: true });
    },

    getTrackName: (trackId, tracks) => {
        const track = _.find(tracks, (t) => t._id === trackId);

        return track ? track.name : '';
    },

    getChallengeName: (challengeId, challenges) => {
        const challenge = _.find(challenges, (c) => c._id === challengeId);

        return challenge ? `${challenge.name} by ${challenge.partner}` : '';
    },

    getProjectImage: (project, isThumbnail = false) => {
        if (!project.image) {
            return isThumbnail ? DEFAULT_IMG_THUMB : DEFAULT_IMG;
        } else {
            const parts = project.image.split('/');
            parts[6] += ',q_auto';
            if (isThumbnail) {
                parts[6] += '/w_' + THUMBNAIL_WIDTH;
            }

            return parts.join('/');
        }
    },
};

export default Utils;
