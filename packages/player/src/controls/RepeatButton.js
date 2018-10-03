import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RepeatIcon from '@benwiley4000/svg-react-loader?name=RepeatIcon!material-design-icons/av/svg/design/ic_repeat_48px.svg?';
import RepeatOneIcon from '@benwiley4000/svg-react-loader?name=RepeatOneIcon!material-design-icons/av/svg/design/ic_repeat_one_48px.svg?';

import { playerContextFilter, PlayerPropTypes } from '@cassette/core';
import { repeatStrategyOptions } from '@cassette/core/dist/_undocumented';

import ButtonWrapper from './common/ButtonWrapper';
import classNames from '../utils/classNames';

function getNextRepeatStrategy(repeatStrategy) {
  let nextIndex = repeatStrategyOptions.indexOf(repeatStrategy) + 1;
  if (nextIndex >= repeatStrategyOptions.length) {
    nextIndex = 0;
  }
  return repeatStrategyOptions[nextIndex];
}

export class RepeatButton extends PureComponent {
  constructor(props) {
    super(props);

    // bind methods fired on React events
    this.handleNextRepeatStrategy = this.handleNextRepeatStrategy.bind(this);
  }

  handleNextRepeatStrategy() {
    this.props.onSetRepeatStrategy(
      getNextRepeatStrategy(this.props.repeatStrategy)
    );
  }

  render() {
    const { repeatStrategy } = this.props;
    const Icon = repeatStrategy === 'track' ? RepeatOneIcon : RepeatIcon;
    return (
      <ButtonWrapper>
        <button
          type="button"
          className={classNames(
            'cassette__material_toggle cassette__media_button cassette__repeat_btn',
            { on: repeatStrategy !== 'none' }
          )}
          onClick={this.handleNextRepeatStrategy}
        >
          <div className="inner foreground">
            <Icon width="100%" height="100%" />
          </div>
        </button>
      </ButtonWrapper>
    );
  }
}

RepeatButton.propTypes = {
  repeatStrategy: PlayerPropTypes.repeatStrategy.isRequired,
  onSetRepeatStrategy: PropTypes.func.isRequired
};

export default playerContextFilter(RepeatButton, [
  'repeatStrategy',
  'onSetRepeatStrategy'
]);
