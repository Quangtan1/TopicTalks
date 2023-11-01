import React, { useState } from 'react';
import { Button, TextField, FormControlLabel, Checkbox, Box, Typography, Grid, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { RiLockPasswordLine } from 'react-icons/ri';
import { GrUserExpert } from 'react-icons/gr';
import { MdOutlineMailOutline } from 'react-icons/md';
import { HiOutlineKey } from 'react-icons/hi';
import './AuthPage.scss';
import Carousels from './Carousels';
import { logo } from 'src/utils/consts';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import axios from 'axios';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import SelectTopicDialog from 'src/components/dialogs/SelectTopicDialog';
import { IUser } from 'src/types/account.types';
import { API_KEY } from 'src/utils';
import uiStore from 'src/store/uiStore';
import Loading from 'src/components/loading/Loading';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import { MuiOtpInput } from 'mui-one-time-password-input';

const LoginPage = observer(() => {
  const navigate = useNavigate();
  const [isSignIn, setSignIn] = useState<boolean>(true);
  const [openSelect, setOpenSelect] = useState<boolean>(false);
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [otp, setOtp] = useState('');
  const [accountSignup, setAccountSignup] = useState<IUser>(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  let timeoutId;

  const handleLoginGGSuccess = async (credentialResponse) => {
    try {
      const decode: { picture?: string; name?: string; email?: string } = jwtDecode(credentialResponse?.credential);

      const user = {
        fullName: decode.name,
        email: decode.email,
        urlImage: decode.picture,
      };

      axios
        .post(`${API_KEY}/auth/authenticate/google`, user)
        .then((res) => {
          accountStore?.setAccount(res.data);
          res.data.roles.includes('ROLE_ADMIN') ? navigate('/dashboard') : navigate('/home');
        })
        .catch((err) => {
          ToastError(err.response.data.message);
        });
    } catch (err) {
      console.log(err);
      ToastError('Login Failed');
    }
  };

  const handleLoginFailed = () => {
    ToastError('Login Failed');
  };

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: any = new FormData(e.currentTarget);
    const user = {
      username: formData.get('anonymousName'),
      password: formData.get('password'),
    };
    axios
      .post(`${API_KEY}/auth/authenticate`, user)
      .then((res) => {
        accountStore?.setAccount(res.data);
        res.data.roles.includes('ROLE_ADMIN') ? navigate('/dashboard') : navigate('/home');
      })
      .catch((err) => {
        ToastError(err.response.data.message);
      });
  };

  const generateOTP = (e) => {
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
      axios
        .post(`${API_KEY}/user/regenerate-otp?email=${email}`)
        .then((res) => {
          uiStore?.setLoading(true);
          ToastSuccess('Send OTP Successfully');
          setShowOTP(true);
          timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            uiStore?.setLoading(false);
          }, 2000);
        })
        .catch((err) => {
          ToastError(err.response.data.message);
        });
    }
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
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

      axios
        .post(`${API_KEY}/auth/register`, user)
        .then((res) => {
          generateOTP(e);
          uiStore?.setLoading(true);
          setAccountSignup(res.data);
          ToastSuccess('Register Successfully');
          timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            uiStore?.setLoading(false);
          }, 2000);
        })
        .catch((err) => {
          ToastError(err.response.data.message);
        });
    }
  };

  const onClose = () => {
    setSignIn(!isSignIn);
    setOpenSelect(false);
  };

  const goToForgotPw = () => {
    navigate('/forgot-password');
  };

  const handleChangeOTP = (value) => {
    setOtp(value);
  };

  const handleVerifyEmail = (e) => {
    e.preventDefault();
    const formData: any = new FormData(e.currentTarget);
    const email = formData.get('email');

    if (!emailRegex.test(email)) {
      ToastError('Please input correct email');
    } else {
      axios
        .post(`${API_KEY}/user/verify-account?email=${email}&otp=${otp}`)
        .then((res) => {
          uiStore?.setLoading(true);
          timeoutId = setTimeout(() => {
            ToastSuccess('Verify account successfully');
            setShowOTP(false);
            // setSignIn(true);
            setOpenSelect(true);
            clearTimeout(timeoutId);
            uiStore?.setLoading(false);
          }, 2000);
        })
        .catch((err) => {
          ToastError(err.response.data.message);
        });
    }
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
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </Typography>
          <Box component="form" noValidate onSubmit={isSignIn ? handleSignIn : handleSignUp} className="form">
            {!showOTP && (
              <>
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
              </>
            )}
            {isSignIn && (
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" className="checkbox" />}
                label="Remember me"
              />
            )}

            <Box className="forgot-password">
              <Typography onClick={goToForgotPw}>Forgot password?</Typography>

              <Typography onClick={() => setSignIn(!isSignIn)}>{isSignIn ? 'Sign up account?' : 'Sign In?'}</Typography>
            </Box>
            {true ? (
              <>
                <MuiOtpInput value={otp} length={6} onChange={handleChangeOTP} />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="submit-button"
                  onClick={handleVerifyEmail}
                >
                  Verify Email
                </Button>
              </>
            ) : (
              <>
                <Button type="submit" fullWidth variant="contained" className="submit-button">
                  {isSignIn ? 'Sign In' : 'Sign Up'}
                </Button>
                <GoogleLogin
                  size="large"
                  shape="circle"
                  text="signin_with"
                  theme="outline"
                  width={380}
                  onSuccess={handleLoginGGSuccess}
                  onError={handleLoginFailed}
                />
                <Box className="box-social">
                  <FacebookIcon />
                  <InstagramIcon />
                  <TwitterIcon />
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Grid>
      {openSelect === true && <SelectTopicDialog open={openSelect} accountSignup={accountSignup} onClose={onClose} />}
    </Grid>
  );
});

export default LoginPage;
