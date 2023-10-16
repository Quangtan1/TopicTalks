import { useState } from 'react';
import { Card, CardContent, Container, Typography, TextField, Button, Grid } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import './styles.scss';
import ReCAPTCHA from 'react-google-recaptcha';
import { RE_CAPTCHA_SITE_KEY } from 'src/utils/helper';
import { ToastSuccess } from 'src/utils/toastOptions';

const ContactUs = () => {
  const [isShowBtnSend, setIsShowBtnSend] = useState(false);

  const onToggleBtnSend = () => {
    setIsShowBtnSend((prev) => !prev);
  };

  const handleSubmit = (data, { resetForm }) => {
    console.log(data);
    ToastSuccess('Send Question Successfully!!!');
    // Gửi dữ liệu form tới server ở đây
    resetForm();
  };

  const onSuccessReCaptcha = () => {
    onToggleBtnSend();
  };

  return (
    <Container className="container-contact-us">
      <Grid className="grid-contact-us">
        <Card className="card-contact-us">
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="subtitle1">Contact us if you need assistance</Typography>
          </CardContent>
        </Card>
        <Formik
          initialValues={{
            subject: '',
            message: '',
          }}
          onSubmit={handleSubmit}
        >
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field as={TextField} required name="subject" label="Subject" variant="outlined" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  required
                  name="message"
                  label="Message"
                  placeholder="Write your message..."
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={8}
                />
              </Grid>
              <Grid item xs={12}>
                <ReCAPTCHA sitekey={RE_CAPTCHA_SITE_KEY} onChange={onSuccessReCaptcha} />,
              </Grid>
              {isShowBtnSend && (
                <Grid item xs={12} className="btn-wrap">
                  <Button className="button-Send" variant="contained" color="primary" type="submit">
                    Send Message
                  </Button>
                </Grid>
              )}
            </Grid>
          </Form>
        </Formik>
      </Grid>
    </Container>
  );
};

export default ContactUs;
