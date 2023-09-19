import React, { useState } from 'react';
import { Button, TextField, FormControlLabel, Checkbox, Box, Typography, Grid, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { RiLockPasswordLine } from 'react-icons/ri';
import { GrUserExpert } from 'react-icons/gr';
import { MdOutlineMailOutline } from 'react-icons/md';
import { HiOutlineKey } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import './AuthPage.scss';
import Carousels from './Carousels';
import { logo } from 'src/utils/consts';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import axios from 'axios';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';

const LoginPage = observer(() => {
  const navigate = useNavigate();
  const [isSignIn, setSignIn] = useState(true);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: any = new FormData(e.currentTarget);
    const user = {
      username: formData.get('anonymousName'),
      password: formData.get('password'),
    };
    navigate('/newfeed');
    const fakeAccount = {
      id: 1,
      username: 'Doremon 123',
      url_img:
        'https://media.licdn.com/dms/image/D5603AQEXwrJ2rM5eyg/profile-displayphoto-shrink_800_800/0/1670055489653?e=1700092800&v=beta&t=tRcVVR9okYVAQMhy5pbjU50MLVIS3wua04jaAOXLZX8',
      roles: ['user'],
      access_token: 'your_access_token',
      refresh_token: 'your_refresh_token',
      token_type: 'Bearer',
      phone_number: '+1234567890',
      user_id: 1001,
      created_at: '2023-09-15 12:00:00',
      first_name: 'Son',
      last_name: 'Le',
      email: 'sonlvs1507@example.com',
      password: 'hashed_password',
      bio: 'A brief bio',
      gender: 'Male',
      country: '01 Nguyen Van Linh - Da Nang',
      dob: '1997-07-15 00:00:00',
      is_banned: false,
      banned_date: null,
      role: 'USER',
    };
    accountStore?.setAccount(fakeAccount);
    // axios
    //   .post('http://localhost:5000/api/v1/auth/authenticate', user)
    //   .then((res) => {
    //     accountStore?.setAccount(res.data);
    //     res.data.roles.includes('ROLE_ADMIN') ? navigate('/dashboard') : navigate('/newfeed');
    //   })
    //   .catch((err) => {
    //     ToastError(err.response.data.message);
    //   });
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: any = new FormData(e.currentTarget);
    const anonymousName = formData.get('anonymousName');
    const email = formData.get('email');
    const password = formData.get('password');
    const cpassword = formData.get('cpassword');

    if (!anonymousName || !email || !password || !cpassword) {
      ToastError('Please not empty textbox');
    } else if (!emailRegex.test(email)) {
      ToastError('Please input correct email');
    } else if (!passwordRegex.test(password) || password !== cpassword) {
      password !== cpassword
        ? ToastError('Confirm Password is incorrect ')
        : ToastError('Password must contain capital letters,numbers and more than 8 characters');
    } else {
      const user = {
        username: anonymousName,
        email: email,
        password: password,
      };
      try {
        await axios.post('http://localhost:5000/api/v1/auth/register', user);
        ToastSuccess('Register Successfully');
        setTimeout(() => {
          setSignIn(!isSignIn);
        }, 3000);
      } catch (err) {
        ToastError(err.response.data.message);
      }
    }
  };
  return (
    <Grid className="auth-container" container>
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
            )}
            <TextField
              name="anonymousName"
              required
              id="anonymousName"
              placeholder="Anonymous Name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GrUserExpert />
                  </InputAdornment>
                ),
              }}
              autoFocus
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
            {!isSignIn && (
              <TextField
                required
                id="cpassword"
                placeholder="Confirm Password"
                name="cpassword"
                type="password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HiOutlineKey />
                    </InputAdornment>
                  ),
                }}
              />
            )}
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
