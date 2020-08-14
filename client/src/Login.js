import React from 'react';
import Header from './Header';
import { updateLoginForm, login } from "./actions";
import BaseReactComponent from "./BaseReactComponent";

class Login extends BaseReactComponent {
  filterState({ loginForm }) {
    return { loginForm };
  }

  constructor(props) {
    super(props);
    this.props.history.push("/");
  }
  render() {
    const { loginForm } = this.state;
    return (
      <div className="container">
        <Header title="Authentication" />
        <div className="container row align-self-center">
          <div className="jumbotron col-sm-4">
            <form onSubmit={e => login(e)}>
              <div>
                <label>Name:</label> <br />
                <input type="text"
                  name="name"
                  value={loginForm.name}
                  onChange={e => updateLoginForm(e.target)} />
              </div>
              <div>
                <label>Password:</label> <br />
                <input type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={e => updateLoginForm(e.target)} />
              </div> <br />
              <div>
                <input className="btn btn-primary" type="submit" value="Log In" />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;