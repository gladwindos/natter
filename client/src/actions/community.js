import axios from 'axios';
import { setAlert } from './alert';
import { GET_COMMUNITY, GET_COMMUNITY_POSTS, COMMUNITY_ERROR } from './types';

export const getCommunity = name => async dispatch => {
    try {
        const communityRes = await axios.get(`/api/communities/name/${name}`);

        dispatch({
            type: GET_COMMUNITY,
            payload: communityRes.data
        });

        const postsRes = await axios.get(
            `/api/posts/community/${communityRes.data._id}`
        );

        dispatch({
            type: GET_COMMUNITY_POSTS,
            payload: postsRes.data
        });
    } catch (error) {
        dispatch({
            type: COMMUNITY_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });

        dispatch(setAlert('Community not found', 'danger'));
    }
};
