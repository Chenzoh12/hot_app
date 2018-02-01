import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Accounts from './components/Accounts';
import fire from './fire';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <Link to='/dashboard'>Dashboard</Link>
          <Link to='/inventory'>Inventory</Link>
          <Link to='/accounts'>Account Management</Link>
        </header>
        
        <main>
          <Route exact path="/" component={Login} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/inventory" component={Inventory} />
          <Route exact path="/accounts" component={Accounts} />
        </main>
        
        <h1>Test</h1>
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