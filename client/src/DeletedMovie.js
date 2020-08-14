import React from 'react';
import { permDelete, recover } from "./actions";
import './DeletedMovieList.css';

class DeletedMovie extends React.Component {
  render() {
    const { movie } = this.props;
    let date_ob = new Date(movie.datedel);
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    if (hours < 10) {
      hours = "0" + hours;
    }
    let minutes = date_ob.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    let seconds = date_ob.getSeconds();
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return (
      <li>
        <div className="jumbotron col-sm-12 pull-center">
          <p>Title: {movie.name}</p>
          <p>Location: {movie.location}</p>
          <p>Bluray: {movie.bluray ? "Yes" : "No"} </p>
          <p>DVD: {movie.dvd ? "Yes" : "No"}</p>
          <p>Date Deleted: {year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds} </p>
          <button class="btn btn-primary rec" onClick={(e) => recover(movie._id)}> Recover </button>
          <button class="btn btn-primary del" onClick={(e) => permDelete(movie._id)}> Delete </button>
        </div>
      </li>
    );
  }
}
export default DeletedMovie;