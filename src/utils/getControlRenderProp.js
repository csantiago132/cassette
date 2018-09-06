import { createElement } from 'react';

import PlayPauseButton from '../controls/PlayPauseButton';
import BackSkipButton from '../controls/BackSkipButton';
import ForwardSkipButton from '../controls/ForwardSkipButton';
import VolumeControl from '../controls/VolumeControl';
import RepeatButton from '../controls/RepeatButton';
import ShuffleButton from '../controls/ShuffleButton';
import AudioProgress from '../controls/AudioProgress';
import AudioProgressDisplay from '../controls/AudioProgressDisplay';
import Spacer from '../controls/Spacer';

const controlComponents = {
  playpause: PlayPauseButton,
  backskip: BackSkipButton,
  forwardskip: ForwardSkipButton,
  volume: VolumeControl,
  repeat: RepeatButton,
  shuffle: ShuffleButton,
  progress: AudioProgress,
  progressdisplay: AudioProgressDisplay,
  spacer: Spacer
};

const cache = {};
function getControlRenderProp (control) {
  if (typeof control === 'function') {
    return control;
  }
  if (typeof control === 'string') {
    if (cache[control]) {
      return cache[control];
    }
    const component = controlComponents[control];
    if (component) {
      const fn = playerContext => createElement(component, { playerContext });
      cache[control] = fn;
      return fn;
    }
  }
  return null;
}

export default getControlRenderProp;
