import React from 'react';
import Header from './Header';
import DeletedMovieList from './DeletedMovieList';
import BaseReactComponent from "./BaseReactComponent";
import { getDeletedMovies } from "./actions";
import { Link } from "react-router-dom";
import './DeletedMovies.css';

class DeletedMovies extends BaseReactComponent {
  filterState({ deletedMovieList }) {
    return { deletedMovieList };
  }
  constructor(props) {
    super(props);
    getDeletedMovies();// get deleted movies
  }
  render() {
    const { deletedMovieList } = this.state;
    return (
      <div className="container">
        <Header title="Deleted Movies" />
        <Link to="/main" className="btn btn-primary ret"> Return </Link> <br /><br />
        <DeletedMovieList movies={deletedMovieList} />
      </div>
    );
  }
}

export default DeletedMovies;