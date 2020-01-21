import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { addPost } from '../../actions/post';
import { getCurrentProfile } from '../../actions/profile';

const NewPost = ({
    getCurrentProfile,
    addPost,
    auth: { user },
    profile: { profile, loading }
}) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    const [formData, setFormData] = useState({
        title: '',
        details: '',
        community: ''
    });

    const { title, details, community } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async e => {
        e.preventDefault();

        addPost({ title, details, community });

        setFormData({
            title: '',
            details: '',
            community: ''
        });
    };

    return (
        <section className='section-new-post'>
            <Container>
                <Row className='justify-content-center'>
                    <Col xs={12} md={6}>
                        <h1>New Post</h1>
                        {loading && profile === null ? (
                            <Spinner animation='border' />
                        ) : (
                            <Form onSubmit={e => onSubmit(e)}>
                                <Form.Group controlId='postCommunity'>
                                    <Form.Control
                                        as='select'
                                        required
                                        defaultValue=''
                                        name='community'
                                        onChange={e => onChange(e)}
                                    >
                                        <option value='' disabled>
                                            Select Community
                                        </option>
                                        {profile.communities.map(community => (
                                            <option
                                                value={community.community._id}
                                                key={community.community._id}
                                            >
                                                {community.community.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='postTitle'>
                                    <Form.Control
                                        type='text'
                                        required
                                        placeholder='Title'
                                        name='title'
                                        value={title}
                                        onChange={e => onChange(e)}
                                    />
                                </Form.Group>
                                <Form.Group controlId='postDetails'>
                                    <Form.Control
                                        as='textarea'
                                        rows='5'
                                        placeholder='Details'
                                        name='details'
                                        value={details}
                                        onChange={e => onChange(e)}
                                    />
                                </Form.Group>
                                <Button variant='primary' type='submit'>
                                    Create Post
                                </Button>
                            </Form>
                        )}
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

NewPost.propTypes = {
    addPost: PropTypes.func.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, addPost })(
    NewPost
);
