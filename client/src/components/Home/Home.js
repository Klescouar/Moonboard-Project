import React, { Component } from "react";
import { Query } from "react-apollo";
import Article from "../Article/Article";
import { GET_ARTICLES } from "../../queries";

class Home extends Component {
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
              <div className="Home__Body">
                {data.getArticles.map(articleByChapter => (
                  <div
                    className="Home__Body__Chapter"
                    key={articleByChapter.chapter._id}
                  >
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
