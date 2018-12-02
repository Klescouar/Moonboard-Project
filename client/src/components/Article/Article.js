import React, { Component } from "react";
import BackgroundSoundPlayer from "../Player/Player";

class Article extends Component {
  render() {
    const CLIENT_ID = "9wwOSWzjdxpbW1RCWC7Ti3hokI6jXhrs";
    const resolveUrl = this.props.article.link;
    return (
      <div className="Article">
        <BackgroundSoundPlayer
          resolveUrl={resolveUrl}
          clientId={CLIENT_ID}
          article={this.props.article}
        />
      </div>
    );
  }
}

export default Article;
