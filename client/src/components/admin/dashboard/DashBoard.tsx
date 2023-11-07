import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
import PieChartColor from './pieColorChart';
import './styles.scss';
import { dataChart01 } from './helpers';
import BarChartItem from './barChart';
import chartImage from 'src/assets/images/chart.svg';

const DashBoard = () => {
  return (
    <ResponsiveContainer className="containerChart" style={{ marginLeft: 250, marginTop: 50 }}>
      <>
        <Box className="titleGroup">
          <Typography variant="h3">Dashboard</Typography>
          <Typography variant="body1">Dashboard</Typography>
        </Box>
        <Grid container className="row1">
          <Grid item md={4} sm={6} xs={12} spacing={2} className="itemChart1">
            <Paper className="firstRowPaper">
              {/* item 1 height */}
              <PieChart width={300} height={240}>
                <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={dataChart01}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
              </PieChart>
              <Box>
                <Typography variant="h6" className="charTextTitleItem1">
                  Topic Chart
                </Typography>
                <Typography variant="body1" className="charTextItem1">
                  Most popular Topic Chart
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item md={7.8} sm={6} xs={12} spacing={2} className="itemImage">
            <Paper className="firsRowImage">
              <Box>
                <Typography className="text" variant="h3">
                  Sex Chart
                </Typography>
                <Typography className="text" variant="body1">
                  Most popular sex Chart
                </Typography>
              </Box>
              <img className="imageSVGChart" src={chartImage} alt="chartImage" />
            </Paper>
          </Grid>
        </Grid>
        <Grid container className="row2">
          <Grid item md={4} sm={6} xs={12}>
            <Paper className="chart2">
              <PieChartColor />
              <Box>
                <Typography className="text" variant="h4">
                  Chart 2
                </Typography>
                <Typography className="text" variant="h6">
                  Most popular Chart
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item md={7.8} sm={6} xs={12} spacing={3}>
            <Paper className="chart3">
              <BarChartItem />
              <Box sx={{ paddingBottom: 4 }}>
                <Typography className="text" variant="h4">
                  Chart 3
                </Typography>
                <Typography className="text" variant="h6">
                  Most popular Chart
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </>
    </ResponsiveContainer>
  );
};

export default DashBoard;
