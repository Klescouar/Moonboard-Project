import React, { Component } from "react";
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
      const isTop = window.scrollY < window.innerHeight;
      if (isTop !== this.state.isTop) {
        this.setState({ isTop });
      }
    });
  }

  romanize = num => {
    if (isNaN(num)) return NaN;
    var digits = String(+num).split(""),
      key = [
        "",
        "C",
        "CC",
        "CCC",
        "CD",
        "D",
        "DC",
        "DCC",
        "DCCC",
        "CM",
        "",
        "X",
        "XX",
        "XXX",
        "XL",
        "L",
        "LX",
        "LXX",
        "LXXX",
        "XC",
        "",
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX"
      ],
      roman = "",
      i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
  };

  render() {
    return (
      <div className="Home">
        <div className="Home__Presentation">
          <h1 className="Home__Presentation__Title">MOONBOARD</h1>
        </div>
        <Query query={GET_ARTICLES}>
          {({ data, loading, error }) => {
            if (loading) return <div>LOADING...</div>;
            if (error) return <div>Error</div>;
            return (
              <ScrollableAnchor id="Home">
                <div className="Home__Body">
                  <div className="Home__Body__ChapterList">
                    <img
                      className="Home__Body__ChapterList__Icon"
                      src={require(`../../assets/icons/back.png`)}
                      alt="Arrow"
                    />
                    {data.getArticles.map((articleByChapter, index) => (
                      <a
                        className="Home__Body__ChapterList__Chapter"
                        href={`#chapter${articleByChapter.chapter.number}`}
                        key={articleByChapter.chapter._id}
                      >
                        CHAPITRE{" "}
                        {this.romanize(articleByChapter.chapter.number)}
                        {index !== data.getArticles.length - 1 &&
                          data.getArticles.length - 1 !== 1 && (
                            <p className="Home__Body__ChapterList__Chapter__Separator">
                              |
                            </p>
                          )}
                      </a>
                    ))}
                    <img
                      className="Home__Body__ChapterList__Icon"
                      src={require(`../../assets/icons/arrow.png`)}
                      alt="Arrow"
                    />
                  </div>
                  {data.getArticles.map(articleByChapter => (
                    <ScrollableAnchor
                      id={`chapter${articleByChapter.chapter.number}`}
                      key={articleByChapter.chapter._id}
                    >
                      <div className="Home__Body__Chapter">
                        <div className="Home__Body__Chapter__Header">
                          <h1>
                            CHAPITRE{" "}
                            {this.romanize(articleByChapter.chapter.number)}
                          </h1>
                          <p>{articleByChapter.chapter.description}</p>
                        </div>
                        {!articleByChapter.articles.length && (
                          <p>
                            <strong>You have not added any articles yet</strong>
                          </p>
                        )}
                        {articleByChapter.articles.map(article => (
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
        {!this.state.isTop && (
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
