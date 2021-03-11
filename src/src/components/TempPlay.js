import React from 'react';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Header from './shared/Header.js';

const TempPlay = () => (
  <div>
    <Header/>
    <Container>
      <Box my={2}>
        {[...new Array(24)]
          .map(
            () => `OH YEAH IT'S PLAYTIME BABY. oh yeah it's playtime baby. 
            OH YEAH IT'S PLAYTIME BABY. oh yeah it's playtime baby. 
            OH YEAH IT'S PLAYTIME BABY. oh yeah it's playtime baby. 
            OH YEAH IT'S PLAYTIME BABY. oh yeah it's playtime baby. `,
          )
          .join('\n')}
      </Box>
    </Container>
  </div>
);

export default TempPlay;
