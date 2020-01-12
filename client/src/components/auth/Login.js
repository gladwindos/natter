import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { login } from '../../actions/auth';

export const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { username, password } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async e => {
        e.preventDefault();

        login(username, password);
    };

    if (isAuthenticated) {
        return <Redirect to='/' />;
    }

    return (
        <section className='section-login mt-5'>
            <Container>
                <Row className='justify-content-center'>
                    <Col xs={12} md={6}>
                        <h1>Login</h1>
                        <Form onSubmit={e => onSubmit(e)}>
                            <Form.Group controlId='loginUsername'>
                                <Form.Control
                                    type='text'
                                    required
                                    placeholder='Username'
                                    name='username'
                                    value={username}
                                    onChange={e => onChange(e)}
                                />
                            </Form.Group>
                            <Form.Group controlId='loginPassword'>
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
                                Login
                            </Button>
                            <p className='mt-3'>
                                Don't have an account?{' '}
                                <Link to='/register'>Sign Up</Link>
                            </p>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
