import React from 'react';
import axios from 'axios';

class Login extends React.Component {
  state = {
    username: '', // email
    password: '',
    //department: '',
    errorMsg: null
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Username</label>
          <input
            name="username"
            value={this.state.username}
            type="text"
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <label>Password</label>

          <input
            name="password"
            value={this.state.password}
            type="password"
            onChange={this.handleInputChange}
          />
        </div>
        {/* 
        <div>
          <label>Department</label>
          <input
            name="department"
            value={this.state.department}
            type="text"
            onChange={this.handleInputChange}
          />
        </div> */}
        {this.state.errorMsg && <p>Error: {this.state.errorMsg}</p>}

        <div>
          <button type="submit">Login!</button>
        </div>
        <div>
          <button onClick={this.handleSignup}>Register!</button>
        </div>
      </form>
    );
  }
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const endpoint = `${process.env.REACT_APP_API_URL}/login`; // put in the api url

    axios
      .post(endpoint, this.state)
      .then(res => {
        localStorage.setItem('jwt', res.data.token);
        this.props.history.push('/');
      })
      .catch(err => console.log(err));
  };

  handleSignup = event => {
    event.preventDefault();

    axios
      .post('http://localhost:5000/register', {
        // this was a mistake, but you can do it this way
        username: this.state.username,
        password: this.state.password,
        name: 'sawyer'
        //department: this.state.department
      })
      .then(res => {
        localStorage.setItem('jwt', res.data.token);

        this.props.history.push('/');
      })
      .catch(err => this.setState({ errorMsg: 'lol try again nub' }));
  };
}

export default Login;
