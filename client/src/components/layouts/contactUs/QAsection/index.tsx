import { Container, Grid, Typography, Paper } from '@mui/material';

const FAQSection = ({ selfQA }) => {
  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h5" component="p">
              GOT QUESTIONS ? I´VE GOT ANSWERS !
            </Typography>
            <Typography variant="h4">Questions Answered</Typography>
          </div>
        </Grid>
        {selfQA &&
          selfQA?.length !== 0 &&
          selfQA?.map((item, index) => {
            return (
              <Grid item xs={12} md={6} key={index}>
                <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    <strong>Subject:</strong> {item?.subject}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Message:</strong> {item?.content}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Admin answer:</strong> {item?.answerContent}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
      </Grid>
    </Container>
  );
};

export default FAQSection;
