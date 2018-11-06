import React, { PureComponent } from 'react';

import { SourceComponent } from './Sources/Source';
import YoutubeSource from './Sources/YoutubeSource';

import './Surface.css';

interface SurfaceProps {
  src: string;
  source: typeof SourceComponent;
  playing: boolean;
  volume: number;
  muted: boolean;
}

/**
 * This component will be responsible for drawing a video
 */
class Surface extends PureComponent<SurfaceProps> {

  private sourceRef = React.createRef<SourceComponent>();

  private isReady = false;
  private isPlaying = false;
  private count = 0;
  private aprilFools = false;
  private aprilFoolsDate = {
    month: 3,
    date: 1
  }
  

  componentDidMount() {
    this.sourceRef.current!.load();
  }

  componentWillUnmount() {
    // TODO: Check whether source is playing
    this.sourceRef.current!.stop();
  }

  isItAprilFoolDay = () => {
    var now = new Date();
    (now.getMonth() == this.aprilFoolsDate.month && now.getDate() == this.aprilFoolsDate.date) ? this.aprilFools = true : this.aprilFools = false;
  }

  handleReady = () => {
    const { playing, volume, muted } = this.props;
    console.debug('[DEBUG]: Surface: event-ready');
    this.isItAprilFoolDay();
    this.isReady = true;

    if(!muted && volume) {
      this.sourceRef.current!.setVolume(volume);
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

  handleClick = () =>{
    if(this.aprilFools) {
      setTimeout(() => {
        this.isPlaying ?this.sourceRef.current!.pause() : this.sourceRef.current!.play();
        this.count+=0.1;
        console.log(Math.sin(this.count)*100);
        this.handleClick();      
      }, Math.abs(Math.sin(this.count)*1000));
    } else {
      this.isPlaying ?this.sourceRef.current!.pause() : this.sourceRef.current!.play();
    }
  }

  render() {
    const { src, playing, volume, muted, source: SurfaceSource } = this.props;

    return (
      <div className="Surface-root">
        <div className="Surface-source">
          <SurfaceSource
            ref={this.sourceRef}
            src={src}
            playing={playing}
            volume={volume}
            mute={muted}
            onReady={this.handleReady}
            onPlay={this.handlePlay}
            onPause={this.handlePause} />
        </div>
        <div className="Surface-overlay" onClick={this.handleClick}/>
      </div>
    );
  }
}

export const Test = () => (
  <Surface
    src="https://www.youtube.com/watch?v=9cBN9_9oK4A"
    source={YoutubeSource}
    playing={true}
    volume={100}
    muted={false} />
);

export default Surface;