import { Box, Grid, Paper, Typography } from '@mui/material';
import { ResponsiveContainer } from 'recharts';
import PieChartColor from './chart/pieColorChart';
import './styles.scss';
import BarChartItem from './chart/barChart';
import chartImage from 'src/assets/images/chart.svg';
import ChartTopicChildWGroupChat from './chart/pieSolidChart';

const DashBoard = () => {
  return (
    <ResponsiveContainer className="containerChart" style={{ marginLeft: 250, marginTop: 50 }}>
      <>
        <Box className="titleGroup">
          <Typography variant="h3" className="text">
            Welcome to TopicTalks Dashboard
          </Typography>
          <Typography variant="body1" className="text">
            Here's an Overview of TopicTalks Data
          </Typography>
        </Box>
        <Grid container className="row1">
          <Grid item md={4} sm={6} xs={12} spacing={2} className="itemChart1">
            <Paper className="firstRowPaper">
              <Box>
                <Typography variant="h6" className="charTextTitleItem1">
                  Topics of Highest Interest Within Group Chats
                </Typography>
                <Typography variant="body1" className="charTextItem1">
                  Most Popular Topics and Group Chats
                </Typography>
              </Box>
              <ChartTopicChildWGroupChat />
              <Typography variant="body2" className="charSubTextItem1">
                Unit: individuals
              </Typography>
            </Paper>
          </Grid>
          <Grid item md={7.8} sm={6} xs={12} spacing={2} className="itemImage">
            <Paper className="firsRowImage">
              <Box>
                <Typography className="text" variant="h5">
                  Good admin theme is a tool of enthusiasm
                </Typography>
                <Typography className="text" variant="body1"></Typography>
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
                  Sex Chart
                </Typography>
                <Typography className="text" variant="h6">
                  Gender Distribution
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
                <Typography style={{ color: '#8884d8' }} className="textNote" variant="body1">
                  pv: Total number of post views
                </Typography>
                <Typography style={{ color: '#82ca9d' }} className="textNote" variant="body1">
                  uv: Total number of topic views
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
