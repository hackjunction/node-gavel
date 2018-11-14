const Utils = {
    sleep: (ms = 1) => {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve();
            }, ms);
        });
    }
};

export default Utils;
