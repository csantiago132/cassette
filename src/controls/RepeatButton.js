import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RepeatIcon from '@benwiley4000/svg-react-loader?name=RepeatIcon!material-design-icons/av/svg/design/ic_repeat_48px.svg?';
import RepeatOneIcon from '@benwiley4000/svg-react-loader?name=RepeatOneIcon!material-design-icons/av/svg/design/ic_repeat_one_48px.svg?';

import ButtonWrapper from './common/ButtonWrapper';
import { repeatStrategyOptions } from '../constants';
import * as PlayerPropTypes from '../PlayerPropTypes';
import playerContextFilter from '../factories/playerContextFilter';

function getNextRepeatStrategy(repeatStrategy) {
  let nextIndex = repeatStrategyOptions.indexOf(repeatStrategy) + 1;
  if (nextIndex >= repeatStrategyOptions.length) {
    nextIndex = 0;
  }
  return repeatStrategyOptions[nextIndex];
}

class RepeatButton extends PureComponent {
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
            'rrap__material_toggle rrap__audio_button rrap__repeat_btn',
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
