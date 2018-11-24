import React, { Component } from 'react';

/* Layouts */
import DefaultLayout from './layouts/DefaultLayout';
import AdminRoute from './layouts/AdminRoute';
import AnnotatorRoute from './layouts/AnnotatorRoute';

import NotFound from './pages/NotFound';

import Login from './pages/public/Login';
import HomePage from './pages/public/Home';
import ChallengePage from './pages/public/ChallengePage';
import Test from './pages/public/Test';

import AdminLogin from './pages/admin/Login';
import AdminEventList from './pages/admin/EventList';
import AdminCreateEvent from './pages/admin/CreateEvent';
import AdminEventDetail from './pages/admin/EventDetail';

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
                <DefaultLayout exact path="/login/:secret" component={Login} headerSubtitle="Login" />
                <DefaultLayout exact path="/admin/login" component={AdminLogin} headerSubtitle="Login" />
                <DefaultLayout path="/events/:eventId/c/:secret" component={ChallengePage} headerSubtitle="" />
                {/* <DefaultLayout exact path="/teams/create" component={CreateTeam} headerSubtitle="Submit your team" /> */}
                {/* TODO: (Low priority) Public route for viewing submitted projects of event */}
                <DefaultLayout path="/event/:id" component={null} />
                <DefaultLayout path="/test" component={Test} />

                {/* Accessible with annotator token */}
                <AnnotatorRoute exact path="/dashboard" component={TeamDashboard} headerSubtitle="Team Dashboard" />
                <AnnotatorRoute exact path="/vote" component={Vote} headerSubtitle="Voting" hasBack={true} backTo="/dashboard" backText="Dashboard" />

                {/* Admin Routes */}
                <AdminRoute exact path="/admin" component={AdminEventList} />
                <AdminRoute exact path="/admin/edit/new" component={AdminCreateEvent} headerSubtitle={'Create event'} hasBack={true} backTo="/admin" backText="Event list" />
                <AdminRoute path="/admin/edit/:id" component={AdminCreateEvent} headerSubtitle={'Edit event'} hasBack={true} backTo="/admin" backText="Event list" />
                <AdminRoute path="/admin/event/:id" component={AdminEventDetail} headerSubtitle={'Event Detail'} hasBack={true} backTo="/admin" backText="Event list" />

                {/* Misc Routes */}
                <DefaultLayout component={NotFound} headerSubtitle="404" />
            </Switch>
        );
    }
}

export default App;
