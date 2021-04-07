import React from 'react';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Header from './shared/Header.js';

const MobileIndex = () => (
  <div>
    <Header/>
    <Container>
      <Box my={2}>
        <Typography variant="h1">Welcome!</Typography>
        <p>
          Welcome to snake_irl, the hit new game sweeping the nation!
          You are active on a mobile device, so you have access to the 
          following sections of the site:
        </p>
        <ul>
          <li>
            Play
          </li>
          <li>
            Leaderboards
          </li>
        </ul>
        <p>
          To access these parts of the site, either tap the menu button at the 
          top left of your screen, or swipe right from the left edge of your 
          screen.
        </p>
        <Typography variant="h2">Instructions</Typography>
        <p>
          The premise of the game is simple: eat as many pellets as possible 
          without running into your own trail! You have three lives, and every
          time you run into your trail, you lose a life. You can earn medals
          for every game you play, depending on if you win or lose, how far
          you went, and the difficulty of the mission. Additionally, you can
          play "unlimited snake", where you go as far as possible, earning many
          medals!
        </p>
        <p>
          Additionally, you can vote on missions and points of interest in the 
          Mission Select screen, to help determine the best missions and most
          interesting places in your area.
        </p>
        <p>
          Check out the leaderboards to see where you rank!
        </p>
        <Typography variant="h2">
          Happy snaking!
        </Typography>
        <p>&nbsp;</p>
        <Typography variant="h3">
          TODAY'S TOP SNAKER:
        </Typography>
        <Typography variant="h4">John Stamos</Typography>
      </Box>
    </Container>
  </div>
);

export default MobileIndex;
