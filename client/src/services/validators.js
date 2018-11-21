import moment from 'moment-timezone';
import phone from 'phone';

const Validators = {
    timezone: value => {
        if (!moment.tz.zone(value)) {
            return 'Please enter a valid timezone (e.g. Europe/Helsinki)';
        } else {
            return null;
        }
    },

    email: value => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(value).toLowerCase())) {
            return 'Please enter a valid email address';
        } else {
            return null;
        }
    },

    phoneNumber: value => {
        const val = phone(value);

        if (val.length === 0) {
            return 'Please enter a valid phone number, including the country code';
        }

        return null;
    },

    url: value => {
        try {
            new URL(value);
            return null;
        } catch (_) {
            return 'Please enter a valid url, including the protocol (e.g. http://...)';
        }
    }
};

export default Validators;
