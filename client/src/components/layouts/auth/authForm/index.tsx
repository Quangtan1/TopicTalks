import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { RiLockPasswordLine } from 'react-icons/ri';
import { MdOutlineMailOutline } from 'react-icons/md';
import { HiOutlineKey } from 'react-icons/hi';
import '../AuthPage.scss';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AuthForm = ({ showOTP, isSignIn, showPassword, handleShowPassword }) => {
  return (
    <>
      {!showOTP && (
        <>
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
            type={`${showPassword ? 'text' : 'password'}`}
            id="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RiLockPasswordLine />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" style={{ cursor: 'pointer' }} onClick={handleShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
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
                endAdornment: (
                  <InputAdornment position="end" style={{ cursor: 'pointer' }} onClick={handleShowPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </InputAdornment>
                ),
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default AuthForm;
