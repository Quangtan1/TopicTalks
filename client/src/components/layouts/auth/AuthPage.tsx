import React, { useRef, useState } from 'react';
import { Button, FormControlLabel, Checkbox, Box, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './AuthPage.scss';
import Carousels from './Carousels';
import { imageRandom, logo } from 'src/utils/consts';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import axios from 'axios';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
// import SelectTopicDialog from 'src/components/dialogs/SelectTopicDialog';
import { IUser } from 'src/types/account.types';
import { API_KEY } from 'src/utils';
import uiStore from 'src/store/uiStore';
import Loading from 'src/components/loading/Loading';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import OtpInput from './otpInput';
import AuthForm from './authForm';
import CountDownOtp from './count';

const LoginPage = observer(() => {
  const emailRef = useRef('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  let timeoutId;
  const navigate = useNavigate();
  const [isSignIn, setSignIn] = useState<boolean>(true);
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [otp, setOtp] = useState('');
  const [remainingSeconds, setRemainingSeconds] = useState(30);
  const [showPassword, setShowPassWord] = useState<boolean>(false);
  const handleLoginGGSuccess = async (credentialResponse) => {
    try {
      uiStore?.setLoading(true);
      const decode: { picture?: string; name?: string; email?: string } = jwtDecode(credentialResponse?.credential);
      const randomIndex = Math.floor(Math.random() * imageRandom.length);
      const user = {
        fullName: decode?.name,
        email: decode?.email,
        urlImage: imageRandom[randomIndex],
      };

      axios
        .post(`${API_KEY}/auth/authenticate/google`, user)
        .then((res) => {
          accountStore?.setAccount(res?.data);
          res?.data?.roles?.includes('ROLE_ADMIN') ? navigate('/dashboard') : navigate('/home');
          uiStore?.setLoading(false);
        })
        .catch((err) => {
          uiStore?.setLoading(false);
          ToastError(err?.response?.data?.message);
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
    uiStore?.setLoading(true);
    const formData: any = new FormData(e.currentTarget);
    const user = {
      username: formData.get('email'),
      password: formData.get('password'),
    };
    if (!user.username || !user.password) {
      ToastError('Please not empty textbox');
    } else {
      axios
        .post(`${API_KEY}/auth/authenticate`, user)
        .then((res) => {
          if (!!res?.data?.access_token) {
            accountStore?.setAccount(res?.data);
            res?.data?.roles?.includes('ROLE_ADMIN') ? navigate('/dashboard') : navigate('/home');
            uiStore?.setLoading(false);
          } else {
            ToastError('Please verify email first');
            navigate('/verify-account');
            uiStore?.setLoading(false);
          }
        })
        .catch((err) => {
          uiStore?.setLoading(false);
          ToastError(err?.response?.data?.message.split(':')[1]);
        });
    }
  };

  const generateOTP = () => {
    uiStore?.setLoading(true);
    axios
      .post(`${API_KEY}/auth/regenerate-otp?email=${emailRef.current}`)
      .then((res) => {
        if (res.status === 200) {
          ToastSuccess('Send OTP Successfully');
          setShowOTP(true);
          startCountdown();
          timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            uiStore?.setLoading(false);
          }, 1000);
        } else {
          uiStore?.setLoading(false);
          ToastError(res?.data?.message);
        }
      })
      .catch((err) => {
        uiStore?.setLoading(false);
        ToastError(err.response.data.message);
      });
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: any = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const cpassword = formData.get('cpassword');

    if (!email || !password || !cpassword) {
      ToastError('Please not empty textbox');
    } else if (!emailRegex.test(email)) {
      ToastError('Please input correct email');
    } else if (!passwordRegex.test(password) || password !== cpassword) {
      password !== cpassword
        ? ToastError('Confirm Password is incorrect ')
        : ToastError('Password must contain capital letters,numbers and more than 8 characters');
    } else {
      const randomIndex = Math.floor(Math.random() * imageRandom.length);
      const user = {
        email: email,
        password: password,
        urlAvatar: imageRandom[randomIndex],
      };
      uiStore?.setLoading(true);

      axios
        .post(`${API_KEY}/auth/register`, user)
        .then((res) => {
          if (res.status === 200) {
            if (res?.data?.status === 403) {
              uiStore?.setLoading(false);
              return ToastError('This user email or username already exist!');
            }
            setShowOTP(true);
            emailRef.current = email;
            ToastSuccess('The OTP code has been sent to your email, please verify to continue');
            startCountdown();
            timeoutId = setTimeout(() => {
              clearTimeout(timeoutId);
              uiStore?.setLoading(false);
            }, 1000);
          } else {
            uiStore?.setLoading(false);
            ToastError('Register Fail');
            console.log(res?.data?.message);
          }
        })
        .catch((err) => {
          uiStore?.setLoading(false);
          console.log(err?.response?.data?.message);
        });
    }
  };

  const onClose = () => {
    setSignIn(!isSignIn);
    // setOpenSelect(false);
  };

  const goToForgotPw = () => {
    navigate('/change-password');
  };

  const handleChangeOTP = (value) => {
    setOtp(value);
  };

  const handleVerifyEmail = () => {
    uiStore?.setLoading(true);
    axios
      .get(`${API_KEY}/auth/verify-account?email=${emailRef.current}&otp=${otp}`)
      .then((res) => {
        if (res.data === 'Please regenerate otp and try again') {
          ToastError('Verify account fail, please regenerate otp and try again');
        } else if (res.status === 200 && res.data !== 'Please regenerate otp and try again') {
          timeoutId = setTimeout(() => {
            ToastSuccess('Verify account successfully');
            setShowOTP(false);
            setSignIn(true);
            // setOpenSelect(true);
            setOtp('');
            clearTimeout(timeoutId);
            uiStore?.setLoading(false);
          }, 2000);
        } else {
          ToastError('Verify account fail');
        }
      })
      .catch((err) => {
        uiStore?.setLoading(false);
        ToastError(err?.response?.data?.message);
      });
  };

  const startCountdown = () => {
    setRemainingSeconds(30);
  };

  const handleShowPassword = () => {
    setShowPassWord(!showPassword);
  };

  const handleTimeout = () => {};

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
            {showOTP ? 'Verify Email' : isSignIn ? 'Sign In' : 'Sign Up'}
          </Typography>
          <Box component="form" noValidate onSubmit={isSignIn ? handleSignIn : handleSignUp} className="form">
            <AuthForm
              isSignIn={isSignIn}
              showOTP={showOTP}
              showPassword={showPassword}
              handleShowPassword={handleShowPassword}
            />
            {isSignIn && (
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" className="checkbox" />}
                label="Remember me"
              />
            )}

            {!showOTP ? (
              <Box className="forgot-password">
                <Typography onClick={goToForgotPw}>Forgot password?</Typography>

                <Typography
                  onClick={() => {
                    setSignIn(!isSignIn);
                    setShowPassWord(false);
                  }}
                >
                  {isSignIn ? 'Sign up account?' : 'Sign In?'}
                </Typography>
              </Box>
            ) : (
              <>
                {
                  <CountDownOtp
                    setRemainingSeconds={setRemainingSeconds}
                    generateOTP={generateOTP}
                    onTimeout={handleTimeout}
                    remainingSeconds={remainingSeconds}
                  />
                }
              </>
            )}

            {showOTP ? (
              <OtpInput otp={otp} handleChangeOTP={handleChangeOTP} handleVerifyEmail={handleVerifyEmail} />
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
              </>
            )}
          </Box>
        </Box>
      </Grid>
      {/* {openSelect === true && <SelectTopicDialog open={openSelect} accountSignup={accountSignup} onClose={onClose} />} */}
    </Grid>
  );
});

export default LoginPage;
