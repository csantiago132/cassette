import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RepeatIcon from 'svg-react-loader?name=RepeatIcon!material-design-icons/av/svg/design/ic_repeat_48px.svg';
import RepeatOneIcon from 'svg-react-loader?name=RepeatOneIcon!material-design-icons/av/svg/design/ic_repeat_one_48px.svg';

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
    const Icon = repeatStrategy === 'track' ? RepeatOneIcon : RepeatIcon;
    return (
      <div
        className={classNames(
          'rr_audio_player__repeat_button rr_audio_player__audio_button',
          { repeat: repeatStrategy !== 'none' }
        )}
        onClick={this.handleNextRepeatStrategy}
      >
        <Icon className="foreground" height={42} />
      </div>
    );
  }
}

RepeatButton.propTypes = {
  repeatStrategy: PropTypes.oneOf(repeatStrategyOptions).isRequired,
  onSetRepeatStrategy: PropTypes.func.isRequired
};

module.exports = RepeatButton;
