import React, { PureComponent } from 'react';

import { SourceComponent } from './Sources/Source';
import YoutubeSource from './Sources/YoutubeSource';

interface SurfaceProps {
  src: string,
  source: typeof SourceComponent
}

/**
 * This component will be responsible for drawing a video
 */
class Surface extends PureComponent<SurfaceProps> {

  private sourceRef = React.createRef<SourceComponent>();

  componentDidMount() {
    this.sourceRef.current!.load(this.props.src);
  }

  componentWillUnmount() {
    // TODO: Check whether source is playing
    this.sourceRef.current!.stop();
  }

  handleReady = () => {
    console.debug('[DEBUG]: Surface: event-ready');
  }

  handlePlay = () => {
    console.debug('[DEBUG]: Surface: event-play');
  }

  handlePause = () => {
    console.debug('[DEBUG]: Surface: event-pause');
  }

  handleBuffer = () => {
    console.debug('[DEBUG]: Surface: event-buffer');
  }

  render() {
    const { source: SurfaceSource } = this.props;

    return (
      <SurfaceSource
        ref={this.sourceRef}
        playing={false}
        onReady={this.handleReady}
        onPlay={this.handlePlay}
        onPause={this.handlePause} />
    );
  }
}

export const Test = () => (
  <Surface src="https://www.youtube.com/watch?v=9cBN9_9oK4A" source={YoutubeSource} />
);

export default Surface;