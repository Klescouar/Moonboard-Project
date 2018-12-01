import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withSoundCloudAudio } from "react-soundplayer/addons";
import {
  PlayButton,
  Progress,
  VolumeControl
} from "react-soundplayer/components";

class BackgroundSoundPlayer extends Component {
  render() {
    const { duration, currentTime, article } = this.props;

    return (
      <div className="Player">
        <img
          className="Player__Image"
          src={require(`../../assets/images/${article.image}`)}
          alt="backgroundImage"
        />
        <div className="Player__Button">
          <PlayButton
            className={classNames({
              Player__Button__Play: true,
              paused: this.props.playing
            })}
            {...this.props}
          />
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
        <p className="Player__Description">
          <span className="Player__Description__Date">
            {article.date} - {article.time} :
          </span>{" "}
          <span className="Player__Description__Text">
            "{article.description}"
          </span>
        </p>
      </div>
    );
  }
}

BackgroundSoundPlayer.propTypes = {
  resolveUrl: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired
};

export default withSoundCloudAudio(BackgroundSoundPlayer);
