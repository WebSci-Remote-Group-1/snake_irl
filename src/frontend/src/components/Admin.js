import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  MuiDialogActions,
  MuiDialogContent,
  MuiDialogTitle,
  Grid,
  Typography,
} from '@material-ui/core';
import {
  FlexibleXYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalBarSeries,
  MarkSeries,
  GradientDefs,
} from 'react-vis';
import ReactLoading from 'react-loading';

import Header from './shared/Header.js';
import API from '../api';

class BarDataCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: null,
      title: props.title,
      raw_csv: null,
      csv_dialog_open: false,
    };
  }

  async componentDidMount() {
    API.get('/api/v1/data/players?filters=demographics.age').then((data) => {
      this.setState({
        raw_csv: data.data.payload,
        data: this.props.parseData(data.data.payload.split('\n')),
        loading: false,
      });
    });
  }

  openCSV = () => this.setState({ csv_dialog_open: true });
  closeCSV = () => this.setState({ csv_dialog_open: false });

  render() {
    return (
      <Box mx={3}>
        <Card>
          <CardContent>
            <Box textAlign="center">
              <Typography variant="h4">{this.state.title}</Typography>
            </Box>
            {this.state.loading ? (
              <Grid container justify="center">
                <ReactLoading type="cylon" color="aabbcc" heigh="300px" />
              </Grid>
            ) : (
              <FlexibleXYPlot height={300} width={450} xType={this.props.xType}>
                <GradientDefs>
                  <linearGradient
                    id="GraphGradient"
                    gradientTransform="rotate(90)"
                  >
                    <stop offset="5%" stop-color="#0000ff88"></stop>
                    <stop offset="95%" stop-color="#fb7b8e88"></stop>
                  </linearGradient>
                </GradientDefs>

                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis title={this.props.xlabel ? this.props.xlabel : ''} />
                <YAxis title={this.props.ylabel ? this.props.ylabel : ''} />
                <VerticalBarSeries
                  data={this.state.data}
                  color={'url(#GraphGradient)'}
                />
              </FlexibleXYPlot>
            )}
          </CardContent>
          <CardActions>
            <Button onClick={this.openCSV}>View CSV</Button>
          </CardActions>
        </Card>

        <Dialog onClose={this.closeCSV} open={this.state.csv_dialog_open}>
          <DialogTitle onClose={this.closeCSV}>Here's the raw data</DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>{this.state.raw_csv}</Typography>
          </DialogContent>
        </Dialog>
      </Box>
    );
  }
}

class ScatterDataCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: null,
      title: props.title,
      raw_csv: null,
      csv_dialog_open: false,
      domainBound: 0,
      rangeBound: 0,
    };
  }

  async componentDidMount() {
    API.get('/api/v1/data/players?filters=points,totalPlaytime').then(
      (data) => {
        this.setState({
          raw_csv: data.data.payload,
          data: this.props.parseData(data.data.payload.split('\n')),
          loading: false,
        });
        let maxX = 0,
          maxY = 0;
        this.state.data.map((element) => {
          if (element.x > maxX) maxX = element.x;
          if (element.y > maxY) maxY = element.y;
        });

        this.setState({ domainBound: maxX, rangeBound: maxY });
      }
    );
  }

  openCSV = () => this.setState({ csv_dialog_open: true });
  closeCSV = () => this.setState({ csv_dialog_open: false });

  render() {
    return (
      <Box mx={3}>
        <Card>
          <CardContent>
            <Box textAlign="center">
              <Typography variant="h4">{this.state.title}</Typography>
            </Box>
            {this.state.loading ? (
              <Grid container justify="center">
                <ReactLoading type="cylon" color="aabbcc" heigh="300px" />
              </Grid>
            ) : (
              <FlexibleXYPlot
                height={300}
                width={450}
                xType={this.props.xType}
                xDomain={[0, this.state.domainBound]}
                yDomain={[0, this.state.rangeBound]}
                margin={{ left: 60 }}
              >
                <GradientDefs>
                  <linearGradient
                    id="ScatterGraphGradient"
                    gradientTransform="rotate(90)"
                  >
                    <stop offset="50%" stop-color="#0000ff88"></stop>
                    <stop offset="99%" stop-color="#fb7b8e88"></stop>
                  </linearGradient>
                </GradientDefs>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis title={this.props.xlabel ? this.props.xlabel : ''} />
                <YAxis title={this.props.ylabel ? this.props.ylabel : ''} />
                <MarkSeries
                  data={this.state.data}
                  color={'url(#ScatterGraphGradient)'}
                />
              </FlexibleXYPlot>
            )}
          </CardContent>
          <CardActions>
            <Button onClick={this.openCSV}>View CSV</Button>
          </CardActions>
        </Card>

        <Dialog onClose={this.closeCSV} open={this.state.csv_dialog_open}>
          <DialogTitle onClose={this.closeCSV}>Here's the raw data</DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>{this.state.raw_csv}</Typography>
          </DialogContent>
        </Dialog>
      </Box>
    );
  }
}

const parseAgeData = (rawData) => {
  let retObj = [
    { x: '<18', y: 0 },
    { x: '18-25', y: 0 },
    { x: '26-35', y: 0 },
    { x: '36-45', y: 0 },
    { x: '46-55', y: 0 },
    { x: '55>', y: 0 },
  ];

  rawData.slice(1, -1).map((point) => {
    if (point < 18) retObj[0].y += 1;
    else if (point >= 18 && point < 26) retObj[1].y += 1;
    else if (point >= 26 && point < 35) retObj[2].y += 1;
    else if (point >= 36 && point < 46) retObj[3].y += 1;
    else if (point >= 46 && point < 55) retObj[4].y += 1;
    else if (point >= 55) retObj[5].y += 1;
  });

  return retObj;
};

const parsePointsAgainstPlaytime = (rawData) => {
  let retObj = [];

  rawData.slice(1, -1).map((point) => {
    point = point.split(',');
    retObj.push({ x: point[1], y: point[0] });
  });

  return retObj;
};

export const Admin = () => {
  return (
    <div>
      <Header />
      <Container>
        <Box my={2}>
          <Typography variant="h2">Administration:</Typography>
        </Box>
        <Box mt={5} mb={2}>
          <Typography variant="h3">Insights</Typography>
        </Box>
        <Grid container>
          <BarDataCard
            title="Age of Players"
            parseData={parseAgeData}
            xType="ordinal"
          />
          <ScatterDataCard
            title="Playtime vs Points"
            parseData={parsePointsAgainstPlaytime}
            xType="linear"
            xlabel="Hours played"
            ylabel="Total points"
          />
        </Grid>
      </Container>
    </div>
  );
};
