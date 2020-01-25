import {
    GET_PROFILE,
    PROFILE_ERROR,
    GET_PROFILE_POSTS
} from '../actions/types';

const initialState = {
    profile: null,
    loading: true,
    posts: [],
    error: {}
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            };
        case GET_PROFILE_POSTS:
            return {
                ...state,
                posts: payload,
                postsLoading: false
            };
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
                profile: null
            };
        default:
            return state;
    }
}
