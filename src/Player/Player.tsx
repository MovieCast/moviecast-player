import React, { PureComponent } from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core';

import Surface from './Surface';
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
  volume: number;
  muted: boolean;
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
    playing: false,
    volume: 100,
    muted: false,
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
  }

  componentWillReceiveProps(nextProps: PlayerProps) {
    if(this.props.src !== nextProps.src) {

      const source = findSource(nextProps.src);
      if(source) {
        this.setState({ currentSource: source });
      }
    }
  }

  handlePlayToggle = () => {
    this.setState({ playing: !this.state.playing });
  }

  render() {
    const { src, autoPlay } = this.props;

    const { currentSource: CurrentSource, playing, volume, muted } = this.state;

    return (
      <Provider value={this.state}>
        <div className={this.props.classes.root}>
          <Surface
            src={src}
            playing={playing}
            volume={volume}
            muted={muted}
            source={CurrentSource}/>
          <ControlsBar
            playing={this.state.playing}
            onPlayToggle={this.handlePlayToggle}
            onFullscreenToggle={() => {}}/>
        </div>
      </Provider>
    )
  }
}

export function withPlayerContext<
  P extends { playerState?: PlayerState },
  R = Pick<P, Exclude<'playerState', P>>
  >(
  Component: React.ComponentClass<P> | React.StatelessComponent<P>
  ): React.SFC<R> {
  return function BoundComponent(props: R) {
    console.log(props)
    return (
      <Consumer>
        {value => <Component {...props} playerState={value} />}
      </Consumer>
    );
  };
}

export default withStyles(styles)(Player);