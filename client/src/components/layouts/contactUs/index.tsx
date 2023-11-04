import { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Grid, MenuItem } from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import { RE_CAPTCHA_SITE_KEY } from 'src/utils/helper';
import { ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import { createAxios, getDataAPI, postDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import uiStore from 'src/store/uiStore';
import contactusSVG from 'src/assets/images/contactus.svg';
import './styles.scss';
import FAQSection from './QAsection';

const ContactUs = observer(() => {
  const setAccount = () => {
    return accountStore?.setAccount;
  };
  const account = accountStore?.account;
  const axiosJWT = createAxios(account, setAccount);

  const [isShowBtnSend, setIsShowBtnSend] = useState(false);
  const [questionAbout, setQuestionAbout] = useState('');
  const [message, setMessage] = useState('');

  const [selfQA, setSelfQA] = useState([]);

  useEffect(() => {
    uiStore?.setLoading(true);
    getDataAPI(`/qa/${account.id}/all`, account.access_token, axiosJWT)
      .then((res) => {
        if (res.status === 200) setSelfQA(res?.data?.data);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        uiStore?.setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    const sendQA = () => {
      const qaData = {
        senderId: account?.id,
        subject: `I have a question about ${questionAbout}`,
        content: message,
      };
      postDataAPI('/qa/create', qaData, account?.access_token, axiosJWT)
        .then((res) => {
          ToastSuccess('Send Question Successfully!!!');
          setMessage('');
          setQuestionAbout('');
        })
        .catch((err) => {
          console.log(err);
        });
    };
    sendQA();
  };

  const onSuccessReCaptcha = () => {
    setIsShowBtnSend(true);
  };

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  return (
    <Container maxWidth="md" className="contactUs-container">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <img src={contactusSVG} alt="Maggie_Aboutme02" style={{ width: '100%', height: 500 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div>
            <Typography className="text" variant="body1">
              SAY HELLO
            </Typography>
            <Typography className="text" variant="h4">
              Thank you for getting in touch with me! We look forward to hearing from you!
            </Typography>
            <form>
              <TextField
                select
                label="I have a question about"
                fullWidth
                margin="normal"
                value={questionAbout}
                onChange={(e) => setQuestionAbout(e.target.value)}
              >
                <MenuItem value="Post">Post</MenuItem>
                <MenuItem value="Message">Message</MenuItem>
                <MenuItem value="Chat 1:1">Chat 1:1</MenuItem>
                <MenuItem value="Chat group">Chat group</MenuItem>
                <MenuItem value="random chat problems">Random chat problems</MenuItem>
                <MenuItem value="security problems">Security problems</MenuItem>
                <MenuItem value="report account">Report account</MenuItem>
              </TextField>
              <TextField
                value={message}
                onChange={handleChangeMessage}
                label="Message"
                multiline
                rows={4}
                fullWidth
                margin="normal"
              />
              {message && (
                <Grid item xs={12}>
                  <ReCAPTCHA sitekey={RE_CAPTCHA_SITE_KEY} onChange={onSuccessReCaptcha} />,
                </Grid>
              )}
              {isShowBtnSend && (
                <Grid item xs={12} className="btn-wrap">
                  <Button
                    className="button-Send"
                    variant="contained"
                    color="primary"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Send Message
                  </Button>
                </Grid>
              )}
            </form>
          </div>
        </Grid>
      </Grid>
      <FAQSection selfQA={selfQA} />
    </Container>
  );
});

export default ContactUs;
