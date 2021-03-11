// Import React, tools and helpers
import React, { useState } from 'react';

// Import MaterialUI elements
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';

// Import homebrewed files
import '@assets/style/create.scss';
import Header from '@components/shared/Header';
import MapSelect from '@components/shared/map-select';

function StartCreateNewMap() {
  const [open, setOpen] = useState(false);
  const clickOpen = () => {
    setOpen(true);
  };
  const clickClose = () => {
    setOpen(false);
  };
  const clickCloseAndStart = () => {
    setOpen(false);
    console.log("This is where we'll begin the map editor");
  };

  return (
    <>
      <Button color="primary" variant="contained" onClick={clickOpen}>
        Create a map
      </Button>
      <Dialog
        open={open}
        onClose={clickClose}
        aria-labelledby="create-map-dialog"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Create a new map</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details of your new map to get started
          </DialogContentText>
          <form noValidate autoComplete="off">
            <Box my={2}>
              <TextField
                autoFocus
                id="title"
                label="title"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Box>
            <Box mb={2}>
              <TextField
                autoFocus
                id="description"
                label="description"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={clickCloseAndStart} color="primary">
            Save
          </Button>
          <Button onClick={clickClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const Create = () => (
  <>
    <Header />
    <Container>
      <Box my={2}>
        <Grid container justify="space-between">
          <Typography variant="h4">
            Create a new map or edit one of your existing maps
          </Typography>
          <StartCreateNewMap />
        </Grid>
      </Box>
      <MapSelect />
    </Container>
  </>
);

export default Create;
