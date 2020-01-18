import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const totalVotes = votes => {
    return votes.length > 0
        ? votes.map(vote => vote.value).reduce((total, val) => total + val)
        : 0;
};

const PostItem = ({
    auth,
    post: { _id, title, user, community, votes, comments, createdAt }
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
                                : 'https://pixabay.com/get/5fe7d6474c52b10ff3d89938b977692b083edbe25a52764b752c79/blank-profile-picture-973460_640.png'
                        }
                        alt='profile image'
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
                    <Card.Link href='#'>
                        <FontAwesomeIcon icon='arrow-up' />
                    </Card.Link>
                    <span>{totalVotes(votes)}</span>
                    <Card.Link href='#'>
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
                    <Card.Link href='#'>
                        <FontAwesomeIcon icon='ellipsis-h' />
                    </Card.Link>
                </div>
            </Card.Footer>
        </Card>
    );
};

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {})(PostItem);
