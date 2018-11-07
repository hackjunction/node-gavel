import React, { Component } from 'react';

/* Layouts */
import DefaultLayout from './layouts/DefaultLayout';
import AdminRoute from './layouts/AdminRoute';
import AnnotatorRoute from './layouts/AnnotatorRoute';

import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import Test from './pages/Test';

import CreateTeam from './pages/public/CreateTeam';
import Login from './pages/public/Login';
import HomePage from './pages/public/Home';

import AdminLogin from './pages/admin/Login';
import AdminEventList from './pages/admin/EventList';
import AdminCreateEvent from './pages/admin/CreateEvent';

import TeamDashboard from './pages/team/Dashboard';
import Vote from './pages/team/Vote';

import { Switch, Route } from 'react-router-dom';

import './styles/base.scss';

class App extends Component {
    render() {
        return (
            <Switch>
                {/* TODO: (Low priority) Public front page */}
                <DefaultLayout exact path="/" component={HomePage} />
                {/* Public Routes */}
                <DefaultLayout exact path="/login/:secret" component={Login} />
                <DefaultLayout exact path="/admin/login" component={AdminLogin} />
                <DefaultLayout exact path="/teams/create" component={CreateTeam} headerSubtitle="Submit your team" />
                {/* TODO: (Low priority) Public route for viewing submitted projects of event */}
                <DefaultLayout path="/event/:id" component={null} />

                {/* Accessible with annotator token */}

                {/* TODO: Team dashboard */}
                <AnnotatorRoute exact path="/dashboard" component={TeamDashboard} headerSubtitle="Team Dashboard" />

                {/* TODO: Voting frontend */}
                <AnnotatorRoute exact path="/vote" component={Vote} headerSubtitle="Voting" />

                {/* Admin Routes */}

                <AdminRoute exact path="/admin" component={AdminEventList} />
                <AdminRoute
                    exact
                    path="/admin/edit/new"
                    component={AdminCreateEvent}
                    headerSubtitle={'GOD MODE / Create event'}
                />
                {/* TODO: Admin route for editing event by id */}
                <AdminRoute path="/admin/edit/:id" component={AdminCreateEvent} />

                {/* TODO: Admin route for viewing results of event by id */}
                <AdminRoute path="/admin/event/:id" component={AdminPanel} />

                {/* Old routes */}
                <Route exact path="/old/admin" component={AdminPanel} />
                <Route exact path="/old/admin/test" component={Test} />

                {/* Misc Routes */}
                <Route component={NotFound} />
            </Switch>
        );
    }
}

export default App;
