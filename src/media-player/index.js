import MediaPlayer from './MediaPlayer';
import PlayPauseButton from './controls/PlayPauseButton';
import BackSkipButton from './controls/BackSkipButton';
import ForwardSkipButton from './controls/ForwardSkipButton';
import VolumeControl from './controls/VolumeControl';
import MuteButton from './controls/MuteButton';
import RepeatButton from './controls/RepeatButton';
import ShuffleButton from './controls/ShuffleButton';
import FullscreenButton from './controls/FullscreenButton';
import MediaProgress from './controls/MediaProgress';
import MediaProgressDisplay from './controls/MediaProgressDisplay';
import Spacer from './controls/Spacer';

export default MediaPlayer;
export { MediaPlayer };
export { PlayPauseButton };
export { BackSkipButton };
export { ForwardSkipButton };
export { VolumeControl };
export { MuteButton };
export { RepeatButton };
export { ShuffleButton };
export { FullscreenButton };
export { MediaProgress };
export { MediaProgressDisplay };
export { Spacer };

// for browser script tag (global var) usage
MediaPlayer.PlayPauseButton = PlayPauseButton;
MediaPlayer.BackSkipButton = BackSkipButton;
MediaPlayer.ForwardSkipButton = ForwardSkipButton;
MediaPlayer.VolumeControl = VolumeControl;
MediaPlayer.RepeatButton = RepeatButton;
MediaPlayer.ShuffleButton = ShuffleButton;
MediaPlayer.MediaProgress = MediaProgress;

// TODO: remove everything below
import {
  PlayerContextProvider,
  PlayerContextConsumer
} from 'media-player-core';
MediaPlayer.PlayerContextProvider = PlayerContextProvider;
MediaPlayer.PlayerContextConsumer = PlayerContextConsumer;
