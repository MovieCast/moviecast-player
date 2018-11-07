import React, { PureComponent } from 'react';
import { IconButton, Typography, withStyles, WithStyles, createStyles } from '@material-ui/core';
import { Slider } from '@material-ui/lab';
import {
  PlayArrow, Pause,
  VolumeOff, VolumeDown, VolumeUp,
  Subtitles,
  Fullscreen, FullscreenExit } from '@material-ui/icons';
import { SurfaceProgress } from './Surface';

const styles = createStyles({
  root: {
    position: 'absolute',
    display: 'flex',
    bottom: 0,
    height: 48,
    width: '100%',
    zIndex: 1,
    color: '#fff',
  },
  wrapper: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    //paddingLeft: 10,
    //paddingRight: 10
    margin: '0 10px'
  },
  time: {
    display: 'flex',
    alignItems: 'center',
    lineHeight: '17px'
  },
  volumeSlider: {
    width: 52,
    display: 'flex',
    alignItems: 'center',
    marginRight: 15
  },
  slider: {
    padding: '22px 0px',
  },
  scrubBar: {
    flexGrow: 1
  },
  progressBar: {
    //marginLeft: 10,
    //marginRight: 10,
    transform: 'scaleY(0.6)',
    position: 'absolute',
    top: 0,
    left: 0,
    height: 5,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    '&:hover': {
      transform: 'none',
      cursor: 'pointer'
    }
  }
});

interface Props extends WithStyles<typeof styles> {
  playing: boolean;
  duration: number;
  progress: SurfaceProgress;
  volume: number;
  muted: boolean;

  onPlayToggle(): void;
  onMuteToggle(): void;
  onVolumeChange(event: any, volume: number): void;
  onFullscreenToggle(): void;
}

class ControlsBar extends PureComponent<Props> {
  private renderVolumeIcon() {
    const { volume, muted } = this.props;
    if(volume <= 0 || muted) {
      return <VolumeOff />;
    }

    if(volume > 0 && volume < 0.5) {
      return <VolumeDown />;
    }

    if(volume >= 0.5) {
      return <VolumeUp />;
    }
  }

  /**
   * Converts durations into a readable string
   * NOTE: This function currently only functions
   *       in es2017 environments, maybe add polyfill for padStart
   * @param duration The duration in seconds
   */
  private formatHumanDuration(duration: number | null): string {
    if(duration == null) return "0:00";

    const hours = Math.floor(duration / 3600);
    let minutes = Math.floor((duration % 3600) / 60).toString();
    if(hours > 0) {
      minutes = minutes.padStart(2, '0');
    }
    const seconds = Math.floor(duration % 60).toString().padStart(2, '0');

    return `${(hours > 0 ? `${hours}:` : '') + minutes}:${seconds}`;
  }

  render() {
    const { classes, playing, duration, progress, muted, volume, onPlayToggle, onMuteToggle, onVolumeChange, onFullscreenToggle } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <div className={classes.progressBar}>

          </div>
          <IconButton color="inherit" onClick={onPlayToggle}>
            {playing ? <Pause /> : <PlayArrow />}
          </IconButton>

          <IconButton color="inherit" onClick={onMuteToggle}>
            {this.renderVolumeIcon()}
          </IconButton>

          <div className={classes.volumeSlider}>
            <Slider
              classes={{ container: classes.slider }}
              value={muted ? 0 : volume}
              min={0}
              max={1}
              step={0.1}
              onChange={onVolumeChange}/>
          </div>

          <Typography className={classes.time} color="inherit">
            {this.formatHumanDuration(progress.currentTime)} &nbsp;/&nbsp; {this.formatHumanDuration(duration)}
          </Typography>

          <div className={classes.scrubBar}/>

          {/* <IconButton color="inherit" disabled>
            <Subtitles />
          </IconButton> */}
          
          <IconButton color="inherit" onClick={onFullscreenToggle}>
            <Fullscreen />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ControlsBar);