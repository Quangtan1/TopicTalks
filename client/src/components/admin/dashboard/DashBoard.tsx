import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { ResponsiveContainer } from 'recharts';
import PieChartColor from './chart/pieColorChart';
import './styles.scss';
import BarChartItem from './chart/barChart';
import ChartTopicChildWGroupChat from './chart/pieSolidChart';
import { BsDot, BsGenderTrans } from 'react-icons/bs';
import { admin_dashboard } from 'src/utils';

const DashBoard = () => {
  return (
    <ResponsiveContainer className="containerChart">
      <>
        <Box className="titleGroup">
          <Typography className="title">Dashboard</Typography>
          <Typography className="title">Here's an Overview of TopicTalks Data</Typography>
        </Box>
        <Box className="box_chart">
          <Grid container className="row1" spacing={18}>
            <Grid item md={4} sm={6} xs={12}>
              <Paper className="chart2">
                <Typography className="text">
                  <BsGenderTrans /> Gender Chart
                </Typography>
                <Typography className="avg_gender">Avg order Value</Typography>
                <Box className="box_chart1">
                  <PieChartColor />
                  <Box className="sex_data">
                    <Typography>
                      <BsDot /> Male: 55%
                    </Typography>
                    <Typography>
                      <BsDot /> Female: 35%
                    </Typography>
                    <Typography>
                      <BsDot /> Other: 10%
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item md={7.8} sm={6} xs={12} spacing={2} className="itemImage">
              <Paper className="firsRowImage">
                <Box className="box_content">
                  <Typography className="text">Good admin theme is a tool of enthusiasm</Typography>
                  <Button disabled={true}>Discovery Now</Button>
                </Box>
                <img className="imageSVGChart" src={admin_dashboard} alt="chartImage" />
              </Paper>
            </Grid>
          </Grid>
          <Grid container className="row2" spacing={18}>
            <Grid item md={4} sm={6} xs={12} spacing={2} className="itemChart1">
              <Paper className="firstRowPaper">
                <Box>
                  <Typography className="charTextTitleItem1">Age Group Chart</Typography>
                  <Typography className="charTextItem1">Most Popular Age in System</Typography>
                </Box>
                <Box className="age_box">
                  <ChartTopicChildWGroupChat />
                  <Box className="age_data">
                    <Typography>
                      <BsDot /> {`< 18`}
                    </Typography>
                    <Typography>
                      <BsDot /> {`18 - 30`}
                    </Typography>
                    <Typography>
                      <BsDot /> {`> 30`}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item md={7.8} sm={6} xs={12}>
              <Paper className="chart3">
                <BarChartItem />
                <Box className="box_chart3">
                  <Typography>Most popular Topic in System</Typography>
                  <Typography>pv: Total number of post views</Typography>
                  <Typography>uv: Total number of group chat views</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </>
    </ResponsiveContainer>
  );
};

export default DashBoard;
