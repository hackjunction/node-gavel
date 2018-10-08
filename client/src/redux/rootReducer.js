import { combineReducers } from 'redux';

// Import the reducer from each module here, and add it to the combined reducer
import admin from './admin/reducer';

export default combineReducers({
    admin
});
