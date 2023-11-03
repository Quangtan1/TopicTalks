import React, { useRef, useState } from 'react';
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
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRef = useRef('');
  const [showNewInputPW, setShowNewInputPW] = useState(false);

  const generateOTP = (e) => {
    e.preventDefault();
    const formData: any = new FormData(e.currentTarget);
    const email = formData.get('email');
    emailRef.current = email;
    uiStore?.setLoading(true);
    axios
      .post(`${API_KEY}/auth/regenerate-otp?email=${emailRef.current}`)
      .then((res) => {
        if (res.status === 200) {
          ToastSuccess('Correctly Email!');
          uiStore?.setLoading(false);
          setShowNewInputPW(true);
        } else {
          uiStore?.setLoading(false);
          ToastError('Email not exits in system!');
          console.log(res?.data?.message);
        }
      })
      .catch((err) => {
        uiStore?.setLoading(false);
        ToastError(err.response.data.message);
      });
  };

  const handleForgotPW = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: any = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword');
    const cpassword = formData.get('cpassword');
    if (!emailRegex.test(emailRef.current)) {
      ToastError('Please input correct email');
    } else if (!passwordRegex.test(newPassword) || newPassword !== cpassword) {
      newPassword !== cpassword
        ? ToastError('Confirm Password is incorrect ')
        : ToastError('Password must contain capital letters,numbers and more than 8 characters');
    } else {
      axios
        .put(`${API_KEY}/auth/forgot-password?email=${emailRef.current}`, null, {
          headers: {
            newPassword: newPassword,
          },
        })
        .then((res) => {
          console.log(res);
          ToastSuccess('Send email successfully!');
          navigate('/auth');
        })
        .catch((err) => {
          ToastError('Send email failed');
          ToastError(err?.response?.data?.message);
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

          <Box component="form" noValidate onSubmit={showNewInputPW ? handleForgotPW : generateOTP} className="form">
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

            {showNewInputPW && (
              <>
                <TextField
                  name="newPassword"
                  required
                  type="password"
                  id="newPassword"
                  placeholder="Enter your new password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MdOutlineMailOutline />
                      </InputAdornment>
                    ),
                  }}
                  autoFocus
                />
                <TextField
                  name="cpassword"
                  required
                  id="cpassword"
                  type="password"
                  placeholder="Confirm your new password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MdOutlineMailOutline />
                      </InputAdornment>
                    ),
                  }}
                  autoFocus
                />
              </>
            )}

            <Button type="submit" fullWidth variant="contained" className="submit-button">
              {!showNewInputPW ? 'Next' : 'Reset password'}
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
