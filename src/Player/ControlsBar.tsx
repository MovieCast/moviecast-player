import React, { PureComponent } from 'react';
import { IconButton, Typography, withStyles, WithStyles, createStyles } from '@material-ui/core';
import {
  PlayArrow, Pause,
  VolumeOff, VolumeDown, VolumeUp,
  Subtitles,
  Fullscreen, FullscreenExit } from '@material-ui/icons';

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

  render() {
    const { classes, playing, onPlayToggle, onMuteToggle, onFullscreenToggle } = this.props;

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
            00:00 &nbsp;/&nbsp; 00:00
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