import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PurePropTypesComponent from './common/PurePropTypesComponent';
import { repeatStrategyOptions } from '../constants';

function getNextRepeatStrategy (repeatStrategy) {
  let nextIndex = repeatStrategyOptions.indexOf(repeatStrategy) + 1;
  if (nextIndex >= repeatStrategyOptions.length) {
    nextIndex = 0;
  }
  return repeatStrategyOptions[nextIndex];
}

class RepeatButton extends PurePropTypesComponent {
  constructor (props) {
    super(props);

    // bind methods fired on React events
    this.handleNextRepeatStrategy = this.handleNextRepeatStrategy.bind(this);
  }

  handleNextRepeatStrategy () {
    this.props.onSetRepeatStrategy(
      getNextRepeatStrategy(this.props.repeatStrategy)
    );
  }

  render () {
    const { repeatStrategy } = this.props;
    return (
      <div
        className={classNames(
          'rr_audio_player__repeat_button rr_audio_player__audio_button',
          {
            repeat: repeatStrategy !== 'none',
            one: repeatStrategy === 'track'
          }
        )}
        onClick={this.handleNextRepeatStrategy}
      >
        {repeatStrategy}
      </div>
    );
  }
}

RepeatButton.propTypes = {
  repeatStrategy: PropTypes.oneOf(repeatStrategyOptions).isRequired,
  onSetRepeatStrategy: PropTypes.func.isRequired
};

module.exports = RepeatButton;
