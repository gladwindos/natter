import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import PostItem from '../posts/PostItem';
import { connect } from 'react-redux';
import { getUserProfile } from '../../actions/profile';
import { useParams } from 'react-router-dom';
import ProfileModal from './ProfileModal';

const Profile = ({
    getUserProfile,
    auth,
    profile: { profile, loading, posts }
}) => {
    const { usernameParam } = useParams();

    useEffect(() => {
        getUserProfile(usernameParam);
    }, [getUserProfile, usernameParam]);

    const [showModal, setShowModal] = useState({
        show: false,
        content: [],
        type: ''
    });
    const handleModalClose = () =>
        setShowModal({
            show: false,
            content: [],
            type: ''
        });
    const handleModalShow = (e, content, type) => {
        e.preventDefault();

        setShowModal({
            show: true,
            content: content,
            type: type
        });
    };

    const renderProfile = () => {
        const {
            user,
            avatar,
            bio,
            communities,
            followers,
            following
        } = profile;

        return (
            <div className='profile-header'>
                <Container>
                    <Row>
                        <Col md={4}>
                            <Image
                                roundedCircle
                                src={
                                    avatar
                                        ? avatar
                                        : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                                }
                                alt='profile'
                            />
                        </Col>
                        <Col md={8}>
                            <div>
                                <div className='profile-username'>
                                    <h1>{user.username}</h1>
                                    {auth.user &&
                                        auth.user._id === user._id && (
                                            <Button size='sm'>
                                                Edit Profile
                                            </Button>
                                        )}
                                </div>
                                <ul>
                                    <li>
                                        <Link
                                            to='/#!'
                                            onClick={e =>
                                                handleModalShow(
                                                    e,
                                                    communities,
                                                    'communities'
                                                )
                                            }
                                        >
                                            Communities
                                        </Link>
                                    </li>
                                    |
                                    <li>
                                        <Link
                                            to='/#!'
                                            onClick={e =>
                                                handleModalShow(
                                                    e,
                                                    followers,
                                                    'followers'
                                                )
                                            }
                                        >
                                            Followers
                                        </Link>
                                    </li>
                                    |
                                    <li>
                                        <Link
                                            to='/#!'
                                            onClick={e =>
                                                handleModalShow(
                                                    e,
                                                    following,
                                                    'following'
                                                )
                                            }
                                        >
                                            Following
                                        </Link>
                                    </li>
                                </ul>
                                <p>{bio}</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    };

    const renderPosts = () => {
        return (
            <div className='profile-posts'>
                <Container>
                    <div className='post-list'>
                        {posts.map(post => (
                            <PostItem key={post._id} post={post} />
                        ))}
                    </div>
                </Container>
            </div>
        );
    };

    return loading ? (
        <Spinner />
    ) : (
        <section className='section-profile'>
            {profile && renderProfile()}
            {renderPosts()}
            <ProfileModal
                show={showModal.show}
                content={showModal.content}
                type={showModal.type}
                handleClose={handleModalClose}
            />
        </section>
    );
};

Profile.propTypes = {
    getUserProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getUserProfile })(Profile);
