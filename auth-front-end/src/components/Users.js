import React from 'react';
import axios from 'axios';

class Users extends React.Component {
  state = {
    users: []
  };

  async componentDidMount() {
    const endpoint = `${process.env.REACT_APP_API_URL}/users`;

    try {
      const token = localStorage.getItem('jwt');
      const requestOptions = {
        headers: {
          authorization: token
        }
      };
      const response = await axios.get(endpoint, requestOptions);
      console.log('endpoint', endpoint);

      this.setState({ users: response.data.users });
    } catch (error) {
      console.error("we couldn't get those users");
    }
  }

  render() {
    return (
      <>
        <h2>List of sexy users!</h2>

        <ul>
          {this.state.users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </>
    );
  }
}

export default Users;
