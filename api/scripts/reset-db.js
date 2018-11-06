const mongoose = require('mongoose');
const Settings = require('../settings');

const script = function() {
    Settings.check();
    console.log('Resetting database...');
    mongoose.connect(
        Settings.MONGODB_URI,
        function(err) {
            if (err) {
                console.error('Error connecting to database', err);
                process.exit(0);
            }

            mongoose.connection.db.dropDatabase(function(err) {
                if (err) {
                    console.error('Error resetting database', err);
                }

                console.log('-> Database reset done');
                process.exit(0);
            });
        }
    );
};

script();
