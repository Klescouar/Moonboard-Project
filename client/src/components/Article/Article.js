import React, { Component } from 'react';
import BackgroundSoundPlayer from '../Player/Player';

class Article extends Component {
  render() {
    const CLIENT_ID = '9wwOSWzjdxpbW1RCWC7Ti3hokI6jXhrs';
    const resolveUrl = this.props.article.link;
    return (
      <div className="Article">
        <div className="Article__Title">
          <p>{this.props.article.title}</p>
        </div>
        <BackgroundSoundPlayer
          resolveUrl={resolveUrl}
          clientId={CLIENT_ID}
          backgroundImage={this.props.article.image}
          onReady={() => {
            console.log('player url ready!');
          }}
        />
      </div>
    );
  }
}

export default Article;
