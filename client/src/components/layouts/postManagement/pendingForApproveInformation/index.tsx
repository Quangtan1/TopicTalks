import './styles.scss'
import { Box, Grid, Typography } from '@mui/material'
import { watingApproveImage } from 'src/utils'

const WaitingApproveTitle = () => {
    return (
        <Grid container xs={12}>
            <Grid item xs={5} >
                <Typography variant='h6'>Submit Your Post</Typography>
                <Typography variant='body2'>Submit your stories and Share your experience. </Typography>

                <Typography variant='body2'>Your new posts will be pending. It will be published <strong> after admin review and approval.</strong></Typography>

                <Typography variant='body2'>It may take 24 hours.</Typography>

                <Typography variant='body2'>Thank you!</Typography>
            </Grid>
            <Grid item xs={5}>
                <img src={watingApproveImage} alt="watingApproveImage" />
            </Grid>
        </Grid >
    )
}

export default WaitingApproveTitle