import React, {Component} from 'react';
// import Header from './shared/header.js';
// import PageBody from './shared/pagebody.js';
import { Button, Card, Typography, TextField, Toolbar, Grid, FormControl, InputLabel, Select, MenuItem, Menu, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'
import axios from 'axios';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { grey } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import API from '../../api';
import AccountCircle from '@material-ui/icons/AccountCircle';

const styles = (theme) => ({
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
});

class ProfileDialog extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {onClose, user} = this.props;
    return <>
      <Dialog
        open
        onClose={() => {onClose()}}
      >
        <DialogTitle>
          Your Profile
        </DialogTitle>
        <DialogContent>
          {user.username !== undefined && <Typography>Username: {user.username}</Typography>}
          {user.points !== undefined && <Typography>Total Points: {user.points}</Typography>}
          {user.demographics && user.demographics.age !== undefined && <Typography>Username: {user.demographics.age}</Typography>}
          {user.demographics && user.demographics.homebase && user.demographics.homebase.lat !== undefined && user.demographics.homebase.long !== undefined && 
            <Typography>Homebase: Latitude: {user.demographics.homebase.lat} Longitude: {user.demographics.homebase.long}</Typography>
          }
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => {onClose()}}>
            Close <CancelIcon style={{marginLeft: "10px"}}/>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  }
}

class LoginDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    }
  }

  handleFieldChange(field, newValue) {
    const fieldChanges = {};
    fieldChanges[field] = newValue;
    this.setState(fieldChanges);
  }

  onLogin() {
    const {onClose} = this.props;
    const {username, password} = this.state;
    API.post('/server/login', {username, password}).then(res => {
      if (res && res.data.message && res.data.message == "Authenticated") {
        onClose();
      } else {
        this.setState({errorMessage: "Incorrect username or password"});
      }
    }).catch(() => {
      this.setState({errorMessage: "Incorrect username or password"});
    })
  }

  render() {
    const {onClose} = this.props;
    const {username, password, errorMessage} = this.state;
    return <>
      <Dialog
        open
        onClose={() => {onClose()}}
      >
        <DialogTitle>
          Login
        </DialogTitle>
        <DialogContent>
          <TextField 
            label="Username"
            type="text"
            variant="outlined"
            value={username}
            InputLabelProps={{shrink: username ? true : false}}
            error={errorMessage}
            helperText={errorMessage}
            style={{margin: "10px"}}
            onChange={event => this.handleFieldChange("username", event.target.value)}
          />
          <TextField 
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            InputLabelProps={{shrink: password ? true : false}}
            error={errorMessage}
            helperText={errorMessage}
            style={{margin: "10px"}}
            onChange={event => this.handleFieldChange("password", event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => {onClose()}}>
            Cancel <CancelIcon style={{marginLeft: "10px"}}/>
          </Button>
          <Button variant="contained" color="primary" style={{marginLeft: "10px"}} disabled={!(username && password)} onClick={() => {this.onLogin()}}>
            Log In 
          </Button>
        </DialogActions>
      </Dialog>
    </>
  }
}

