import axios from 'axios';
import { setAlert } from './alert';
import {
    USER_LOADED,
    AUTH_ERROR,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT
} from './types';
import setAuthToken from '../utils/setAuthToken';

export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth');

        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (error) {
        dispatch({ type: AUTH_ERROR });
    }
};

export const register = ({ username, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ username, email, password });

    try {
        const res = await axios.post('/api/users', body, config);

        dispatch({ type: REGISTER_SUCCESS, payload: res.data });
        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
        }

        dispatch({ type: REGISTER_FAIL });
    }
};

export const login = (username, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ username, password });

    try {
        const res = await axios.post('/api/auth', body, config);

        dispatch({ type: LOGIN_SUCCESS, payload: res.data });
        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
        }

        dispatch({ type: LOGIN_FAIL });
    }
};

export const logout = () => dispatch => {
    dispatch({ type: LOGOUT });
};
