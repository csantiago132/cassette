import ResponsiveMediaPlayer from './ResponsiveMediaPlayer';
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

export default ResponsiveMediaPlayer;
export { ResponsiveMediaPlayer };
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
ResponsiveMediaPlayer.PlayPauseButton = PlayPauseButton;
ResponsiveMediaPlayer.BackSkipButton = BackSkipButton;
ResponsiveMediaPlayer.ForwardSkipButton = ForwardSkipButton;
ResponsiveMediaPlayer.VolumeControl = VolumeControl;
ResponsiveMediaPlayer.RepeatButton = RepeatButton;
ResponsiveMediaPlayer.ShuffleButton = ShuffleButton;
ResponsiveMediaPlayer.MediaProgress = MediaProgress;

// TODO: remove everything below
import {
  PlayerContextProvider,
  PlayerContextConsumer
} from 'media-player-core';
ResponsiveMediaPlayer.PlayerContextProvider = PlayerContextProvider;
ResponsiveMediaPlayer.PlayerContextConsumer = PlayerContextConsumer;
