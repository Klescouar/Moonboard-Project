import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Article from '../Article/Article';
import { GET_ARTICLES } from '../../queries';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="Home__Navbar">
          <h1 className="Home__Navbar__Title">MOONBOARD</h1>
        </div>
        <Query query={GET_ARTICLES}>
          {({ data, loading, error }) => {
            if (loading) return <div>LOADING...</div>;
            if (error) return <div>Error</div>;
            return (
              <div className="Home__Body">
                {!data.getArticles.length && (
                  <p>
                    <strong>You have not added any articles yet</strong>
                  </p>
                )}
                {data.getArticles.map(article => (
                  <Article key={article._id} article={article} />
                ))}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Home;
