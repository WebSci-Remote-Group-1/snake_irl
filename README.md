# snake_irl

## Installation
### Configuring your database
Take a look at the [database documentation](docs/mongo_schemas.md) for the required database collections and database users. Note that the database must be named "snake_irl"

### Required files
Not included in this repo are several dotfiles, specifically `.env` files in several locations which provide connections to the mongoDB server.
Here is a list of necesary `.env` files to run the game server:
- `/src/backend/.env`
  - `MONGO_URI` &rarr; a URI to a mongo server in the form _(note that this does not include the URI protocol)_ `<mongo server URI>`
  - `MGDB_PLAYERMANAGER` &rarr; a username-password pair for a mongo user in the form `<mongo username>:<mongo password>`
  - `MGDB_MAPMANAGER` &rarr; a username-password pair for a mongo user in the form `<mongo username>:<mongo password>`

While not necesary for running the actual server, there is another `.env` file in the project for some convenience in the `/src/backend/helperTools/.env`

_The helper tools include some python scripts for things like random user generation as well as easier human-map batch entry, not including this file will not impact snakeIRL's ability to run or to be developed_
- `MGDB_PLAYER_URI` &rarr; a full mongo uri in the form `<mongo protocol header>://<mongo username>:<mongo password>@<mongo server URI>`
- `MGDB_MAP_URI` &rarr; a full mongo uri in the form `<mongo protocol header>://<mongo username>:<mongo password>@<mongo server URI>`

### Setup and Execution

_Note that this project assumes that you have installed nodejs >= 15 and npm_

To install the dependencies for both the frontend and backend of the server, run `npm run dev-install` from the project root,
this installs the packages required to use the frontend and backend at the same time.

To start the program as a developer run `npm run dev-start` from the project root,
this starts the frontend development server as well as the backend API server with one command
