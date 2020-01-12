import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Navigation from './components/layout/Navigation';
import Feed from './components/feed/Feed';
import Explore from './components/explore/Explore';
import Profile from './components/profile/Profile';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import AlertCustom from './components/layout/AlertCustom';
import './App.css';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navigation />
                    <AlertCustom />
                    <Switch>
                        <Route exact path='/' component={Feed} />
                        <Route exact path='/explore' component={Explore} />
                        <Route exact path='/profile' component={Profile} />
                        <Route exact path='/register' component={Register} />
                        <Route exact path='/login' component={Login} />
                    </Switch>
                </Fragment>
            </Router>
        </Provider>
    );
};

export default App;
