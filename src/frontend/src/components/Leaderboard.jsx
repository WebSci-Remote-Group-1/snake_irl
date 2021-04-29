import React from 'react';
import Header from './shared/Header.js';
import { Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import API from '../api';

const LeaderboardTable = (props) => {
	return (
		<>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableCell>User</TableCell>
						<TableCell align="right">Points</TableCell>
						<TableCell align="right">Time Played</TableCell>
					</TableHead>
					<TableBody>
						{
							props.data.map((user, idx) => {
								var backgroundColor = idx === 0 ? "gold" : idx === 1 ? "silver" : idx === 2 ? "#cd7f32" : "transparent";
								var gameHours = user.totalPlaytime < 1000 * 60 * 60 ? 0 : user.totalPlaytime % ( 1000 * 60 * 60 );
								var gameMinutes = user.totalPlaytime < 1000 * 60 ? 0 : user.totalPlaytime % ( 1000 * 60 );
								return (
								<TableRow key={idx} style={{"background-color": backgroundColor}}>
									<TableCell>{user.username}</TableCell>
									<TableCell align="right">{user.points.toFixed(2)}</TableCell>
										<TableCell align="right">{ `${ gameHours }:${gameMinutes}` }</TableCell>
								</TableRow>
							)})
						}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}

class Leaderboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			data: null,
			error: null
		}
	}

	componentDidMount() {
		API.get('/api/v1/ranks').then(res => {
			this.setState({
				loading: false,
				data: res.data
			});
		});
	}

	render() {
		return (
			<>
				<Header />
				<Container>
					<Box my={2}>
						{ this.state.loading ? <h1>Loading</h1> : <LeaderboardTable data={this.state.data} /> }
					</Box>
				</Container>
			</>
		);
	}
}

export default Leaderboard;
