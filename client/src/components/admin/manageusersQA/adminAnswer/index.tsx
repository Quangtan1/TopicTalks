import { Card, CardContent, Container, Typography, TextField, Grid, Box, Paper } from '@mui/material';
import { Formik, Form } from 'formik';
import './styles.scss';
import { ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import { createAxios, putDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import { AiFillCloseCircle } from 'react-icons/ai';

const AdminAnswer = observer(({ isOpen, questionData, setIsOpenAnswer }) => {
  const account = accountStore?.account;

  const setAccount = (value) => {
    accountStore?.setAccount(value);
  };

  const handleClose = () => {
    setIsOpenAnswer(false);
  };

  const axiosJWT = createAxios(account, setAccount);

  const handleSubmit = (data, { resetForm }) => {
    console.log(data);
    const handleAnswer = () => {
      const qaAnswerData = {
        qaId: questionData.id,
        adminReplyId: account?.id,
        content: data.content,
      };
      putDataAPI('/qa/reply', qaAnswerData, account.access_token, axiosJWT)
        .then((res) => {
          resetForm();
          ToastSuccess('Reply Question Successfully!!!');
          setIsOpenAnswer(false);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    handleAnswer();
  };

  return isOpen ? (
    <Container className="container-answer-qa">
      <Grid className="grid-answer-qa">
        <Box className={'close-btn-wrap'} onClick={handleClose}>
          <AiFillCloseCircle className={'close-btn'} />
        </Box>
        <Card className="card-answer-qa">
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Admin Reply Question:
            </Typography>
          </CardContent>
        </Card>
        <Formik
          initialValues={{
            content: '',
          }}
          onSubmit={handleSubmit}
        >
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography sx={{ color: 'black', paddingY: 1, fontSize: 24 }}>{'Question Subject:'}</Typography>

                <Box sx={{ backgroundColor: 'black', padding: 2, maxHeight: 'fit-content' }}>
                  <Typography>{questionData?.subject}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: 'black', paddingY: 1, fontSize: 24 }}>{'Question Content:'}</Typography>

                <Box sx={{ backgroundColor: 'black', padding: 2, maxHeight: 'fit-content' }}>
                  <Typography>{questionData?.content}</Typography>
                </Box>
              </Grid>
              {questionData?.evdImageUrl && (
                <Grid item xs={12}>
                  <Typography sx={{ color: 'black', paddingY: 1, fontSize: 24 }}>Question Image:</Typography>

                  <Paper
                    sx={{
                      p: 2,
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <img src={questionData?.evdImageUrl} style={{ width: 'auto', height: '350px' }} alt="evdImageUrl" />
                  </Paper>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography sx={{ color: 'black', paddingY: 1, fontSize: 24 }}>{'Reply Content:'}</Typography>
                <TextField
                  required
                  value={questionData?.answerContent}
                  name="content"
                  disabled
                  label="Reply Content"
                  placeholder="Write your Reply Content..."
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={8}
                />
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Grid>
    </Container>
  ) : (
    <></>
  );
});

export default AdminAnswer;
