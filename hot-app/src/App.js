import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Accounts from './components/Accounts';
import Assets from './components/Assets';
import Routes from './components/Routes';
import Trips from './components/Trips';
import Purchases from './components/Purchases';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <Link to='/dashboard'>Dashboard</Link>
          <Link to='/inventory'>Inventory</Link>
          <Link to='/accounts'>Accounts</Link>
          <Link to='/assets'>Assets</Link>
          <Link to='/routes'>Routes</Link>
          <Link to='/trips'>Trips</Link>
          <Link to='/purchases'>Purchases</Link>
        </header>
        
        <main>
          <Route exact path="/" component={Login} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/inventory" component={Inventory} />
          <Route exact path="/accounts" component={Accounts} />
          <Route exact path="/assets" component={Assets} />
          <Route exact path="/routes" component={Routes} />
          <Route exact path="/trips" component={Trips} />
          <Route exact path="/purchases" component={Purchases} />
        </main>
      </div>
    );
  }
}

export default App;

/* Route to your components
        <main>
          <Route exact path="/" component={Landing} />
          <Route path="/library" component={Library} />
        
        
        </main> */