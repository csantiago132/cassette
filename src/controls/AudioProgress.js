import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import classNames from 'classnames';

import convertToTime from '../utils/convertToTime';
import getDisplayText from '../utils/getDisplayText';
import convertToNumberWithinIntervalBounds from '../utils/convertToNumberWithinIntervalBounds';

class AudioProgress extends Component {
  constructor (props) {
    super(props);

    this.audioProgressContainer = null;
    this.audioProgressBoundingRect = null;
    this.audioProgressContainerResizeObserver = null;

    this.setAudioProgressContainerRef = ref => {
      this.audioProgressContainer = ref;
    };

    // bind methods fired on React events
    this.handleSeekPreview = this.handleSeekPreview.bind(this);

    // bind listeners to add on mount and remove on unmount
    this.handleSeekComplete = this.handleSeekComplete.bind(this);
    this.fetchAudioProgressBoundingRect = this.fetchAudioProgressBoundingRect.bind(this);
  }

  componentDidMount () {
    // add event listeners bound outside the scope of our component
    window.addEventListener('mousemove', this.handleSeekPreview);
    document.addEventListener('touchmove', this.handleSeekPreview);
    window.addEventListener('mouseup', this.handleSeekComplete);
    document.addEventListener('touchend', this.handleSeekComplete);
    this.audioProgressContainerResizeObserver = new ResizeObserver(
      this.fetchAudioProgressBoundingRect
    );
    this.audioProgressContainerResizeObserver.observe(this.audioProgressContainer);
  }

  componentWillUnmount () {
    // remove event listeners bound outside the scope of our component
    window.removeEventListener('mousemove', this.handleSeekPreview);
    document.removeEventListener('touchmove', this.handleSeekPreview);
    window.removeEventListener('mouseup', this.handleSeekComplete);
    document.removeEventListener('touchend', this.handleSeekComplete);
    this.audioProgressContainerResizeObserver.disconnect();
  }

  handleSeekPreview (event) {
    const { seekUnavailable, seekInProgress, onSeekPreview } = this.props;
    if (seekUnavailable) {
      return;
    }
    // make sure we don't select stuff in the background while seeking
    if (event.type === 'mousedown' || event.type === 'touchstart') {
      document.body.classList.add('noselect');
    } else if (!seekInProgress) {
      return;
    }
    /* we don't want mouse handlers to receive the event
     * after touch handlers if we're seeking.
     */
    event.preventDefault();
    const isTouch = event.type.slice(0, 5) === 'touch';
    const pageX = isTouch ? event.targetTouches.item(0).pageX : event.pageX;
    const boundingRect = this.audioProgressBoundingRect;
    const position = pageX - boundingRect.left - document.body.scrollLeft;
    const containerWidth = boundingRect.width;
    const progress = convertToNumberWithinIntervalBounds(position / containerWidth, 0, 1);
    onSeekPreview(progress);
  }

  handleSeekComplete (event) {
    const { seekInProgress, onSeekComplete } = this.props;
    /* this function is activated when the user lets
     * go of the mouse, so if .noselect was applied
     * to the document body, get rid of it.
     */
    document.body.classList.remove('noselect');
    if (!seekInProgress) {
      return;
    }
    /* we don't want mouse handlers to receive the event
     * after touch handlers if we're seeking.
     */
    event.preventDefault();
    onSeekComplete();
  }

  fetchAudioProgressBoundingRect () {
    this.audioProgressBoundingRect = this.audioProgressContainer.getBoundingClientRect();
  }

  render () {
    const {
      playlist,
      activeTrackIndex,
      currentTime,
      seekPreviewTime,
      seekInProgress,
      duration
    } = this.props;
    const time = seekInProgress ? seekPreviewTime : currentTime;
    const displayedProgress = duration ? time / duration : 0;
    return (
      <div
        className="audio_progress_container"
        ref={this.setAudioProgressContainerRef}
        onMouseDown={this.handleSeekPreview}
        onTouchStart={this.handleSeekPreview}
      >
        <div
          className="audio_progress"
          style={{ width: `${displayedProgress * 100}%` }}
        />
        <div className="audio_progress_overlay">
          <div className="audio_info_marquee">
            <div className="audio_info noselect" draggable="false">
              {getDisplayText(playlist, activeTrackIndex)}
            </div>
          </div>
          <div className="audio_time_progress noselect" draggable="false">
            {`${convertToTime(time)} / ${convertToTime(duration)}`}
          </div>
        </div>
      </div>
    );
  }
}

AudioProgress.propTypes = {
  playlist: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    displayText: PropTypes.string.isRequired
  }).isRequired),
  activeTrackIndex: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
  seekPreviewTime: PropTypes.number.isRequired,
  seekInProgress: PropTypes.bool.isRequired,
  seekUnavailable: PropTypes.bool.isRequired,
  duration: PropTypes.number.isRequired,
  onSeekPreview: PropTypes.func.isRequired,
  onSeekComplete: PropTypes.func.isRequired
};

module.exports = AudioProgress;
