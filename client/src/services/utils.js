import slugify from 'slugify';

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
};

export default Utils;
