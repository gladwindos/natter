import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import PostItem from '../posts/PostItem';
import { getUserFeed } from '../../actions/post';

const Feed = ({ getUserFeed, post: { posts, loading } }) => {
    useEffect(() => {
        getUserFeed();
    }, [getUserFeed]);

    return (
        <section className='section-feed'>
            <Container>
                <div className='post-list'>
                    {loading ? (
                        <Spinner animation='border' />
                    ) : (
                        posts.map(post => (
                            <PostItem key={post._id} post={post} />
                        ))
                    )}
                </div>
            </Container>
        </section>
    );
};

Feed.propTypes = {
    getUserFeed: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, { getUserFeed })(Feed);
