import React from 'react';
import LocationList from './LocationList';
import { updateForm, updateCheckBox, movieSearch, locationSearch } from "./actions";
import BaseReactComponent from "./BaseReactComponent";
import './SearchBar.css';

class SearchBar extends BaseReactComponent {
  filterState({ movieForm, locationForm, locationList }) {
    return { movieForm, locationForm, locationList };
  }
  render() {
    const { movieForm, locationForm, locationList } = this.state;
    return (
      <div className="col-sm-6">
        <p> Search for a Movie </p>
        <input className="movieForm" name="name" type="text"
          value={movieForm.name} onChange={e => updateForm(e.target)} />
        <LocationList classNam="movieForm" locations={locationList} val={movieForm.location} /><br />
        <label className="movieForm"> <input type="checkbox" name="bluray" checked={movieForm.bluray} className="movieForm"
          onChange={e => updateCheckBox(e.target)} /> Bluray </label>
        <label className="movieForm"> <input type="checkbox" name="dvd" checked={movieForm.dvd} className="movieForm"
          onChange={e => updateCheckBox(e.target)} /> DVD </label><br />
        <button id="searchMovieBtn" onClick={movieSearch}> Search Movie</button>
        <br /><br />
        <p> Search by Location </p>
        <LocationList classNam="locationForm" locations={locationList} val={locationForm.location} /><br />
        <button id="searchLocationBtn" onClick={locationSearch}> Search by location </button>
      </div>
    );
  }
}
export default SearchBar;