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
          'rrap__material_toggle rrap__audio_button',
          { on: repeatStrategy !== 'none' }
        )}
        onClick={this.handleNextRepeatStrategy}
      >
        <div className="inner">
          <Icon className="foreground" width="100%" height="100%" />
        </div>
      </div>
    );
  }
}

RepeatButton.propTypes = {
  repeatStrategy: PropTypes.oneOf(repeatStrategyOptions).isRequired,
  onSetRepeatStrategy: PropTypes.func.isRequired
};

module.exports = RepeatButton;
