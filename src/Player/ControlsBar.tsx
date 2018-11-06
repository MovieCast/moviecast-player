import React, { PureComponent } from 'react';
import { IconButton, Typography, withStyles, WithStyles, createStyles } from '@material-ui/core';
import { PlayArrow, Pause, Fullscreen, FullscreenExit } from '@material-ui/icons';
import { withPlayerContext, PlayerState } from './Player';

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
  playing: boolean

  onPlayToggle(): void;
  onFullscreenToggle(): void;
}

class ControlsBar extends PureComponent<Props> {
  render() {
    const { classes, playing, onPlayToggle, onFullscreenToggle } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <IconButton color="inherit" onClick={onPlayToggle}>
            {playing ? <Pause /> : <PlayArrow />}
          </IconButton>

          <Typography className={classes.time} color="inherit">
            00:00 &nbsp;/&nbsp; 00:00
          </Typography>

          <div className={classes.scrubBar}/>

          <IconButton color="inherit" onClick={onFullscreenToggle}>
            <Fullscreen />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ControlsBar);