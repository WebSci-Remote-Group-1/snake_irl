# snake_irl

## Installation
### Required files
Not included in this repo are several dotfiles, specifically `.env` files in several locations which provide connections to the mongoDB server.
Here is a list of necesary `.env` files to run the game server:
- `/src/.env`
  - `MONGO_URI` &rarr; a URI to a mongo server in the form _(note that this does not include the URI protocol)_ `<mongo server URI>`
  - `MGDB_PLAYERMANAGER` &rarr; a username-password pair for a mongo user in the form `<mongo username>:<mongo password>`
  - `MGDB_MAPMANAGER` &rarr; a username-password pair for a mongo user in the form `<mongo username>:<mongo password>`

While not necesary for running the actual server, there is another `.env` file in the project for some convenience in the `/src/helperTools/.env`
- `MGDB_PLAYER_URI` &rarr; a full mongo uri in the form `<mongo protocol header>://<mongo username>:<mongo password>@<mongo server URI>`
- `MGDB_MAP_URI` &rarr; a full mongo uri in the form `<mongo protocol header>://<mongo username>:<mongo password>@<mongo server URI>`

### Setup and Execution
In the root of this project there is a Makefile which is used for easy installation, running, and uninstallation

_Note that this project assumes that you have installed nodejs >= 15, npm/yarn, and cmake_

All commands displayed below should be run with the prefix `make`
- `install`: Installs the dependencies for both the frontend and backend
- `clean`: Uninstalls project dependencies for both the frontend and backend
- `all`: Starts both the backend API server and frontend client site simultaneously on 2 seperate threads
- `startExpress`: Starts only the backend API server
- `startReact`: Starts only the frontend client site

If you are not installing using the `Makefile` then follow these steps:
- in `/src`
   - `npm install` or `yarn install`
   - `npm start` or `yarn start`
- in `/src/frontend`
  - `npm install --force` or `yarn install`
  - `npm start` or `yarn start`

_Note that if using this method you'll need 2 terminal instances as both iterations of the `start` command will block_
