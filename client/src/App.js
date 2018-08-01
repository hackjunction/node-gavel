import React, { Component } from 'react';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import Test from './pages/Test';
import Header from './components/Header';
import Footer from './components/Footer';

import { Switch, Route } from 'react-router-dom';

import './App.css';

class App extends Component {

  render() {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="page-content">
          <Switch>
            <Route exact path='/' component={AdminPanel} />
            <Route exact path='/test' component={Test} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;