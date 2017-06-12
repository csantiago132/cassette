import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AudioPlayerContext from '../utils/AudioPlayerContext';

function withAudioPlayer () {
  return function (Control) {
    class WithAudioPlayer extends Component {
      constructor (props, context) {
        super(props, context);

        this.state = {
          controlProps: context.audioPlayer.controlProps
        };

        // we need to maintain our own child context so we can ensure
        // this component instance updates before any descendants.
        this.audioPlayerContext = new AudioPlayerContext(
          context.audioPlayer.controlProps
        );

        // defined on mount
        this.unsubscribe = null;
      }

      componentDidMount () {
        const { audioPlayer } = this.context;
        this.unsubscribe = audioPlayer.subscribe(() => {
          if (audioPlayer.controlProps !== this.state.controlProps) {
            this.setState({
              controlProps: audioPlayer.controlProps
            });
          }
        });
      }

      shouldComponentUpdate (nextProps, nextState) {
        return (
          this.props !== nextProps ||
          this.state.controlProps !== nextState.controlProps
        );
      }

      componentDidUpdate (prevProps, prevState) {
        if (this.state.controlProps !== prevState.controlProps) {
          this.audioPlayerContext.setControlProps(this.state.controlProps);
          this.audioPlayerContext.notifySubscribers();
        }
      }

      componentWillUnmount () {
        this.unsubscribe();
      }

      getChildContext () {
        return {
          audioPlayer: this.audioPlayerContext
        };
      }

      render () {
        return <Control {...this.props} {...this.state.controlProps} />;
      }
    }

    WithAudioPlayer.displayName = (
      `withAudioPlayer(${Control.displayName || Control.name})`
    );

    WithAudioPlayer.contextTypes = WithAudioPlayer.childContextTypes = {
      audioPlayer: PropTypes.shape({
        controlProps: PropTypes.object.isRequired
      }).isRequired
    };

    return WithAudioPlayer;
  };
}

export default withAudioPlayer;
