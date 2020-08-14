/* New cleaned up version of App.js */
import React from 'react';

// Importing react-router-dom to use the React Router
import './App.css';
import { Route, Switch, BrowserRouter } from "react-router-dom";
import BaseReactComponent from "./BaseReactComponent";
import DeletedMovies from './DeletedMovies';
import AddMovie from './AddMovie';
import Header from './Header';
import Login from './Login';
import Main from './Main';
import { readCookie } from "./actions";

class App extends BaseReactComponent {
  // Access the global state paths
  filterState({ currentUser, cookie }) {
    return { currentUser, cookie };
  }

  constructor(props) {
    super(props);
    readCookie();
  }

  render() {
    const { currentUser, cookie } = this.state;
    if( cookie === false) {
      return (<div className="container"> <Header title="Loading" /> </div>);
    }
    // console.log(currentUser);
    return (
      <BrowserRouter>
        <Switch> {/* Similar to a switch statement - shows the component depending on the URL path */}
          <Route exact path={"/deleted-movies"} render={({ history }) => (!currentUser ? <Login history={history} /> : <DeletedMovies history={history} />)} />
          <Route exact path={"/add-movie"} render={({ history }) => (!currentUser ? <Login history={history} /> : <AddMovie history={history} />)} />
          <Route exact path={["/", "/login", "/main"]} render={({ history }) => (!currentUser ? <Login history={history} /> : <Main history={history} />)} />
          <Route render={() => <div className="container"> <Header title="404 Not found" /> </div>} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;