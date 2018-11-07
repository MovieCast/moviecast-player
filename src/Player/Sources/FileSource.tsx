import React from 'react';
import { SourceComponent } from './Source';

const SUPPORTED_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i;

class FileSource extends SourceComponent {

  static canPlay = (src: string) => SUPPORTED_EXTENSIONS.test(src);

  private videoRef = React.createRef<HTMLVideoElement>();

  load(): void {
    //throw new Error("Method not implemented.");
    // Not a lot to do yet...
  }

  play(): void {
    const promise = this.videoRef.current!.play();

    promise.catch(this.props.onError);
  }

  pause(): void {
    this.videoRef.current!.pause();
  }

  stop(): void {
    this.videoRef.current!.removeAttribute('src');
  }

  setVolume(volume: number) {
    this.videoRef.current!.volume = volume;
  }

  mute() {
    this.videoRef.current!.muted = true;
  }

  unMute() {
    this.videoRef.current!.muted = false;
  }

  seekTo(amount: number): void {
    this.videoRef.current!.currentTime = amount;
  }

  render() {
    const { src, autoPlay, onReady, onPlay, onPause, onBuffer, onEnded, onError } = this.props;

    const styles = {
      height: '100%',
      width: '100%',
      backgroundColor: '#000'
    }

    return (
      <video
        style={styles}
        src={src}
        ref={this.videoRef}
        autoPlay={autoPlay}
        onCanPlay={onReady}
        onPlay={onPlay}
        onPause={onPause}
        onWaiting={onBuffer}
        onEnded={onEnded}
        onError={onError}
      />
    );
  }
}

export default FileSource;