class RegisterDialog extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: "",
      password: "",
      retypePassword: "",
      age: "",
      lat: "",
      long: "",
    }
  }

  componentDidMount() {
    const {lat, long} = this.state;
    if (!lat && !long && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({lat: position.coords.latitude, long: position.coords.longitude});
      });
    }
  }

  handleFieldChange(field, newValue) {
    const fieldChanges = {};
    fieldChanges[field] = newValue;
    this.setState(fieldChanges);
  }

  onRegisterButton() {
    const {onRegister, onClose} = this.props;
    const {username, password, age, lat, long} = this.state;
    API.post('/server/register', {
      username, 
      password, 
      demographics: {
        age, 
        homebase: {
          lat,
          long,
        },
      },
    }).then(res => {
      console.log(res);
      if (res && res.data.message) {
        API.post('/server/login', {username, password}).then(innerRes => {
          console.log(innerRes);
          if (innerRes && innerRes.data.message && innerRes.data.message == "Authenticated") {
            onRegister();
            onClose();
          } else {
            this.setState({errorMessageUsername: "Incorrect username or password"});
          }
        }).catch(() => {
          this.setState({errorMessageUsername: "Incorrect username or password"});
        })
      } else {
        this.setState({errorMessageUsername: res.error});
      }
    })
  }

  render() {
    const {onClose} = this.props;
    const {username, password, retypePassword, age, lat, long, errorMessageUsername, errorMessagePassword, errorMessageAge, errorMessageCoords} = this.state;
    return <>
      <Dialog
        open
        onClose={() => {onClose()}}
      >
        <DialogTitle>
          Register
        </DialogTitle>
      <DialogContent>
      <DialogContentText>
        <TextField 
          label="Username"
          type="text"
          variant="outlined"
          value={username}
          InputLabelProps={{shrink: username ? true : false}}
          error={errorMessageUsername}
          helperText={errorMessageUsername}
          style={{margin: "10px"}}
          onChange={event => this.handleFieldChange("username", event.target.value)}
        />
        <TextField 
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          InputLabelProps={{shrink: password ? true : false}}
          error={errorMessagePassword}
          helperText={errorMessagePassword}
          style={{margin: "10px"}}
          onChange={event => this.handleFieldChange("password", event.target.value)}
        />
        <TextField 
          label="Retype Password"
          type="password"
          variant="outlined"
          value={retypePassword}
          InputLabelProps={{shrink: retypePassword ? true : false}}
          error={errorMessagePassword}
          helperText={errorMessagePassword}
          style={{margin: "10px"}}
          onChange={event => this.handleFieldChange("retypePassword", event.target.value)}
        />
        <TextField 
          label="Age"
          type="number"
          variant="outlined"
          value={age}
          InputLabelProps={{shrink: age ? true : false}}
          error={errorMessageAge}
          helperText={errorMessageAge}
          style={{margin: "10px"}}
          onChange={event => this.handleFieldChange("age", event.target.value)}
        />
        <TextField 
          label="Homebase Latitude"
          type="number"
          variant="outlined"
          value={lat}
          InputLabelProps={{shrink: lat ? true : false}}
          error={errorMessageCoords}
          helperText={errorMessageCoords}
          style={{margin: "10px"}}
          onChange={event => this.handleFieldChange("lat", event.target.value)}
        />
        <TextField 
          label="Homebase Longitude"
          type="number"
          variant="outlined"
          value={long}
          InputLabelProps={{shrink: long ? true : false}}
          error={errorMessageCoords}
          helperText={errorMessageCoords}
          style={{margin: "10px"}}
          onChange={event => this.handleFieldChange("long", event.target.value)}
        />
      </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={() => {onClose()}}>
          Cancel <CancelIcon style={{marginLeft: "10px"}}/>
        </Button>
        <Button variant="contained" color="primary" style={{marginLeft: "10px"}} disabled={!(username && password && retypePassword && (password == retypePassword) && age !== "" && lat !== "" && long != "")} onClick={() => {this.onRegisterButton()}}>
          Register 
        </Button>
      </DialogActions>
      </Dialog>
    </>
  }
}

class UserManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    }
    this.handleMenu.bind(this);
    this.handleClose.bind(this);
  }

  updateActiveUser() {
    API.get('/server/getActiveUser').then(res => {
      console.log(res.data);
      this.setState({user: res.data});
    })
  }

  componentDidMount() {
    this.updateActiveUser();
  }

  /* for handling profile menu */
  handleMenu(event) {
    console.log(event);
    this.setState({anchorEl: event.currentTarget, open: true});
  };

  /* for closing profile menu */
  handleClose() {
    console.log("Close");
    this.setState({anchorEl: null, open: false});
  };

  handleOpenRegisterUser() {
    this.setState({openDialog: "register"});
    this.handleClose();
  }

  handleCloseRegisterUser() {
    this.setState({openDialog: ""});
  }

  handleOpenLogin() {
    this.setState({openDialog: "login"});
    this.handleClose();
  }

  handleCloseLogin() {
    this.setState({openDialog: ""});
    this.updateActiveUser();
  }

  handleLogout() {
    console.log("Logging out");
    API.post('/server/logout').then(() => {
      console.log("Logged out");
      this.updateActiveUser();
    })
    this.handleClose();
  }

  handleOpenProfile() {
    console.log("Opening profile");
    this.setState({openDialog: "profile"});
    this.handleClose();
  }

  handleCloseProfile() {
    this.setState({openDialog: ""});
  }

  render() {
    const {user, open, anchorEl, openDialog} = this.state;
    return <>
      {
        {
          "register": <RegisterDialog onClose={() => this.handleCloseRegisterUser()} onRegister={() => this.updateActiveUser()}/>,
          "login": <LoginDialog onClose={() => this.handleCloseLogin()} />,
          "profile": <ProfileDialog onClose={() => this.handleCloseProfile()} user={user} />
        }[openDialog]
      }
      <div>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={e => this.handleMenu(e)}
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
          onClose={() => this.handleClose()}
        >
          {user ? (
            user._id ? 
              [
                <MenuItem onClick={() => this.handleOpenProfile()}>Profile</MenuItem>,
                <MenuItem onClick={() => this.handleLogout()}>Log out</MenuItem>,
              ] 
            : 
              [
                <MenuItem onClick={() => this.handleOpenLogin()}>Login</MenuItem>,
                <MenuItem onClick={() => this.handleOpenRegisterUser()}>Register</MenuItem>,
              ] 
          ) : 
            [] 
          }
          {/* <MenuItem onClick={() => this.handleClose()}>Profile</MenuItem>
          <MenuItem onClick={() => this.handleClose()}>My account</MenuItem> */}
        </Menu>
      </div>
    </>
    // if (user && user._id) {
    //   return <>
      
    // }
  }
}

export default withStyles(styles)(UserManager);