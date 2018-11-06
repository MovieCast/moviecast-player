import React from 'react';
import { SourceComponent } from './Source';

const MATCH_URL = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;

let ytApiLoaded = false;

async function loadYoutubeApi() {
  return new Promise(resolve => {
    if(ytApiLoaded) return resolve();

    console.debug('[DEBUG]: Loading YouTube iFrame API');

    ytApiLoaded = true;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.youtube.com/iframe_api';

    (window as any)['onYouTubeIframeAPIReady'] = function() {
      console.debug('[DEBUG]: YouTube iFrame API is ready');
      resolve();
    }

    document.body.appendChild(script);
  });
}

/**
 * This source is ment to play youtube videos.
 * 
 * This internally uses the iframe api of YouTube
 */
class YoutubeSource extends SourceComponent {

  player?: YT.Player;
  containerRef = React.createRef<HTMLDivElement>();

  static canPlay = (src: string) => MATCH_URL.test(src);

  async load() {
    const { src, playing, onReady, onError } = this.props;

    // Initialize youtube iframe api
    if(!(window as any)['YT'] && !ytApiLoaded) {
      await loadYoutubeApi();
    }

    const id = src.match(MATCH_URL)![1];

    if(!this.containerRef.current) {
      console.warn('[WARN]: YoutubeSource was not initiated correctly!');
      return;
    }

    this.player = new YT.Player(this.containerRef.current, {
      width: '100%',
      height: '100%',
      videoId: id,
      playerVars: {
        controls: 0,
        rel: 0,
        autoplay: playing ? 1 : 0,
        origin: window.location.origin
      },
      events: {
        onReady: this.handleReady,
        onError,
        onStateChange: this.onStateChange
      }
    });
  }

  handleReady = () => {
    console.log('Ready');
    // Our ref no longer works properly after youtube's player overwrote it...
    //const iFrame = this.containerRef.current as HTMLIFrameElement;
    
    const iFrame = this.player!.getIframe();

    try {
      // Let's remove that nasty appbar and other crap we do not want
      // PS: YouTube you should not have deleted the showinfo property from your iframe api...

      const youtubeHtml5Player = (iFrame.contentWindow!.document.getElementsByClassName('html5-video-player')[0]);

      const observer = new MutationObserver(this.handleMutation);
      observer.observe(youtubeHtml5Player, { childList: true,  });

      console.debug("[DEBUG]: Let's remove that nasty appbar and other crap we do not want!");
      console.debug("[DEBUG]: PS: YouTube you should not have deleted the showinfo property from your iframe api...");

      const nodesToRemove = [...(youtubeHtml5Player.childNodes as unknown) as Element[]].filter(node => !node.classList.contains('html5-video-container'));
      console.debug(`[DEBUG]: Removing ${nodesToRemove.length} bs nodes`);

      nodesToRemove.forEach(node => node.remove());

    } catch(e) {
      console.warn("[WARN]: Hmm, failed to access document, web security is probably enabled");
    }

    this.props.onReady();
  }

  /**
   * 
   * @param mutations A list of mutated records
   * @param observer The observer attatched to this callback
   */
  handleMutation(mutations: MutationRecord[], observer: MutationObserver) {
    const invalidNodes = mutations
      .filter(mutation => mutation.removedNodes.length == 0)
      .reduce((res, mutation) => {
        mutation.addedNodes.forEach(node => res.push(node as Element));

        return res;
      }, [] as Element[])
      .filter(node => !node.classList.contains('html5-video-player'))

    if(invalidNodes.length > 0) {
      invalidNodes.forEach(node => node.remove())
      console.debug(`[DEBUG]: Mutation detected, removing ${invalidNodes.length} invalid nodes`, invalidNodes);
    }
  }

  /**
   * Proxy youtube state changes to our props
   * @see https://developers.google.com/youtube/iframe_api_reference#Events
   */
  onStateChange = ({ data }: YT.OnStateChangeEvent) => {
    const { onPlay, onPause, onBuffer, onEnded, onReady } = this.props;

    switch(data) {
      case YT.PlayerState.ENDED: // ended
        onEnded();
        break;
      case YT.PlayerState.PLAYING: // playing
        onPlay();
        break;
      case YT.PlayerState.PAUSED: // paused
        onPause();
        break;
      case YT.PlayerState.BUFFERING: // buffering
        onBuffer();
        break;
      case YT.PlayerState.CUED: // video cued
        // TODO: Maybe change this to onCue();
        //onReady(); 
        console.log('cued');
        this.handleReady();
        break;
      case YT.PlayerState.UNSTARTED:
        // Check if autoplay is on...
        console.log('unstarted');
        this.play();
        break;
      default:
        console.warn(`[WARN]: Unexpected state: ${data}`)
    }
  }

  /**
   * Plays current video
   */
  play() {
    if(!this.player) return;

    //this.player.getIframe()

    this.player.playVideo();
  }

  /**
   * Pauses current video
   */
  pause() {
    if(!this.player) return;

    this.player.pauseVideo();
  }

  /**
   * Stops current video
   */
  stop() {
    if(!this.player) return;

    this.player.stopVideo();
  }

  seekTo(seconds: number) {
    if(!this.player) return;

    this.player.seekTo(seconds, true);

    if (!this.props.playing) {
      this.pause();
    }
  }

  setVolume(volume: number) {
    if(!this.player) return;

    this.player.setVolume(volume * 100);
  }

  mute = () => {
    if(!this.player) return;

    this.player.mute();
  }

  unmute = () => {
    if(!this.player) return;

    this.player.unMute();
  }

  render() {
    return (
      <div ref={this.containerRef} id="testId"/>
    );
  }
}

export default YoutubeSource;