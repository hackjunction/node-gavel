import moment from 'moment-timezone';

const Validators = {
    noValidate: () => {
        return {
            error: false,
            message: ''
        };
    },

    stringMinMax: (value, min = 0, max = 500, minMessage = '', maxMessage = '') => {
        if (value.length < min) {
            return {
                error: true,
                message: minMessage
            };
        }

        if (value.length > max) {
            return {
                error: true,
                message: maxMessage
            };
        }

        return {
            error: false,
            meesage: ''
        };
    },
    arrayMinMax: (value, minItems = null, maxItems = null, minMessage = '', maxMessage = '') => {
        if (minItems && value.length < minItems) {
            return {
                error: true,
                message: minMessage
            };
        } else if (maxItems && value.length > maxItems) {
            return {
                error: true,
                message: maxMessage
            };
        }

        return {
            error: false,
            message: ''
        };
    },
    arrayOf: (value, minItems = null, maxItems = null, minMessage = '', maxMessage = '', itemValidator = null) => {
        const { error, message } = Validators.array(value, minItems, maxItems, minMessage, maxMessage);

        if (error) {
            return {
                error,
                message
            };
        } else if (itemValidator) {
            for (let i = 0; i < value.length; i++) {
                const item = value[i];
                const { error, message } = itemValidator(item);

                if (error) {
                    return {
                        error: true,
                        message: item + ': ' + message
                    };
                }
            }
        }

        return {
            error: false,
            message: ''
        };
    },

    date: value => {
        const mom = moment(value, 'DD.MM.YYYY HH:mm');
        if (!mom.isValid()) {
            return {
                error: true,
                message: 'Please enter the date and time as dd.mm.yyyy HH:mm'
            };
        } else {
            return {
                error: false,
                message: mom.format('MMMM Do YYYY, HH:mm')
            };
        }
    },

    dateMinMax: (value, min = null, max = null, minMessage = '', maxMessage = '') => {
        const mom = moment(value, 'DD.MM.YYYY HH:mm');
        if (!mom.isValid()) {
            return {
                error: true,
                message: 'Please enter the date and time as dd.mm.yyyy HH:mm'
            };
        } else {
            if (min) {
                const startTime = moment(min, 'DD.MM.YYYY HH:mm');

                if (startTime.isValid() && !startTime.isBefore(mom)) {
                    return {
                        error: true,
                        message: minMessage
                    };
                }
            }

            if (max) {
                const endTime = moment(max, 'DD.MM.YYYY HH:mm');

                if (endTime.isValid() && !endTime.isAfter(mom)) {
                    return {
                        error: true,
                        message: maxMessage
                    };
                }
            }

            return {
                error: false,
                message: mom.format('MMMM Do YYYY, HH:mm')
            };
        }
    },

    timezone: value => {
        if (!moment.tz.zone(value)) {
            return {
                error: true,
                message: 'Please enter a valid timezone (e.g. Europe/Helsinki)'
            };
        } else {
            return {
                error: false,
                message: ''
            };
        }
    }
};

export default Validators;
