import React, { Component } from 'react';
import BackgroundSoundPlayer from '../Player/Player';

class Article extends Component {
  render() {
    const resolveUrl = 'https://soundcloud.com/kosmetism/chronemics';
    const CLIENT_ID = '9wwOSWzjdxpbW1RCWC7Ti3hokI6jXhrs';
    return (
      <div className="Article">
        <div className="Article__Title">
          <h2>Article Title</h2>
        </div>
        <BackgroundSoundPlayer
          resolveUrl={resolveUrl}
          clientId={CLIENT_ID}
          onReady={() => {
            console.log('player url ready!');
          }}
        />
      </div>
    );
  }
}

export default Article;
