import axios from 'axios';
import { GET_PROFILE, GET_PROFILE_POSTS, PROFILE_ERROR } from './types';

export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');

        console.log(res.data.user._id);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
};

export const getUserProfile = username => async dispatch => {
    try {
        const profileRes = await axios.get(`/api/profile/user/${username}`);

        dispatch({
            type: GET_PROFILE,
            payload: profileRes.data
        });

        const postsRes = await axios.get(
            `/api/posts/user/${profileRes.data.user._id}`
        );

        dispatch({
            type: GET_PROFILE_POSTS,
            payload: postsRes.data
        });
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
};
