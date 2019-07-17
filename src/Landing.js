import React from 'react';
import Login from './Login';
import SignUp from './SignUp';

class Landing extends React.Component {
  render() {
    return (
      <div>
        <h3>Landing</h3>
        <Login 
          loginUser={this.props.loginUser}
        />
      </div>
    )
  }
}

export default Landing;