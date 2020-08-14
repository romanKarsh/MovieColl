import React from 'react';
import { logout, clearSearch, deleteLocation, addLocation } from "./actions";
import { Link } from "react-router-dom";

{ /* movies searched up will go in here */ }
class OptionsBar extends React.Component {
  constructor(props) {
    super(props);
  }
  logoutUser = () => {
    this.props.history.push("/");
    logout();
  };
  render() {
    const movies = this.props.movies;
    return (
      <div>
        <Link to="/deleted-movies" className="btn btn-primary headerBar col-sm-2"> View Deleted </Link>
        <Link to="/add-movie" className="btn btn-primary headerBar col-sm-2"> Add Movie </Link>
        <button className="btn btn-primary headerBar col-sm-2" onClick={addLocation}> Add Location </button>
        <button className="btn btn-primary headerBar col-sm-2" onClick={deleteLocation}> Delete Location </button>
        <button className="btn btn-primary headerBar col-sm-2" onClick={clearSearch}> Clear Search </button>
        <button className="btn btn-primary headerBar col-sm-2" onClick={this.logoutUser}> Log Out </button><br/><br/>
      </div>
    );
  }
}

export default OptionsBar;