import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import PostItem from '../layout/PostItem';
import { getPosts } from '../../actions/post';

const Feed = ({ getPosts, post: { posts, loading } }) => {
    useEffect(() => {
        getPosts();
    }, [getPosts]);
    // return loading ? (
    //     <Spinner animation='border' />
    // ) : (
    //     <section className='section-feed'>
    //         <Container>
    //             <div className='post-list'>
    //                 {posts.map(post => (
    //                     <PostItem key={post._id} post={post} />
    //                 ))}
    //             </div>
    //         </Container>
    //     </section>
    // );

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
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, { getPosts })(Feed);
