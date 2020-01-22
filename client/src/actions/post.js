import axios from 'axios';
import { setAlert } from './alert';
import {
    GET_All_POSTS,
    GET_USER_FEED,
    UPDATE_VOTES,
    DELETE_POST,
    ADD_POST,
    POST_ERROR
} from '../actions/types';

export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('api/posts');

        dispatch({
            type: GET_All_POSTS,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
};

export const getUserFeed = () => async dispatch => {
    try {
        const res = await axios.get('api/posts/feed');

        dispatch({
            type: GET_USER_FEED,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
};

export const upvotePost = id => async dispatch => {
    try {
        const res = await axios.put(`api/posts/${id}/upvote`);

        dispatch({
            type: UPDATE_VOTES,
            payload: { id, votes: res.data }
        });
    } catch (error) {
        const msg = error.response.statusText;
        const status = error.response.status;
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: msg,
                status: status
            }
        });

        if (status === 401) {
            dispatch(setAlert('You need to login to upvote a post', 'danger'));
        }
    }
};

export const downvotePost = id => async dispatch => {
    try {
        const res = await axios.put(`api/posts/${id}/downvote`);

        dispatch({
            type: UPDATE_VOTES,
            payload: { id, votes: res.data }
        });
    } catch (error) {
        const msg = error.response.statusText;
        const status = error.response.status;
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: msg,
                status: status
            }
        });

        if (status === 401) {
            dispatch(
                setAlert('You need to login to downvote a post', 'danger')
            );
        }
    }
};

export const deletePost = id => async dispatch => {
    try {
        await axios.delete(`api/posts/${id}`);

        dispatch({
            type: DELETE_POST,
            payload: id
        });

        dispatch(setAlert('Your post has been deleted', 'success'));
    } catch (error) {
        const msg = error.response.statusText;
        const status = error.response.status;
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: msg,
                status: status
            }
        });

        if (status === 401) {
            dispatch(
                setAlert('You need to login to downvote a post', 'danger')
            );
        }
    }
};

export const addPost = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.post('api/posts', formData, config);

        dispatch({
            type: ADD_POST,
            payload: res.data
        });

        dispatch(setAlert('Your post has created', 'success'));
    } catch (error) {
        const msg = error.response.statusText;
        const status = error.response.status;
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: msg,
                status: status
            }
        });

        if (status === 401) {
            dispatch(
                setAlert('You need to login to create a new post', 'danger')
            );
        }
    }
};
