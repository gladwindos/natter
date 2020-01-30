import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import post from './post';
import profile from './profile';
import community from './community';

export default combineReducers({
    alert,
    auth,
    post,
    profile,
    community
});
