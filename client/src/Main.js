import React from 'react';
import Header from './Header';
import MovieList from './MovieList';
import ImdbInfo from './ImdbInfo';
import SearchBar from './SearchBar';
import OptionsBar from './OptionsBar';
import { getLocations } from "./actions";
import BaseReactComponent from "./BaseReactComponent";
import './Main.css';

class Main extends BaseReactComponent {
  filterState({ imdbInfo, movieList }) {
    return { imdbInfo, movieList };
  }

  constructor(props) {
    super(props);
    this.props.history.push("/main");
    getLocations();
  }

  render() {
    const { imdbInfo, movieList } = this.state;
    const { history } = this.props;
    return (
      <div className="container">
        <Header title="Main Dashboard" />
        <OptionsBar history={history} />
        <div className="jumbotron col-sm-12 pull-center">
          <SearchBar />
          {JSON.stringify(imdbInfo) !== '{}' && <ImdbInfo info={imdbInfo} />}
        </div>
        <MovieList movies={movieList} />
      </div>
    );
  }
}

export default Main;