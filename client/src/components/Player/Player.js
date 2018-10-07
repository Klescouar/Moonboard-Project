import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withSoundCloudAudio } from 'react-soundplayer/addons';
import {
  PlayButton,
  Progress,
  VolumeControl
} from 'react-soundplayer/components';

class BackgroundSoundPlayer extends Component {
  render() {
    const { duration, currentTime, backgroundImage } = this.props;

    return (
      <div
        className="Player"
        style={{
          backgroundImage: `url(${require(`../../assets/images/${backgroundImage}`)})`
        }}
      >
        <div className="Player__Button">
          <PlayButton className="Player__Button__Play" {...this.props} />
          <div className="Player__Button__Gauge">
            <VolumeControl
              className="Player__Button__Gauge__Volume"
              {...this.props}
            />
            <Progress
              className="Player__Button__Gauge__Progress"
              value={(currentTime / duration) * 100 || 0}
              {...this.props}
            />
          </div>
        </div>
      </div>
    );
  }
}

BackgroundSoundPlayer.propTypes = {
  resolveUrl: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired
};

export default withSoundCloudAudio(BackgroundSoundPlayer);
