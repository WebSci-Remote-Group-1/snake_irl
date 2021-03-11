// Import React, tools and helpers
import React, { useState } from 'react';

// Import MaterialUI elements
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

// Import homebrewed files
import '@assets/style/create.scss';
import Header from '@components/shared/Header';
import MapSelect from '@components/shared/map-select';

export default function Create() {
  const [click, setClick] = useState(false);

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
        <MapSelect />
      </Container>
    </>
  );
}
