import {
    GET_COMMUNITY,
    COMMUNITY_ERROR,
    GET_COMMUNITY_POSTS
} from '../actions/types';

const initialState = {
    community: null,
    loading: true,
    posts: [],
    postsLoading: true,
    error: {}
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_COMMUNITY:
            return {
                ...state,
                community: payload,
                loading: false
            };
        case GET_COMMUNITY_POSTS:
            return {
                ...state,
                posts: payload,
                postsLoading: false
            };
        case COMMUNITY_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
                postsLoading: false,
                community: null
            };
        default:
            return state;
    }
}
