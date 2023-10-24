import { Box, CardContent, Collapse, FormControlLabel, Grid, Paper, Switch, Typography } from '@mui/material';
import React from 'react';
import '../styles.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import _ from 'lodash';
import selfQAZ from '../data.json';

export const CollapseQA = ({ selfQA }) => {
  // TODO: remove selfQAZ
  dayjs.extend(relativeTime);

  const [isChecked, setIsChecked] = React.useState(false);

  return (
    <>
      <div className="toggle-qa-container">
        <CardContent style={{ padding: 0 }}>
          <Typography style={{ padding: 0 }} variant="h4" gutterBottom>
            {_.isEmpty(selfQA) ? `You don't have a QA before` : 'You have submitted a QA before'}
          </Typography>
        </CardContent>
        <>
          {
            // TODO:
            !_.isEmpty(selfQAZ) ? (
              <>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isChecked}
                      onChange={() => {
                        setIsChecked((prev) => !prev);
                      }}
                    />
                  }
                  label="Toggle me to see your QA History"
                />
                <div style={{ display: 'flex', width: '100%' }}>
                  <Collapse in={isChecked} style={{ width: '100%' }}>
                    <Paper elevation={5} style={{ margin: 5, width: '100%' }}>
                      {!_.isEmpty(selfQAZ) ? (
                        selfQAZ.map((item, index) => {
                          const timeAgo = dayjs(item?.createAt).fromNow();
                          return (
                            <Grid key={index} container className="selfqa-item-wrap">
                              <Grid item xs={12} className="selfqa-item-time-num">
                                <Typography variant="h6">
                                  Question <strong>{index + 1}:</strong>
                                </Typography>
                                <Typography variant="h6">
                                  Create at <strong>{timeAgo}</strong>
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography className="item-title">{'Subject:'}</Typography>
                                <Box className="item-text">
                                  <Typography>{item?.subject}</Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography className="item-title">{'Content:'}</Typography>
                                <Box className="item-text">
                                  <Typography>{item?.content}</Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography className="item-title" style={{ color: '#8224e3' }}>
                                  {'Admin Reply For QA:'}
                                </Typography>
                                <Box className="item-text">
                                  <Typography>{item?.answerContent}</Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </Paper>
                  </Collapse>
                </div>
              </>
            ) : (
              <></>
            )
          }
        </>
      </div>
    </>
  );
};
