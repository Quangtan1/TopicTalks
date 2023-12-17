import './styles.scss';
import { Grid, Typography } from '@mui/material';
import { watingApproveImage } from 'src/utils';

const WaitingApproveTitle = () => {
  return (
    <Grid container xs={12} className="waitingApprove">
      <Grid item xs={5} className="waitingApprove__left">
        <Typography className="waitingApprove__left__title">Submit Your Post</Typography>
        <Typography variant="h6" className="waitingApprove__left__text">
          Submit your stories and Share your experience.
        </Typography>

        <Typography variant="h6" className="waitingApprove__left__text">
          Your new posts will be pending. It will be published <strong> after admin review and approval.</strong>
        </Typography>

        <Typography variant="h6" className="waitingApprove__left__text">
          It may take 24 hours.
        </Typography>

        <Typography variant="h6" className="waitingApprove__left__text">
          Thank you!
        </Typography>
      </Grid>
      <Grid item xs={4} className="waitingApprove__right">
        <img src={watingApproveImage} alt="watingApproveImage" className="waitingApprove__right__img" />
      </Grid>
    </Grid>
  );
};

export default WaitingApproveTitle;
