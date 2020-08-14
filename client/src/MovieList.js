import React from 'react';
import Movie from './Movie';
import './MovieList.css';

{ /* movies searched up will go in here */}
class MovieList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const movies = this.props.movies;
    return (
      <div id="movies" className="container col-sm-12">
        <ul className="moviesList">
          { movies.map((movie) => {
            return( <Movie key={ movie._id } movie={ movie } /> );
          }) }
        </ul>
      </div>
    );
  }
}

export default MovieList;