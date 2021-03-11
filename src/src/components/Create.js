// Import React, tools and helpers
import React, { useState } from 'react';

// Import MaterialUI elements
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Import homebrewed files
import '@assets/style/create.scss';
import Header from '@components/shared/Header';

// Import frontend demo placeholder files
import Maps from '@assets/frontend-placeholders/created_maps.json';

const MapCard = (props) => (
  <Card>
    <CardContent>
      <Typography>{props.title}</Typography>
      <Typography>{props.description}</Typography>
    </CardContent>
  </Card>
);

export default function Create() {
  const [click, setClick] = useState(false);

  Maps['maps'].map((map) => console.log(map));
  return (
    <>
      <Header />
      <Container>
        <Button
          disableElevation
          color={click ? 'primary' : 'secondary'}
          variant="contained"
          onClick={() => setClick(!click)}
        >
          Create a map
        </Button>
        <Grid container justify="center" alignItems="center" spacing={5}>
          {Maps['maps'].map((map) => (
            <Grid item>
              <MapCard title={map.title} description={map.description} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
