import { Card, CardContent, Container, Typography, TextField, Button, Grid } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import './styles.scss';

const ContactUs = () => {
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
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            subject: '',
            message: '',
          }}
          onSubmit={(values) => {
            // Handle form submission here
            console.log(values);
          }}
        >
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Field as={TextField} name="firstName" label="First Name" variant="outlined" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <Field as={TextField} name="lastName" label="Last Name" variant="outlined" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <Field as={TextField} name="phone" label="Phone" variant="outlined" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <Field as={TextField} name="email" label="Email" variant="outlined" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Field as={TextField} name="subject" label="Subject" variant="outlined" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="message"
                  label="Message"
                  placeholder="Write your message..."
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} className="btn-wrap">
                <Button className="button-Send" variant="contained" color="primary" type="submit">
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Grid>
    </Container>
  );
};

export default ContactUs;
