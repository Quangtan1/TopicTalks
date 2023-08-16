import React, { useState } from 'react';
import { Button, TextField, FormControlLabel, Checkbox, Box, Typography, Grid, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { RiLockPasswordLine } from 'react-icons/ri';
import { GrUserExpert } from 'react-icons/gr';
import { MdOutlineMailOutline } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import './AuthPage.scss';
import Carousels from './Carousels';
import { logo } from 'src/utils/consts';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';

const LoginPage = observer(() => {
  const navigate = useNavigate();
  const [isSignIn, setSignIn] = useState(true);
  const emailRegex = /^[^\s@]+@fpt\.edu\.vn$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: any = new FormData(e.currentTarget);
    const user = {
      email: formData.get('email'),
      password: formData.get('password'),
    };
    accountStore?.setAccount(user);
    navigate('/newfeed');
    console.log('user', user);
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: any = new FormData(e.currentTarget);
    if (
      !formData.get('anonymousName') ||
      !formData.get('fullName') ||
      !formData.get('email') ||
      !formData.get('password')
    ) {
      toast.error('Please not empty textbox');
    } else if (!emailRegex.test(formData.get('email'))) {
      toast.error('Please check fpt mail');
    } else if (!passwordRegex.test(formData.get('password'))) {
      toast.error('Password must contain capital letters,numbers and more than 8 characters ');
    } else {
      const user = {
        anonymousName: formData.get('anonymousName'),
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
      };

      console.log('user', user);
    }
  };
  return (
    <Grid className="auth-container" container>
      <ToastContainer />

      <Grid item md={6} className="grid-carousel">
        <Carousels />
      </Grid>
      <Grid item md={6} className="grid-login">
        <Box className="box-auth">
          <img src={logo} alt="logo" className="logo-image" />
          <Typography variant="h4" padding={2} textAlign={'center'}>
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </Typography>
          <Box component="form" noValidate onSubmit={isSignIn ? handleSignIn : handleSignUp} className="form">
            {!isSignIn && (
              <>
                <TextField
                  name="anonymousName"
                  required
                  id="anonymousName"
                  placeholder="Anonymous Name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  autoFocus
                />
                <TextField
                  required
                  id="fullName"
                  placeholder="User Name"
                  name="fullName"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GrUserExpert />
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}
            <TextField
              required
              id="email"
              placeholder="Email Address"
              name="email"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdOutlineMailOutline />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              required
              name="password"
              placeholder="Password"
              type="password"
              id="password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RiLockPasswordLine />
                  </InputAdornment>
                ),
              }}
            />
            {isSignIn && (
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" className="checkbox" />}
                label="Remember me"
              />
            )}

            <Box className="forgot-password">
              <Typography>Forgot password?</Typography>

              <Typography onClick={() => setSignIn(!isSignIn)}>{isSignIn ? 'Sign up account?' : 'Sign In?'}</Typography>
            </Box>
            <Button type="submit" fullWidth variant="contained" className="submit-button">
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </Button>
            <Button fullWidth variant="contained" className="button-gg">
              <FcGoogle />
              <Typography>Continue with Google </Typography>
            </Button>
            <Box className="box-social">
              <FacebookIcon />
              <InstagramIcon />
              <TwitterIcon />
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
});

export default LoginPage;
