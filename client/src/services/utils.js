const Utils = {
    sleep: (ms = 1) => {
        console.log('SLEEP FOR', ms);
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve();
            }, ms);
        });
    }
};

export default Utils;
