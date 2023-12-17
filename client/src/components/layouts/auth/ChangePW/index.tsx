import React from 'react';
import { Button, TextField, Box, Typography, Grid, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../AuthPage.scss';
import { logo } from 'src/utils/consts';
import { observer } from 'mobx-react';
import axios from 'axios';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import { API_KEY } from 'src/utils';
import uiStore from 'src/store/uiStore';
import Loading from 'src/components/loading/Loading';
import Carousels from '../Carousels';
import { MdOutlineMailOutline } from 'react-icons/md';
const CryptoJS = require('crypto-js');

const ForgotPassword = observer(() => {
  const navigate = useNavigate();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get('token');
  // TODO: discuss w BE to remove "+" in token
  const replacedToken = token?.replace(/ /g, '+');

  const decrypt = (strToDecrypt, secretKey) => {
    try {
      if (strToDecrypt) {
        const key = CryptoJS.enc.Utf8.parse(secretKey);
        const bytes = CryptoJS.AES.decrypt(strToDecrypt, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        });
        return bytes.toString(CryptoJS.enc.Utf8);
      }
      return '';
    } catch (error) {
      console.error('Decryption Error:', error);
      return '';
    }
  };

  const emailDecode = `${decodeURIComponent(escape(decrypt(replacedToken, 'ThisIsASecretKey')))}`;

  const handleForgotPW = (e: React.FormEvent<HTMLFormElement>) => {
    uiStore?.setLoading(true);
    e.preventDefault();
    const formData: any = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword');
    const cpassword = formData.get('cpassword');
    if (!passwordRegex.test(newPassword) || newPassword !== cpassword) {
      newPassword !== cpassword
        ? ToastError('Confirm Password is incorrect ')
        : ToastError('Password must contain capital letters,numbers and more than 8 characters');
      uiStore?.setLoading(false);
    } else {
      const requestData = {
        email: emailDecode,
        token: replacedToken,
        newPassword: newPassword,
      };

      axios
        .put(`${API_KEY}/auth/new-password`, requestData)
        .then((res) => {
          if (res.data === 'Token is out of date!') {
            uiStore?.setLoading(false);
            ToastError('Change Password failed!');
            ToastError('Token is out of date! Please send link again!!!');
            navigate('/change-password');
          } else if (res.status === 200 && res.data === 'New password set successfully !') {
            uiStore?.setLoading(false);
            ToastSuccess('Change password successfully!');
            navigate('/auth');
          } else {
            uiStore?.setLoading(false);
            ToastError('Change password failed! Please send mail request again!');
          }
        })
        .catch((err) => {
          uiStore?.setLoading(false);
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
          <img src={logo} alt="logo" className="logo-image" loading="lazy" />
          <Typography variant="h4" padding={2} textAlign={'center'}>
            Forgot password
          </Typography>
          <Box className="box-auth-text">
            <Typography variant="h6" className="subtext">
              Welcome back
            </Typography>
            <Typography variant="body1" className="subtext">
              Please enter your new email to change your password
            </Typography>
          </Box>

          <Box component="form" noValidate onSubmit={handleForgotPW} className="form">
            <TextField
              name="email"
              required
              value={emailDecode}
              disabled
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
