const Utils = {
    sleep: (ms = 1) => {
        return new Promise(function(resolve, reject) {
            resolve();
        }, ms);
    }
};

export default Utils;
