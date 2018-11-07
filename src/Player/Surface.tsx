import React, { PureComponent } from 'react';

import { SourceComponent } from './Sources/Source';
import YoutubeSource from './Sources/YoutubeSource';

import './Surface.css';

const styles = {
  root: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  static: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '100%'
  }
}

interface SurfaceProps {
  src: string;
  source: typeof SourceComponent;
  playing: boolean;
  volume: number;
  muted: boolean;

  onClick(): void;
}

/**
 * This component will be responsible for drawing a video
 */
class Surface extends PureComponent<SurfaceProps> {

  private sourceRef = React.createRef<SourceComponent>();

  private isPlaying = false;

  componentDidMount() {
    this.sourceRef.current!.load();
  }

  componentWillUnmount() {
    if(this.isPlaying)
      this.sourceRef.current!.stop();
  }

  componentWillReceiveProps(nextProps: Readonly<SurfaceProps>) {
    // Sync playing state of source
    if(nextProps.playing && !this.isPlaying) {
      this.sourceRef.current!.play();
    } else if(!nextProps.playing && this.isPlaying) {
      this.sourceRef.current!.pause();
    }

    // Sync volume of source
    if(nextProps.volume !== this.props.volume) {
      this.sourceRef.current!.setVolume(nextProps.volume);
    }

    // Sync muted state of source
    if(nextProps.muted !== this.props.muted) {
      if(nextProps.muted) {
        this.sourceRef.current!.mute();
      } else {
        this.sourceRef.current!.unMute();
      }
    }
  }

  handleReady = () => {
    const { playing, volume, muted } = this.props;
    console.debug('[DEBUG]: Surface: event-ready');

    if(!muted && volume) {
      this.sourceRef.current!.setVolume(volume);
    }

    if(muted) {
      this.sourceRef.current!.mute();
    }

    if(playing) {
      this.sourceRef.current!.play();
    }
  }

  handlePlay = () => {
    console.debug('[DEBUG]: Surface: event-play');
    this.isPlaying = true;
  }

  handlePause = () => {
    console.debug('[DEBUG]: Surface: event-pause');
    this.isPlaying = false;
  }

  handleBuffer = () => {
    console.debug('[DEBUG]: Surface: event-buffer');
  }

  render() {
    const { src, playing, source: SurfaceSource, onClick } = this.props;

    return (
      <div className="Surface-root">
        <div className="Surface-source">
          <SurfaceSource
            ref={this.sourceRef}
            src={src}
            autoPlay={playing}
            onReady={this.handleReady}
            onPlay={this.handlePlay}
            onPause={this.handlePause} />
        </div>
        <div className="Surface-overlay" onClick={onClick}/>
      </div>
    );
  }
}

export default Surface;