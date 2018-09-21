import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ResizeObserver from 'resize-observer-polyfill';

class AudioStatusBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      marqueeContainerWidth: null
    };

    this.marqueeContainerElement = null;
    this.marqueeContainerResizeObserver = null;

    // bind listeners to add on mount and remove on unmount
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.marqueeContainerResizeObserver = new ResizeObserver(this.handleResize);
    this.marqueeContainerResizeObserver.observe(this.marqueeContainerElement);
  }

  componentWillUnmount() {
    this.marqueeContainerResizeObserver.disconnect();
  }

  shouldUseMarquee() {
    if (!this.marqueeContainerElement) {
      return false;
    }
    this.measuringContext =
      this.measuringContext ||
      document.createElement('canvas').getContext('2d');
    this.measuringContext.font = getComputedStyle(
      this.marqueeContainerElement
    ).font;
    const textWidth = this.measuringContext.measureText(this.props.displayText)
      .width;
    return textWidth > this.state.marqueeContainerWidth;
  }

  handleResize(entries) {
    for (const entry of entries) {
      if (entry.target === this.marqueeContainerElement) {
        const { width } = entry.contentRect;
        this.setState(state => {
          if (state.marqueeContainerWidth === width) {
            return null;
          }
          return {
            marqueeContainerWidth: width
          };
        });
        return;
      }
    }
  }

  render() {
    const { className, style, displayText, displayTime } = this.props;
    const shouldUseMarquee = this.shouldUseMarquee();
    return (
      <div
        className={classNames('rrap__audio_status_bar', className)}
        style={style}
      >
        <div
          className="rrap__audio_info_marquee"
          ref={elem => (this.marqueeContainerElement = elem)}
        >
          {shouldUseMarquee && (
            <marquee scrollamount={3}>{displayText}</marquee>
          )}
          {!shouldUseMarquee && displayText}
        </div>
        <div className="rrap__audio_time_progress">{displayTime}</div>
      </div>
    );
  }
}

AudioStatusBar.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  displayText: PropTypes.string.isRequired,
  displayTime: PropTypes.string.isRequired
};

export default AudioStatusBar;
