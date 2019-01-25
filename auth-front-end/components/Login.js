import React from 'react';
import axios from 'axios';

class Login extends React.Component {
  state = {
    username: 'kai',
    password: 'pass'
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
        <div>
          <button type="submit">Login!</button>
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
    const endpoint = `${process.env.REACT_APP_API_URL}/login`;

    axios
      .post(endpoint, this.state)
      .then(res => {
        localStorage.setItem('jwt', res.data.token);
      })
      .catch(err => console.log(err));
  };
}

export default Login;
