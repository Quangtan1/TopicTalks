import { useState } from 'react';
import { TextField, Box, Typography, Grid, InputAdornment, Button } from '@mui/material';
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
import OtpInput from '../otpInput';
import CountDownOtp from '../count';

const VerifyScreen = observer(() => {
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   const [openSelect, setOpenSelect] = useState<boolean>(false);
  //   const [accountSignup, setAccountSignup] = useState<IUser>(null);
  const [otp, setOtp] = useState('');
  const [remainingSeconds, setRemainingSeconds] = useState(30);
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  let timeoutId;

  const handleChangeOTP = (value) => {
    setOtp(value);
  };
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const generateOTP = (e) => {
    e.preventDefault();
    uiStore?.setLoading(true);
    if (!emailRegex.test(email)) {
      ToastError('Please input correct email');
    } else {
      axios
        .post(`${API_KEY}/auth/regenerate-otp?email=${email}`)
        .then((res) => {
          if (res.status === 200 && res.data !== 'This account has been verified.') {
            ToastSuccess('Send Email Successfully!');
            startCountdown();
            uiStore?.setLoading(false);
          } else if (res.status === 200 && res.data === 'This account has been verified.') {
            ToastError('This email already verify!');
            timeoutId = setTimeout(() => {
              navigate('/auth');
            }, 3000);
            setShowOtpInput(false);
            uiStore?.setLoading(false);
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
    }
  };

  const handleVerifyEmail = () => {
    axios
      .get(`${API_KEY}/auth/verify-account?email=${email}&otp=${otp}`)
      .then((res) => {
        if (res.data === 'Please regenerate otp and try again') {
          ToastError('Verify account fail, please regenerate otp and try again');
        } else if (res.status === 200 && res.data !== 'Please regenerate otp and try again') {
          uiStore?.setLoading(true);
          timeoutId = setTimeout(() => {
            ToastSuccess('Verify account successfully');
            // setOpenSelect(true);
            // if (res?.data?.id) setAccountSignup(res?.data);
            goToLogin();
            setOtp('');
            clearTimeout(timeoutId);
            uiStore?.setLoading(false);
          }, 2000);
        } else {
          ToastError('Verify account fail');
        }
      })
      .catch((err) => {
        ToastError(err?.response?.data?.message);
      });
  };

  const startCountdown = () => {
    setRemainingSeconds(30);
    setShowOtpInput(true);
  };

  const stopCountdown = () => {};

  const goToLogin = () => {
    navigate('/auth');
  };

  //   const onClose = () => {
  //     setOpenSelect(false);
  //     goToLogin();
  //   };

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
            Verify Email
          </Typography>
          <Box className="box-auth-text">
            <Typography variant="body1" className="subtext">
              {showOtpInput
                ? 'Please enter the otp you received in the email:'
                : 'Please enter your email address. You will receive a OTP to verify account.'}
            </Typography>
          </Box>

          <Box component="form" noValidate onSubmit={generateOTP} className="form">
            {showOtpInput ? (
              <>
                <CountDownOtp
                  setRemainingSeconds={setRemainingSeconds}
                  generateOTP={generateOTP}
                  onTimeout={stopCountdown}
                  remainingSeconds={remainingSeconds}
                />
                <OtpInput handleChangeOTP={handleChangeOTP} handleVerifyEmail={handleVerifyEmail} otp={otp} />
              </>
            ) : (
              <>
                <TextField
                  name="email"
                  required
                  onChange={handleChangeEmail}
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
                  Send OTP
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Grid>
      {/* {openSelect === true && <SelectTopicDialog open={openSelect} accountSignup={accountSignup} onClose={onClose} />} */}
    </Grid>
  );
});

export default VerifyScreen;
