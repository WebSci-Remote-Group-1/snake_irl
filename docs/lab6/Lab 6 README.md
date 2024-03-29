# Creativity

# Worklog
- Sean:
	- Created placeholder data for mongoDB to draw insights upon
	- Created ETL methods for express server and created ExpressJS endpoints for fetch data from mongo -> ETL -> send to client (`/api/v1/data/:datatype`)
	- Created MongoDB interaction libraries for ExpressJS API server
	- Created Admin page on frontend
	- Created BarDataCard and ScatterDataCard components
	- Implemented `react-vis` data visualization for "Player Age" and "Player Points vs Player Total Game Time"
	- Added gradient coloring to graph visualizations

- Brooke: 
	- Implemented `react-vis` data visualization for "Player Playtime" and "Player Points" in order to give more context to the "Player Points vs Player Total Game Time" scatter plot

- Elijah: 
  - Implemented `react-vis` data visualization for "Username Length vs Points" and "Player Age vs Points" to show additional relationships between the data

- Alden:
	- Implemented `react-vis` data visualization for "Time Since Last Login" and "Time Since Last Login vs Playtime" to show information about user retention

# Installation Instructions

Use `npm run dev-install` in the project root to prepare the directory, and then
`yarn run dev-start` to start both the frontend and backend.

`yarn` is preferred as `react-vis` has a minor dependency error with the latest version of `react`, `npm` can work but you need to use the `--force` flag. Additionally, two .env files are required, one in /src/backend, and one in /src/backend/helperTools. These can be provided upon request, but are not included in the repository by default.
