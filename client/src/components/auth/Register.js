import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';

export const Register = ({ setAlert, register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const { username, email, password } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async e => {
        e.preventDefault();

        register({ username, email, password });
    };

    if (isAuthenticated) {
        return <Redirect to='/' />;
    }

    return (
        <section className='section-register mt-5'>
            <Container>
                <Row className='justify-content-center'>
                    <Col xs={12} md={6}>
                        <h1>Register</h1>
                        <Form onSubmit={e => onSubmit(e)}>
                            <Form.Group controlId='registerUsername'>
                                <Form.Control
                                    type='text'
                                    required
                                    placeholder='Username'
                                    name='username'
                                    value={username}
                                    onChange={e => onChange(e)}
                                />
                            </Form.Group>
                            <Form.Group controlId='registerEmail'>
                                <Form.Control
                                    type='email'
                                    required
                                    placeholder='Email Address'
                                    name='email'
                                    value={email}
                                    onChange={e => onChange(e)}
                                />
                            </Form.Group>

                            <Form.Group controlId='registerPassword'>
                                <Form.Control
                                    type='password'
                                    required
                                    placeholder='Password'
                                    name='password'
                                    value={password}
                                    onChange={e => onChange(e)}
                                />
                            </Form.Group>
                            <Button variant='primary' type='submit'>
                                Sign Up
                            </Button>
                            <p className='mt-3'>
                                Already a member? <Link to='/login'>login</Link>
                            </p>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
