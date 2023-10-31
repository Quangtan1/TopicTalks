import React from 'react';
import { Button, TextField, Box, Typography, Grid, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './styles.scss';
import { logo } from 'src/utils/consts';
import { observer } from 'mobx-react';
import axios from 'axios';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import { API_KEY } from 'src/utils';
import uiStore from 'src/store/uiStore';
import Loading from 'src/components/loading/Loading';
import Carousels from '../Carousels';
import { MdOutlineMailOutline } from 'react-icons/md';

const ForgotPassword = observer(() => {
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleForgotPW = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: any = new FormData(e.currentTarget);
    const email = formData.get('email');
    if (!emailRegex.test(email)) {
      ToastError('Please input correct email');
    } else {
      axios
        .post(`${API_KEY}/user/forgot-password?email=${email}`)
        .then((res) => {
          console.log(res);
          ToastSuccess('Send email successfully!');
        })
        .catch((err) => {
          ToastError('Send email failed');
          ToastError(err.response.data.message);
        });
    }
  };

  const goToLogin = () => {
    navigate('/auth');
  };

  return (
    <Grid className="auth-container" container>
      {uiStore?.loading && <Loading />}
      <Grid item md={6} className="grid-carousel">
        <Carousels />
      </Grid>
      <Grid item md={6} className="grid-login">
        <Box className="box-auth">
          <img src={logo} alt="logo" className="logo-image" />
          <Typography variant="h4" padding={2} textAlign={'center'}>
            Forgot password
          </Typography>
          <Box className="box-auth-text">
            <Typography variant="h6" className="subtext">
              Lost your password?
            </Typography>
            <Typography variant="body1" className="subtext">
              Please enter your email address. You will receive a link to create a new password via email.
            </Typography>
          </Box>

          <Box component="form" noValidate onSubmit={handleForgotPW} className="form">
            <TextField
              name="email"
              required
              id="email"
              placeholder="Enter your email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdOutlineMailOutline />
                  </InputAdornment>
                ),
              }}
              autoFocus
            />

            <Button type="submit" fullWidth variant="contained" className="submit-button">
              Reset password
            </Button>

            <Box className="forgot-password" onClick={goToLogin}>
              <Typography>Remember your password?</Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
});

export default ForgotPassword;
