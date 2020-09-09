import React from 'react';
import Header from './Header';
import { Link } from "react-router-dom";
import { getLocations, updateForm, updateCheckBox, addMovie, resetAddMovieForm } from "./actions";
import BaseReactComponent from "./BaseReactComponent";
import LocationList from './LocationList';

class AddMovie extends BaseReactComponent {
  filterState({ locationList, imdbInfo, movieList, addMovieForm }) {
    return { locationList, imdbInfo, movieList, addMovieForm };
  }

  constructor(props) {
    super(props);
    getLocations();
  }

  render() {
    const { locationList, addMovieForm } = this.state;
    return (
      <div className="container">
        <Header title="Add Movie" />
        <div className="container row">
          <div className="jumbotron col-sm-12 pull-center">
            <form onSubmit={e => addMovie(e)}>
              <input className="btn btn-primary" type="submit" value="Add Movie" />
              <input className="btn btn-primary" onClick={resetAddMovieForm} value="Clear Movie Form" />
              <Link to="/main" className="btn btn-primary"> Cancel </Link>
              <p>
                <label> Movie Name: </label>
                <br />
                <input className="addMovieForm" name="name" type="text"
                  value={addMovieForm.name} onChange={e => updateForm(e.target)} />
                <br />
                <label> Location: </label>
                <br />
                <LocationList classNam="addMovieForm" locations={locationList} val={addMovieForm.location} />
                {/*<select className="addMovieForm" id="locations"> </select> */}
                <br />
                <label> <input type="checkbox" checked={addMovieForm.bluray} className="addMovieForm"
                  onChange={e => updateCheckBox(e.target)} name="bluray" /> Bluray </label>
                <label> <input type="checkbox" checked={addMovieForm.dvd} className="addMovieForm"
                  onChange={e => updateCheckBox(e.target)} name="dvd" /> DVD </label>
                <br /> <br />
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AddMovie;