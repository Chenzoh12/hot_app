import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
//import Login from './components/Login';
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
      <section className="App">
        <nav className='navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0'>
          <h1 className='navbar-brand col-sm-3 col-md-2 mr-0'>H.O.T</h1>
        </nav>
        <div className='container-fluid'>
          <div className='row'>
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
              <div className="sidebar-sticky">
                <ul className="nav flex-column">

                  <li className="nav-item">
                    <Link to='/dashboard'>
                      <h3 style={{display: 'block', color: 'black'}}className='nav-link active'>Dashboard</h3>
                    </Link>
                  </li>
                  
                  <li className="nav-item">
                    <Link to='/accounts'>
                      <h3 style={{display: 'block', color: 'black'}}className='nav-link active'>Accounts</h3>
                    </Link>
                  </li>
                  
                  <li className="nav-item">
                    <Link to='/assets'>
                      <h3 style={{display: 'block', color: 'black'}}className='nav-link active'>Assets</h3>
                    </Link>
                  </li>
                  
                  <li className="nav-item">
                    <Link to='/inventory'>
                      <h3 style={{display: 'block', color: 'black'}}className='nav-link active'>Inventory</h3>
                    </Link>
                  </li>
                  
                  <li className="nav-item">
                    <Link to='/purchases'>
                      <h3 style={{display: 'block', color: 'black'}}className='nav-link active'>Purchases</h3>
                    </Link>
                  </li>
                  
                  <li className="nav-item">
                    <Link to='/routes'>
                      <h3 style={{display: 'block', color: 'black'}}className='nav-link active'>Routes</h3>
                    </Link>
                  </li>
                  
                  <li className="nav-item">
                    <Link to='/trips'>
                      <h3 style={{display: 'block', color: 'black'}}className='nav-link active'>Trips</h3>
                    </Link>
                  </li>

                </ul>
              </div>
            </nav>
          
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
              <div>
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/inventory" component={Inventory} />
                <Route exact path="/accounts" component={Accounts} />
                <Route exact path="/assets" component={Assets} />
                <Route exact path="/routes" component={Routes} />
                <Route exact path="/trips" component={Trips} />
                <Route exact path="/purchases" component={Purchases} />
              </div>
            </main>
          </div>
        </div>
      </section>
    );
  }
}

export default App;
