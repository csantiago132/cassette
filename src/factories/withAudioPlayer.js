import React, { Component } from 'react';
import PropTypes from 'prop-types';

function withAudioPlayer () {
  return function (Control) {
    class WithAudioPlayer extends Component {
      constructor (props, context) {
        super(props, context);
        this.state = {
          controlProps: context.audioPlayer.controlProps
        };
      }

      componentDidMount () {
        this.unsubscribe = this.context.audioPlayer.subscribe(() => {
          this.setState({
            controlProps: this.context.audioPlayer.controlProps
          });
        });
      }

      shouldComponentUpdate (nextProps, nextState) {
        return (
          this.props !== nextProps ||
          this.state.controlProps !== nextState.controlProps
        );
      }

      componentWillUnmount () {
        this.unsubscribe();
      }

      render () {
        return <Control {...this.props} {...this.state.controlProps} />;
      }
    }
    WithAudioPlayer.displayName = (
      `withAudioPlayer(${Control.displayName || Control.name})`
    );
    WithAudioPlayer.contextTypes = {
      audioPlayer: PropTypes.shape({
        controlProps: PropTypes.object.isRequired
      }).isRequired
    };
    return WithAudioPlayer;
  };
}

export default withAudioPlayer;
