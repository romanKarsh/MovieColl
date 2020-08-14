import React from 'react';
import { imdbSearch, softDelete } from "./actions";
import './MovieList.css';

class Movie extends React.Component {
  render() {
    const { movie } = this.props;
    return (
      <li className="movieList">
        {"Title: " + movie.name}
        <button className="imdb" onClick={(e) => imdbSearch(movie.name)}> IMDB </button><br />
        {"Location: " + movie.location}<br />
        {"Bluray: " + (movie.bluray ? "Yes" : "No")}
        <button className="delete" onClick={(e) => softDelete(movie._id)}> Delete </button><br />
        {"DVD: " + (movie.dvd ? "Yes" : "No")}
      </li>
    );
  }
}
export default Movie;