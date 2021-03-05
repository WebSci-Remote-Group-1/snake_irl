// Import React, tools and helpers
import React, { useState } from 'react';

// Import MaterialUI elements
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

// Import homebrewed files
import '@assets/style/create.scss';

export default function Create() {
  const [click, setClick] = useState(false);

  return (
    <>
      <Grid id="create-space" container justify="center" alignItems="center">
        <Grid item>
          <Button
            disableElevation
            color={click ? 'primary' : 'secondary'}
            variant="contained"
            onClick={() => setClick(!click)}
          >
            Create a map
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
