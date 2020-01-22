import {
    GET_All_POSTS,
    GET_USER_FEED,
    UPDATE_VOTES,
    DELETE_POST,
    ADD_POST,
    POST_ERROR
} from '../actions/types';

const initialState = {
    posts: [],
    post: null,
    loading: true,
    error: {}
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_All_POSTS:
        case GET_USER_FEED:
            return {
                ...state,
                posts: payload,
                loading: false
            };
        case ADD_POST:
            return {
                ...state,
                posts: [payload, ...state.posts],
                loading: false
            };
        case UPDATE_VOTES:
            return {
                ...state,
                posts: state.posts.map(post =>
                    post._id === payload.id
                        ? { ...post, votes: payload.votes }
                        : post
                )
            };
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== payload),
                loading: false
            };
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };

        default:
            return state;
    }
}
