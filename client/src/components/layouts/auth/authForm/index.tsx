import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { RiLockPasswordLine } from 'react-icons/ri';
import { GrUserExpert } from 'react-icons/gr';
import { MdOutlineMailOutline } from 'react-icons/md';
import { HiOutlineKey } from 'react-icons/hi';
import '../AuthPage.scss';

const AuthForm = ({ showOTP, isSignIn }) => {
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
    </>
  );
};

export default AuthForm;
