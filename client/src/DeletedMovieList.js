import React from 'react';
import DeletedMovie from './DeletedMovie';
import './DeletedMovieList.css';

{ /* movies searched up will go in here */}
class DeletedMovieList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const movies = this.props.movies;
    return (
      <div id="mainDiv" class="container row">
        <ul className="col-sm-12 pull-center moviesList">
          { movies.map((movie) => {
            return( <DeletedMovie key={ movie._id } movie={ movie } /> );
          }) }
        </ul>
      </div>
    );
  }
}

export default DeletedMovieList;