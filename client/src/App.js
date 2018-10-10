import React, { Component } from 'react';

/* Layouts */
import DefaultLayout from './layouts/DefaultLayout';
import AdminRoute from './layouts/AdminRoute';
import AnnotatorRoute from './layouts/AnnotatorRoute';

import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import Test from './pages/Test';

import CreateTeam from './pages/public/CreateTeam';

import AdminLogin from './pages/admin/Login';
import AdminEventList from './pages/admin/EventList';
import AdminCreateEvent from './pages/admin/CreateEvent';

import TeamDashboard from './pages/team/Dashboard';
import TeamSubmission from './pages/team/Submission';

import { Switch, Route } from 'react-router-dom';

import './styles/base.scss';

class App extends Component {
    render() {
        return (
            <Switch>
                {/* Public Routes */}
                <DefaultLayout exact path="/login" component={AdminLogin} />
                <DefaultLayout exact path="/teams/create" component={CreateTeam} headerSubtitle="Submit your team" />
                {/* TODO: (Low priority) Public route for viewing submitted projects of event */}
                <DefaultLayout path="/event/:id" component={null} />

                {/* TODO: (Low priority) Public front page */}
                <DefaultLayout exact path="/" component={null} />

                {/* Accessible with annotator token */}

                {/* TODO: Team dashboard */}
                <AnnotatorRoute exact path="/teams/:secret" component={TeamDashboard} />

                {/* TODO: Team submission (create/edit) */}
                <DefaultLayout exact path="/teams/:secret/submission" component={TeamSubmission} />

                {/* TODO: Voting frontend */}
                <DefaultLayout exact path="/vote/:secret" component={null} />

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
                <AdminRoute path="/admin/event/:id" component={null} />

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
