import React, { Component } from "react";
import classNames from "classnames";
import ScrollableAnchor from "react-scrollable-anchor";
import { Query } from "react-apollo";
import Article from "../Article/Article";
import { GET_ARTICLES } from "../../queries";

class Home extends Component {
  state = {
    isTop: true
  };

  componentDidMount() {
    document.addEventListener("scroll", () => {
      const isTop = window.scrollY < window.innerHeight + 70;
      if (isTop !== this.state.isTop) {
        this.setState({ isTop });
      }
    });
  }

  render() {
    const { isTop } = this.state;
    return (
      <div className="Home">
        <div id="wrapper">
          <h1 className="Home__Title">MOONBOARD</h1>
          <div id="featured">
            <video poster="assets/poster.jpg" autoplay="true" muted="true" loop>
              <source
                src={require(`../../assets/videos/travel.mp4`)}
                type="video/mp4"
              />
            </video>
          </div>
        </div>
        <Query query={GET_ARTICLES}>
          {({ data, loading, error }) => {
            if (loading) return <div>LOADING...</div>;
            if (error) return <div>Error</div>;
            return (
              <ScrollableAnchor id="Home">
                <div
                  className={classNames({
                    Home__Body: true,
                    "Home__Body--fixed": !isTop
                  })}
                >
                  <div
                    className={classNames({
                      Home__Body__CountryList: true,
                      "Home__Body__CountryList--fixed": !isTop
                    })}
                  >
                    <img
                      className="Home__Body__CountryList__Icon"
                      src={require(`../../assets/icons/back.png`)}
                      alt="Arrow"
                    />
                    {data.getArticles.map((articleByCountry, index) => (
                      <a
                        className="Home__Body__CountryList__Country"
                        href={`#${articleByCountry.country.country}`}
                        key={articleByCountry.country._id}
                      >
                        {articleByCountry.country.country.toUpperCase()}
                        {index !== data.getArticles.length - 1 &&
                          data.getArticles.length - 1 !== 1 && (
                            <p className="Home__Body__CountryList__Country__Separator">
                              |
                            </p>
                          )}
                      </a>
                    ))}
                    <img
                      className="Home__Body__CountryList__Icon"
                      src={require(`../../assets/icons/arrow.png`)}
                      alt="Arrow"
                    />
                  </div>
                  {data.getArticles.map(articleByCountry => (
                    <ScrollableAnchor
                      id={`${articleByCountry.country.country}`}
                      key={articleByCountry.country._id}
                    >
                      <div className="Home__Body__Country">
                        <div className="Home__Body__Country__Header">
                          <h1>
                            {articleByCountry.country.country.toUpperCase()}
                          </h1>
                          <p>{articleByCountry.country.description}</p>
                        </div>
                        {!articleByCountry.articles.length && (
                          <p>
                            <strong>You have not added any articles yet</strong>
                          </p>
                        )}
                        {articleByCountry.articles.map(article => (
                          <Article key={article._id} article={article} />
                        ))}
                      </div>
                    </ScrollableAnchor>
                  ))}
                </div>
              </ScrollableAnchor>
            );
          }}
        </Query>
        {!isTop && (
          <a className="Home__FloatingButton" href="#Home">
            <img
              className="Home__FloatingButton__Icon"
              src={require(`../../assets/icons/up.png`)}
              alt="ArrowUp"
            />
          </a>
        )}
      </div>
    );
  }
}

export default Home;
