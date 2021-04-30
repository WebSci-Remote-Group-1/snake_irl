import React, { useState, useEffect } from 'react';
import Header from '@components/shared/Header.js';

import axios from 'axios';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useParams, useHistory } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  loading: {
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center'
  },
  profile: {
    padding: "20px",
    "background-color": "#fffafa"
  },
  maps: {
    padding: "10px"
  }
}));

const Profile = () => {
  const id = useParams().id;
  const history = useHistory();
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});

  /* Fetch user data when the page loads */
  useEffect(() => {
    fetchUserData();
  }, []);

  /*
  fetch user data function
  on success set the userData state with select user data
  on failure log the error to the console and redirect to the homepage
  Converts points to a comma delimited format
  Converts playtime from milliseconds to human readbale dhms format
  Pulls data for favorite and created maps
  */
  const fetchUserData = async () => {
    let res = (await axios.get(`/api/v1/player/${id}`));

    try {
      setUserData({
        username: res.data.username,
        points: res.data.points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        playtime: convertMS(res.data.totalPlaytime),
        bio: res.data.bio,
        age: res.data.demographics.age,
        numFriends: res.data.friends.length,
        favMaps: await fetchMaps(res.data.maps.favoriteMaps),
        maps: await fetchMaps(res.data.maps.createdMaps),
        privacy: res.data.privacy,
        socials: res.data.socialMedia
      });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      history.push('/');
    }
    /* axios.get(`/api/v1/player/${id}`).then((res) => {
      setUserData({
        username: res.data.username,
        points: res.data.points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        playtime: convertMS(res.data.totalPlaytime),
        age: res.data.demographics.age,
        numFriends: res.data.friends.length,
        favMaps: fetchMaps(res.data.maps.favoriteMaps),
        maps: fetchMaps(res.data.maps.createdMaps),
        socials: res.data.socialMedia
      });
      setIsLoading(false);
    }).catch((err) => {
      console.error(err);
      history.push('/');
    }); */
  };

  /*
  Convert playtime from MS to human readable dhms format
  */
  const convertMS = (ms) => {    
    let totalSeconds = parseInt(Math.floor(ms / 1000));
    let totalMinutes = parseInt(Math.floor(totalSeconds / 60));
    let totalHours = parseInt(Math.floor(totalMinutes / 60));
    let days = parseInt(Math.floor(totalHours / 24));
  
    let seconds = parseInt(totalSeconds % 60);
    let minutes = parseInt(totalMinutes % 60);
    let hours = parseInt(totalHours % 24);
    
    let formattedString = "";

    if (days > 0) {
      formattedString = formattedString + `${days}d `;
    }

    if (hours > 0) {
      formattedString = formattedString + `${hours}h `;
    }
    else if (hours === 0 && formattedString !== "") {
      formattedString = formattedString + "0h ";
    }

    if (minutes > 0) {
      formattedString = formattedString + `${minutes}m `;
    }
    else if (hours === 0 && formattedString !== "") {
      formattedString = formattedString + "0m ";
    }

    formattedString = formattedString + `${seconds}s`;

    return formattedString;
  };

  /*
  Fetch each map in a list of map ObjectIDs
  */
  const fetchMaps = async (mapids) => {
    let maps = [];
    for (let i = 0; i < mapids.length; i++) {
      await axios.get(`/api/v1/maps/${mapids[i]}`).then((res) => {
        maps.push({
          id: res.data._id,
          title: res.data.title,
          description: res.data.description
        });
      }).catch((err) => {
        console.error(err);
      });
    }
    return maps;
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
            {console.log(userData)}
            <Grid item xs></Grid>
            <Grid item xs={12}>
              <Paper elevation={1} className={classes.profile}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h4"
                      component="div"
                    >
                      {userData.username}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      component="div"
                    >
                      {userData.bio}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="subtitle1"
                      component="div"
                    >
                      {userData.points} points
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="subtitle1"
                      component="div"
                    >
                      {userData.playtime} playtime
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {userData.privacy.showCreated ? 
              (userData.maps.length > 0 ?
                <Grid container item spacing={1} xs={12}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h3"
                      component="div"
                    >
                      Created Maps
                    </Typography>
                  </Grid>
                  {userData.maps.map((item) => (
                    <Grid item xs={12} key={item.id}>
                      <Card className={classes.maps}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Typography
                              variant="h6"
                              component="div"
                            >
                              {item.title}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography
                              variant="subtitle2"
                              component="div"
                            >
                              {item.description}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              :
                <></>
              )
            :
              <></>
            }
            {userData.privacy.showFavorites ?
              (userData.maps.length > 0 ?
              <Grid container item spacing={1} xs={12}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h3"
                      component="div"
                    >
                      Favorite Maps
                    </Typography>
                  </Grid>
                  {userData.favMaps.map((item) => (
                    <Grid item xs={12} key={item.id}>
                      <Card className={classes.maps}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Typography
                              variant="h6"
                              component="div"
                            >
                              {item.title}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography
                              variant="subtitle2"
                              component="div"
                            >
                              {item.description}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              :
                <></>
              )
            :
              <></>
            }
          </Grid>
        }
      </Container>
    </div>
  );
}

export default Profile;