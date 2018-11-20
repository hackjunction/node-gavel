const Cryptr = require('cryptr');
const { SALT } = require('../settings');
const cryptr = new Cryptr(SALT);

const Utils = {
    encrypt: plainText => {
        return cryptr.encrypt(plainText);
    },

    decrypt: cipherText => {
        return cryptr.decrypt(cipherText);
    }
};

module.exports = Utils;
