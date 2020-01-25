import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { logout } from '../../actions/auth';

const Navigation = ({ auth: { isAuthenticated, loading, user }, logout }) => {
    const handleLogout = e => {
        e.preventDefault();

        logout();
    };

    const authLinks = (
        <Fragment>
            <Nav.Link href='/feed'>Feed</Nav.Link>
            {user && user.username && (
                <Nav.Link href={'/profile/' + user.username}>Profile</Nav.Link>
            )}
            <Nav.Link href='/new-post/'>New Post</Nav.Link>
            <Nav.Link href='/#!' onClick={handleLogout}>
                Logout
            </Nav.Link>
        </Fragment>
    );
    const guestLinks = (
        <Fragment>
            <Nav.Link href='/register'>Register</Nav.Link>
            <Nav.Link href='/login'>Login</Nav.Link>
        </Fragment>
    );

    return (
        <Navbar bg='light' variant='light' expand='lg'>
            <Navbar.Brand href='/'>natter</Navbar.Brand>
            <Navbar.Toggle aria-controls='navbar-nav' />
            <Navbar.Collapse id='navbar-nav'>
                <Nav className='mr-auto'>
                    <Nav.Link href='/'>Explore</Nav.Link>
                    {!loading && (
                        <Fragment>
                            {isAuthenticated ? authLinks : guestLinks}
                        </Fragment>
                    )}
                </Nav>
                <Form inline>
                    <FormControl
                        type='text'
                        placeholder='Search'
                        className='mr-sm-2'
                    />
                    <Button variant='outline-info'>Search</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
};

Navigation.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navigation);
