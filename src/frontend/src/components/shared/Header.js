import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Media from 'react-media'; // add Media
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import CreateIcon from '@material-ui/icons/Create';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import HomeIcon from '@material-ui/icons/Home';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import MailIcon from '@material-ui/icons/Mail';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import snakeirl from '@assets/img/512px-snake-irl-transparent.png';
import AddBoxIcon from '@material-ui/icons/AddBox';

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    width: '90em',
  },
  spacer: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  sidebarHeader: {
    padding: '16px',
  },
}));

export default function Header(props) {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [state, setState] = React.useState(false);
  const open = Boolean(anchorEl);
  const anchor = 'left';

  /* for when auth is implemented */
  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  /* for handling profile menu */
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /* for closing profile menu */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /* drawer toggling logic */
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  /* For List Items that Link Places!*/
  function ListItemLink(props) {
    const { icon, primary, to } = props;

    const CustomLink = React.useMemo(
      () =>
        React.forwardRef((linkProps, ref) => (
          <Link ref={ref} to={to} {...linkProps} />
        )),
      [to]
    );

    return (
      <li>
        <ListItem button component={CustomLink}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={primary} />
        </ListItem>
      </li>
    );
  }

  /* sidebar */
  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Typography className={classes.sidebarHeader} variant="h4">
        Home
      </Typography>
      <List>
        <ListItemLink icon={<HomeIcon />} primary="Home" to="/" />
      </List>
      <Divider />
      <Typography className={classes.sidebarHeader} variant="h4">
        Create
      </Typography>
      <List>
        <ListItemLink icon={<AddBoxIcon />} primary="Create" to="/create" />
      </List>
      <Divider />
      <Typography className={classes.sidebarHeader} variant="h4">
        Leaderboard
      </Typography>
      <List>
        <ListItemLink
          icon={<FormatListNumberedIcon />}
          primary="All Time"
          to="#"
        />
        <ListItemLink
          icon={<FormatListNumberedIcon />}
          primary="Monthly"
          to="#"
        />
        <ListItemLink
          icon={<FormatListNumberedIcon />}
          primary="Weekly"
          to="#"
        />
        <ListItemLink
          icon={<FormatListNumberedIcon />}
          primary="Daily"
          to="#"
        />
      </List>
    </div>
  );

  /* mobile sidebar */
  const mobileList = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Typography className={classes.sidebarHeader} variant="h4">
        Home
      </Typography>
      <List>
        <ListItemLink icon={<HomeIcon />} primary="Home" to="/" />
      </List>
      <Divider />
      <Typography className={classes.sidebarHeader} variant="h4">
        Play
      </Typography>
      <List>
        <ListItemLink
          icon={<PlayArrowIcon />}
          primary="Mission Select"
          to="/select"
        />
        <ListItemLink icon={<ShuffleIcon />} primary="Random" to="/play" />
      </List>
      <Divider />
      <Typography className={classes.sidebarHeader} variant="h4">
        Leaderboard
      </Typography>
      <List>
        <ListItemLink
          icon={<FormatListNumberedIcon />}
          primary="All Time"
          to="#"
        />
        <ListItemLink
          icon={<FormatListNumberedIcon />}
          primary="Monthly"
          to="#"
        />
        <ListItemLink
          icon={<FormatListNumberedIcon />}
          primary="Weekly"
          to="#"
        />
        <ListItemLink
          icon={<FormatListNumberedIcon />}
          primary="Daily"
          to="#"
        />
      </List>
    </div>
  );

  return (
    <div>
      <ElevationScroll {...props}>
        <AppBar>
          <Toolbar>
            <IconButton
              edge="start"
              onClick={toggleDrawer(anchor, true)}
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <SwipeableDrawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
              onOpen={toggleDrawer(anchor, true)}
            >
              <Media query="(max-width: 599px)">
                {(matches) =>
                  matches
                    ? /* Mobile */
                      mobileList(anchor)
                    : /* Desktop */
                      list(anchor)
                }
              </Media>
            </SwipeableDrawer>
            <img src={snakeirl} width="90em" />
            <div className={classes.spacer} />
            {auth && (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </div>
  );
}
