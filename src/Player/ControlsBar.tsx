import React, { PureComponent } from 'react';
import { IconButton, Typography, withStyles, WithStyles, createStyles } from '@material-ui/core';
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
    display: 'flex',
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10
  },
  time: {
    display: 'flex',
    alignItems: 'center',
    lineHeight: '17px'
  },
  scrubBar: {
    flexGrow: 1
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
    const { classes, playing, duration, progress, onPlayToggle, onMuteToggle, onFullscreenToggle } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <IconButton color="inherit" onClick={onPlayToggle}>
            {playing ? <Pause /> : <PlayArrow />}
          </IconButton>

          <IconButton color="inherit" onClick={onMuteToggle}>
            {this.renderVolumeIcon()}
          </IconButton>

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