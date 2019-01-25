import React, { Component } from 'react';
import './App.css';
import Users from './components/Users';
import Login from './components/Login';
import { Route, NavLink } from 'react-router-dom';
class App extends Component {
  render() {
    return (
      <>
        <header>
          <nav>
            <NavLink to="/login">Login</NavLink>
            &nbsp;|&nbsp;
            <NavLink to="/users">Users</NavLink>
            <button onClick={this.signout}>Sign Out</button>
          </nav>
        </header>

        <main>
          <Route path="/login" component={Login} />
          <Route path="/users" component={Users} />
        </main>
      </>
    );
  }
  signout = () => {
    localStorage.removeItem('jwt');
  };
}

export default App;
