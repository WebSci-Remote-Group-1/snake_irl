import React, { useState, useEffect } from 'react';
import Header from '@components/shared/Header';

import axios from 'axios';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/styles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles((theme) => ({
  loading: {
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center'
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  }
}));

const Account = () => {
  const classes = useStyles();
  const maxBioLength = 128;
  const privacyLabels = {
    showCreated: "Show created maps on profile",
    showFavorites: "Show favorite maps on profile",
  };

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [lat, setLat] = useState(0.0);
  const [long, setLong] = useState(0.0);
  const [bio, setBio] = useState("");
  const [privacySettings, setPrivacySettings] = useState({
    showCreated: true,
    showFavorites: true,
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    newConf: false,
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConf, setNewPasswordConf] = useState("");

  /*
  When the page loads grab the user account data
  */
  useEffect(() => {
    fetchUserData();
  }, []);

  /*
  After the user data is fetched load it into page states
  */
  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      setLat(userData.homebase.lat);
      setLong(userData.homebase.long);
      setBio(userData.bio);
      setPrivacySettings(userData.privacy);
    }
  }, [userData])

  /*
  Fetch the user data and load it into the page state
  */
  const fetchUserData = async () => {
    axios.get(`/server/getActiveUser`).then((res) => {
      setUserData({
        username: res.data.username,
        homebase: res.data.demographics.homebase,
        bio: res.data.bio,
        privacy: res.data.privacy
      });
      setIsLoading(false);
    }).catch((err) => {
      console.error(err);
    });
  };

  /*
  Handle updating an input text state when it is changed
  */
  const inputTextHandler = (e, setFn) => {
    setFn(e.target.value);
  };

  /*
  Handle a privacy switch being flipped
  */
  const privacySwitchHandler = (e) => {
    setPrivacySettings({ ...privacySettings, [e.target.name]: e.target.checked });
  };

  /*
  When the update button is pressed for account data, update it
  Return success on complete, or error on error
  */
  const updateUserData = async () => {

  };

  /*
  When the update password button is pressed, update it
  Return success on complete, or error on error
  */
  const updateUserPassword = async () => {

  };

  return (
    <div>
      <Header />
      <Container>
        {isLoading ?
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        :
          <Grid container spacing={2}>
            <Grid item xs></Grid>
            <Grid item xs={12}>
              <Typography
                variant="h2"
                component="div"
              >
                Account Settings
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <form autoComplete="off">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl disabled>
                      <InputLabel htmlFor="username">Username</InputLabel>
                      <Input 
                        id="username" 
                        name="username" 
                        value={userData.username} 
                      />
                    </FormControl>
                  </Grid>
                  <Grid container item xs={12}>
                    <Grid item xs={3}>
                      <FormControl>
                        <InputLabel htmlFor="latitude">Homebase Latitude</InputLabel>
                        <Input 
                          id="latitude" 
                          name="latitude" 
                          value={lat} 
                          onChange={(e) => inputTextHandler(e, setLat)} 
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl>
                        <InputLabel htmlFor="longitude">Homebase Longitude</InputLabel>
                        <Input 
                          id="longitude" 
                          name="longitude" 
                          inputProps={{pattern: "^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$"}}
                          value={long} 
                          onChange={(e) => inputTextHandler(e, setLong)} 
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl>
                      <InputLabel htmlFor="bio">Bio</InputLabel>
                      <Input 
                        id="bio" 
                        name="bio" 
                        value={bio} 
                        onChange={(e) => inputTextHandler(e, setBio)} 
                        inputProps={{maxLength: maxBioLength}} 
                        multiline
                        aria-describedby="bio-helper-text"
                      />
                      <FormHelperText id="bio-helper-text">{bio.length}/{maxBioLength}</FormHelperText>
                    </FormControl>
                  </Grid>
                  {Object.keys(privacySettings).map((item) => (
                    <Grid item xs={12} key={item}>
                      <FormControlLabel 
                        control={<Switch 
                          name={item}
                          checked={privacySettings[item]} 
                          onChange={(e) => privacySwitchHandler(e)} 
                          />}
                        label={privacyLabels[item]}
                      />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="secondary"
                    >
                      Apply Changes
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl>
                      <InputLabel htmlFor="old-password">Old Password</InputLabel>
                      <Input
                        id="old-password"
                        name="old-password"
                        type={showPassword.old ? 'text' : 'password'}
                        value={oldPassword}
                        onChange={(e) => inputTextHandler(e, setOldPassword)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => {setShowPassword({ ...showPassword, old: !showPassword.old })}}
                              onMouseDown={(e) => {e.preventDefault()}}
                            >
                              {showPassword.old ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid container item spacing={1} xs={12}>
                    <Grid item xs={3}>
                      <FormControl>
                        <InputLabel htmlFor="new-password">New Password</InputLabel>
                        <Input
                          id="new-password"
                          name="new-password"
                          type={showPassword.new ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => inputTextHandler(e, setNewPassword)}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => {setShowPassword({ ...showPassword, new: !showPassword.new })}}
                                onMouseDown={(e) => {e.preventDefault()}}
                              >
                                {showPassword.new ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                    <FormControl>
                      <InputLabel htmlFor="new-password-conf">Confirm New Password</InputLabel>
                        <Input
                          id="new-password-conf"
                          name="new-password-conf"
                          type={showPassword.newConf ? 'text' : 'password'}
                          value={newPasswordConf}
                          onChange={(e) => inputTextHandler(e, setNewPasswordConf)}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => {setShowPassword({ ...showPassword, newConf: !showPassword.newConf })}}
                                onMouseDown={(e) => {e.preventDefault()}}
                              >
                                {showPassword.newConf ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="secondary"
                    >
                      Change Password
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        }
      </Container>
    </div>
  );
};

export default Account;