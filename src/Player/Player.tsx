import React, { PureComponent } from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core';

import Surface, { SurfaceProgress } from './Surface';
import ControlsBar from './ControlsBar';
import { SourceComponent } from './Sources/Source';
import FileSource from './Sources/FileSource';
import { findSource } from './Sources';

const styles = createStyles({
  root: {
    position: 'relative',
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  }
});

interface PlayerProps extends WithStyles<typeof styles>{
  src: string;
  autoPlay: boolean;
}

export interface PlayerState {
  currentSource: typeof SourceComponent;
  playing: boolean;
  duration: number;
  progress: SurfaceProgress,
  volume: number;
  muted: boolean;
  fullscreen: boolean;
  actions: {
    setPlaying: (playing: boolean) => void,
    setVolume: (volume: number) => void,
    setMuted: (muted: boolean) => void
  }
}

export const { Provider, Consumer } = React.createContext<PlayerState | null>(null);

class Player extends PureComponent<PlayerProps, PlayerState> {

  static defaultProps: Pick<PlayerProps, "autoPlay"> = {
    autoPlay: true
  };

  state = {
    currentSource: FileSource,
    playing: true,
    duration: 0,
    progress: {
      currentTime: 0,
      loaded: 0
    },
    volume: 1,
    muted: false,
    fullscreen: false,
    actions: {
      setPlaying: (playing: boolean) => this.setState({ playing }),
      setVolume: (volume: number) => this.setState({ volume }),
      setMuted: (muted: boolean) => this.setState({ muted }),
    }
  }

  componentWillMount() {
    const source = findSource(this.props.src);
    if(source) {
      this.setState({ currentSource: source });
    }

    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  componentWillReceiveProps(nextProps: PlayerProps) {
    if(this.props.src !== nextProps.src) {

      const source = findSource(nextProps.src);
      if(source) {
        this.setState({ currentSource: source });
      }
    }
  }

  private handlePlayToggle = () => {
    this.setState({ playing: !this.state.playing });
  }

  private handleDuration = (duration: number) => {
    this.setState({ duration });
  }

  private handleProgress = (progress: SurfaceProgress) => {
    this.setState({ progress });
  }

  private handleMuteToggle = () => {
    this.setState({ muted: !this.state.muted });
  }

  private handleVolumeChange = (event: any, volume: number) => {
    this.setState({ muted: false, volume });
  }

  private handleKeyPress = (event: KeyboardEvent) => {
    if(event.code === "Space") {
      this.handlePlayToggle();
    }
  }

  private handleFullscreenToggle = () => {
    console.debug('[DEBUG]: Player: toggle-fullscreen, not suported yet!');
  }

  render() {
    const { src, autoPlay } = this.props;

    const { currentSource: CurrentSource, playing, volume, muted } = this.state;

    return (
      // <Provider value={this.state}>
      <div className={this.props.classes.root}>
        <Surface
          src={src}
          playing={playing}
          volume={volume}
          muted={muted}
          source={CurrentSource}
          onClick={this.handlePlayToggle}
          onDuration={this.handleDuration}
          onProgress={this.handleProgress}/>
        <ControlsBar
          playing={this.state.playing}
          duration={this.state.duration}
          progress={this.state.progress}
          volume={this.state.volume}
          muted={this.state.muted}
          onPlayToggle={this.handlePlayToggle}
          onMuteToggle={this.handleMuteToggle}
          onVolumeChange={this.handleVolumeChange}
          onFullscreenToggle={this.handleFullscreenToggle}/>
      </div>
      // </Provider>
    )
  }
}

export default withStyles(styles)(Player);