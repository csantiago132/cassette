import React, { Component } from 'react';
import StyleGuideRenderer from 'react-styleguidist/lib/rsg-components/StyleGuide/StyleGuideRenderer';

import { FullscreenContextProvider } from '@cassette/core';
import { MediaPlayerControls } from '@cassette/player';

import PlayerContextGroupPrimary from './PlayerContextGroupPrimary';
import PlayerContextProviderPrimary from './PlayerContextProviderPrimary';
import EmbeddedVideoFullscreenButton from './EmbeddedVideoFullscreenButton';
import playlist from './playlist';

class DocsWrapper extends Component {
  constructor(props) {
    super(props);
    this.handleStateSnapshot = this.handleStateSnapshot.bind(this);
    this.initialStateSnapshot = JSON.parse(
      localStorage.getItem('media_player_snapshot')
    );
  }

  handleStateSnapshot(snapshot) {
    localStorage.setItem('media_player_snapshot', JSON.stringify(snapshot));
  }

  render() {
    return (
      <PlayerContextGroupPrimary>
        <PlayerContextProviderPrimary
          playlist={playlist}
          autoplay
          defaultMuted
          crossOrigin="anonymous"
          initialStateSnapshot={this.initialStateSnapshot}
          onStateSnapshot={this.handleStateSnapshot}
        >
          <StyleGuideRenderer {...this.props} />
          <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>
            <FullscreenContextProvider>
              {fullscreenContext => (
                <MediaPlayerControls
                  showVideo={fullscreenContext.fullscreen}
                  controls={[
                    'spacer',
                    'backskip',
                    'playpause',
                    'forwardskip',
                    'volume',
                    'spacer',
                    'progress',
                    () => <EmbeddedVideoFullscreenButton />
                  ]}
                />
              )}
            </FullscreenContextProvider>
          </div>
        </PlayerContextProviderPrimary>
      </PlayerContextGroupPrimary>
    );
  }
}

export default DocsWrapper;
