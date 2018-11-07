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

export interface SurfaceProgress {
  currentTime: number,
  loaded: number
}

interface SurfaceProps {
  src: string;
  source: typeof SourceComponent;
  playing: boolean;
  volume: number;
  muted: boolean;

  onClick(): void;
  onDuration(duration: number): void;
  onProgress(progress: SurfaceProgress): void;
}

/**
 * This component will be responsible for drawing a video
 */
class Surface extends PureComponent<SurfaceProps> {

  private sourceRef = React.createRef<SourceComponent>();

  private isPlaying = false;

  private progressInterval?: number;
  private previousProgress?: SurfaceProgress;

  componentDidMount() {
    this.sourceRef.current!.load();

    this.progressInterval = window.setInterval(this.onProgressCheck, 1000);
  }

  componentWillUnmount() {
    if(this.isPlaying)
      this.sourceRef.current!.stop();

    clearTimeout(this.progressInterval);
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

  private handleReady = () => {
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

    this.props.onDuration(this.sourceRef.current!.getDuration() || 0);
  }

  private handlePlay = () => {
    console.debug('[DEBUG]: Surface: event-play');
    this.isPlaying = true;
  }

  private handlePause = () => {
    console.debug('[DEBUG]: Surface: event-pause');
    this.isPlaying = false;
  }

  private handleBuffer = () => {
    console.debug('[DEBUG]: Surface: event-buffer');
  }

  private onProgressCheck = () => {
    if(this.props.source && this.sourceRef.current != null) {
      const duration = this.sourceRef.current.getDuration();
      const currentTime = this.sourceRef.current.getCurrentTime();
      if(duration && currentTime) {
        const progress: SurfaceProgress = {
          currentTime,
          loaded: 0 // TODO!
        }

        if(this.previousProgress == null || this.previousProgress !== progress) {
          this.props.onProgress(progress);
          this.previousProgress = progress;
        }
      }
    }
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