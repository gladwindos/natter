import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { upvotePost, downvotePost, deletePost } from '../../actions/post';

const totalVotes = votes => {
    return votes.length > 0
        ? votes.map(vote => vote.value).reduce((total, val) => total + val)
        : 0;
};

const PostItem = ({
    auth,
    post: { _id, title, user, community, votes, comments, createdAt },
    upvotePost,
    downvotePost,
    deletePost
}) => {
    return (
        <Card className='post-item'>
            <Card.Header>
                <div className='post-user'>
                    <img
                        className='post-profile-img'
                        src={
                            user.avatar
                                ? user.avatar
                                : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                        }
                        alt='profile'
                    />
                    <Card.Link href='#'>{user.username}</Card.Link>
                </div>
                <div className='post-community'>
                    <Card.Link href='#'>{community.name}</Card.Link>
                </div>
            </Card.Header>
            <Card.Body>
                <Card.Img
                    className='post-img'
                    src='https://sslf.ulximg.com/image/750x750/cover/1578635838_9332fe6843bf38e5169c2e860ee427fc.jpg/da4340c0bc9f3d4eed33e53af916ee76/1578635838_0b73c1dd62df5c4768fbef30965ed99a.jpg'
                />
                <div className='post-details'>
                    <Card.Title className='post-title'>{title}</Card.Title>
                    <div className='post-details-footer'>
                        <div className='post-icons'>
                            <FontAwesomeIcon icon={['fab', 'spotify']} />
                        </div>
                        <span className='post-date'>
                            Posted <Moment fromNow>{createdAt}</Moment>
                        </span>
                    </div>
                </div>
            </Card.Body>
            <Card.Footer>
                <div className='post-votes'>
                    <Card.Link href='#!' onClick={e => upvotePost(_id)}>
                        <FontAwesomeIcon icon='arrow-up' />
                    </Card.Link>
                    <span>{totalVotes(votes)}</span>
                    <Card.Link href='#!' onClick={e => downvotePost(_id)}>
                        <FontAwesomeIcon icon='arrow-down' />
                    </Card.Link>
                </div>
                <div className='post-comments'>
                    <Card.Link href='#'>
                        <FontAwesomeIcon icon='comments' />
                        <span>
                            {comments.length}
                            <span className='d-none d-sm-inline'>
                                {' '}
                                Comments
                            </span>
                        </span>
                    </Card.Link>
                </div>
                <div className='post-options'>
                    <Dropdown className='post-options' drop='up' alignRight>
                        <Dropdown.Toggle className='bg-transparent border-0 text-body'>
                            <FontAwesomeIcon icon='ellipsis-h' />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href='#!'>Share</Dropdown.Item>
                            <Dropdown.Item href='#!'>Bookmark</Dropdown.Item>
                            {!auth.loading && user._id === auth.user._id && (
                                <Dropdown.Item
                                    className='bg-danger text-white'
                                    href='#!'
                                    onClick={e => deletePost(_id)}
                                >
                                    Delete
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Card.Footer>
        </Card>
    );
};

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    upvotePost: PropTypes.func.isRequired,
    downvotePost: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {
    upvotePost,
    downvotePost,
    deletePost
})(PostItem);
