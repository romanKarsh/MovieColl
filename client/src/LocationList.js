import React from 'react';
import { updateForm } from "./actions";
import './SearchBar.css';

{ /* movies searched up will go in here */}
class MovieList extends React.Component {
  render() {
    const {locations, classNam, val} = this.props;
    return (
      <select className={classNam} name="location" value={val} onChange={e => updateForm(e.target)}>
        { locations.map((location) => <option value={location}>{location}</option> ) }
      </select>
    );
  }
}

export default MovieList;