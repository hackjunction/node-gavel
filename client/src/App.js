import React, { Component } from 'react';

/* Layouts */
import DefaultLayout from './layouts/DefaultLayout';
import AdminRoute from './layouts/AdminRoute';

import AdminPanel from './pages/AdminPanel';
import CreateTeam from './pages/CreateTeam';
import NotFound from './pages/NotFound';
import Test from './pages/Test';

import AdminLogin from './pages/admin/Login';
import AdminEventList from './pages/admin/EventList';
import AdminCreateEvent from './pages/admin/CreateEvent';

import { Switch, Route } from 'react-router-dom';

import './styles/base.scss';

class App extends Component {
    render() {
        return (
            <Switch>
                {/* Public Routes */}
                <Route exact path="/teams/create" component={CreateTeam} />
                <DefaultLayout exact path="/login" component={AdminLogin} />
                {/* Admin Routes */}

                <AdminRoute exact path="/admin" component={AdminEventList} />
                <AdminRoute
                    exact
                    path="/admin/edit/new"
                    component={AdminCreateEvent}
                    headerSubtitle={'GOD MODE / Create event'}
                />
                {/* TODO */}
                <DefaultLayout path="/admin/edit/:eventId" component={AdminCreateEvent} />
                <Route exact path="/old/admin" component={AdminPanel} />
                <Route exact path="/old/admin/test" component={Test} />

                {/* Misc Routes */}
                <Route component={NotFound} />
            </Switch>
        );
    }
}

export default App;
