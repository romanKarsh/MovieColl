import React from 'react';

{ /* imdb info from movies searched up will go in here */}
class ImdbInfo extends React.Component {
  render() {
    const { info } = this.props;
    return (
      <div id="imdbInfo" className="col-sm-6 jumbotron pull-center">
        { /* imdb info from movies searched up will go in here */}
        {"Title: " + info.Title}
        <br />
        {"Year: " + info.Year}
        <br />
        {"Runtime: " + info.Runtime}
        <br />
        {"Genre: " + info.Genre}
        <br />
        {"Director: " + info.Director}
        <br />
        {"Actors: " + info.Actors}
        <br />
        {"imdbRaiting: " + info.imdbRating}
      </div>
    );
  }
}
export default ImdbInfo;