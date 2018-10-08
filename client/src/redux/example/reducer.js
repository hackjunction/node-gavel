import * as ActionTypes from './actionTypes';

const initialState = {
    foo: ''
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ActionTypes.MY_ACTION:
            return {
                ...state,
                foo: 'bar'
            };
        default:
            return state;
    }
}
