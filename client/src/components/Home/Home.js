import React, { Component } from 'react';
import Article from '../Article/Article';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="Home__Navbar">
          <h1 className="Home__Navbar__Title">MOONBOARD</h1>
        </div>
        <div className="Home__Body">
          <Article />
        </div>
      </div>
    );
  }
}

export default Home;
