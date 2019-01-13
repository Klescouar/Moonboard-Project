import React, { Component } from "react";
import Lightbox from "react-image-lightbox";
import PropTypes from "prop-types";
import classNames from "classnames";
import TruncateMarkup from "react-truncate-markup";
import { withSoundCloudAudio } from "react-soundplayer/addons";
import {
  PlayButton,
  Progress,
  VolumeControl
} from "react-soundplayer/components";

class BackgroundSoundPlayer extends Component {
  state = { shouldTruncate: true, isOpen: false, imgSrc: "" };

  toggleTruncate = () => {
    this.setState(state => ({ shouldTruncate: !state.shouldTruncate }));
  };

  render() {
    const { duration, currentTime, article } = this.props;
    const { isOpen, imgSrc } = this.state;
    const readMoreEllipsis = (
      <span>
        {" "}
        <span className="ReadMore" onClick={this.toggleTruncate}>
          Read more
        </span>
      </span>
    );

    return (
      <div className="Player">
        {isOpen && (
          <Lightbox
            mainSrc={imgSrc}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
        <figure className="snip1577">
          <img
            className="Player__Image"
            src={require(`../../assets/images/${article.image}`)}
            alt="backgroundImage"
            onClick={() =>
              this.setState({
                isOpen: true,
                imgSrc: require(`../../assets/images/${article.image}`)
              })
            }
          />
          <figcaption>
            <h3>{article.place}</h3>
            <p>
              {article.date} {article.time}
            </p>
          </figcaption>
        </figure>
        <div className="Player__Bottom">
          <div className="Player__Bottom__Button">
            <PlayButton
              className={classNames({
                Player__Bottom__Button__Play: true,
                paused: this.props.playing
              })}
              {...this.props}
            />
            <div className="Player__Bottom__Button__Gauge">
              <VolumeControl
                className="Player__Bottom__Button__Gauge__Volume"
                {...this.props}
              />
              <Progress
                className="Player__Bottom__Button__Gauge__Progress"
                value={(currentTime / duration) * 100 || 0}
                {...this.props}
              />
            </div>
          </div>
          <span className="Player__Bottom__Description__Date">
            {article.date} - {article.time} :
          </span>{" "}
          {this.state.shouldTruncate ? (
            <TruncateMarkup lines={2} ellipsis={readMoreEllipsis}>
              <div className="Player__Bottom__Description__Text">
                {article.description}
              </div>
            </TruncateMarkup>
          ) : (
            <div className="Player__Bottom__Description__Text">
              {article.description}
              <span className="ReadMore" onClick={this.toggleTruncate}>
                {"Show less"}
              </span>
            </div>
          )}
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
