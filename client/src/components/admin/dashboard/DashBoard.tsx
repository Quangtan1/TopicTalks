import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { ResponsiveContainer } from 'recharts';
import PieChartColor from './chart/pieColorChart';
import './styles.scss';
import BarChartItem from './chart/barChart';
import ChartTopicChildWGroupChat from './chart/pieSolidChart';
import { BsDot, BsGenderTrans } from 'react-icons/bs';
import { admin_dashboard, createAxios, getDataAPI } from 'src/utils';
import React, { useEffect, memo, useState } from 'react';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import uiStore from 'src/store/uiStore';

interface Gender {
  female: number;
  male: number;
  others: number;
}
interface TopicState {
  topicId: number;
  topicName: string;
  totalGroupChat: number;
  totalPost: number;
}
const DashBoard = observer(() => {
  const [age, setAge] = useState<number[]>([]);
  const [gender, setGender] = useState<Gender>(null);
  const [topicData, setTopicData] = useState<TopicState[]>([]);
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);
  useEffect(() => {
    uiStore?.setLoading(true);
    getDataAPI(`/user/all-age`, account.access_token, axiosJWT)
      .then((res) => {
        setAge(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getDataAPI(`/user/all-gender`, account.access_token, axiosJWT)
      .then((res) => {
        setGender(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getDataAPI(`/topic-parent/retrieve`, account.access_token, axiosJWT)
      .then((res) => {
        setTopicData(res.data);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const totalGender = gender?.others + gender?.male + gender?.female;

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
                  <PieChartColor gender={gender} />
                  <Box className="sex_data">
                    <Typography>
                      <BsDot /> Male: {((gender?.male * 100) / totalGender).toFixed(0)}%
                    </Typography>
                    <Typography>
                      <BsDot /> Female: {((gender?.female * 100) / totalGender).toFixed(0)}%
                    </Typography>
                    <Typography>
                      <BsDot /> Other: {((gender?.others * 100) / totalGender).toFixed(0)}%
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item md={7.8} sm={6} xs={12} className="itemImage">
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
            <Grid item md={4} sm={6} xs={12} className="itemChart1">
              <Paper className="firstRowPaper">
                <Box>
                  <Typography className="charTextTitleItem1">Age Group Chart</Typography>
                  <Typography className="charTextItem1">Most Popular Age in System</Typography>
                </Box>
                <Box className="age_box">
                  <ChartTopicChildWGroupChat age={age} />
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
                <BarChartItem topicData={topicData} />
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
});

export default DashBoard;
