// Import React, tools and helpers
import React, { useState, Component, createRef, forwardRef } from 'react';

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

const StartCreateNewMap = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const clickOpen = () => {
    setOpen(true);
  };

  const clickClose = () => {
    setOpen(false);
  };

  const clickCloseAndStart = () => {
    setOpen(false);
    var newMapObj = {
      title: title,
      description: description,
      pointsOfInterest: [],
    };

    let oldState = ref.current.state.mapData.slice();
    oldState.push(newMapObj);
    ref.current.setState({ mapData: oldState });
  };

  const handleInputUpdate = (e) => {
    switch (e.target.id) {
      case 'title':
        setTitle(e.target.value);
        break;
      case 'description':
        setDescription(e.target.value);
        break;
      default:
        break;
    }
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
                onChange={handleInputUpdate}
              />
            </Box>
            <Box mb={2}>
              <TextField
                id="description"
                label="description"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleInputUpdate}
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
});

class Create extends Component {
  constructor() {
    super();
    this.mapSelect = createRef();
  }
  render() {
    return (
      <>
        <Header />
        <Container>
          <Box my={2}>
            <Grid container justify="space-between">
              <Typography variant="h4">
                Create a new map or edit one of your existing maps
              </Typography>
              <StartCreateNewMap
                mapSelectRef={this.mapSelect}
                ref={this.mapSelect}
              />
            </Grid>
          </Box>
          <MapSelect ref={this.mapSelect} />
        </Container>
      </>
    );
  }
}

export default Create;
