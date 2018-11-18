const Utils = {
    sleep: (ms = 1) => {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve();
            }, ms);
        });
    },

    minDelay: (promise, ms = 1) => {
        return Promise.all([promise, Utils.sleep(ms)]).then(data => {
            return data[0];
        });
    }
};

export default Utils;
