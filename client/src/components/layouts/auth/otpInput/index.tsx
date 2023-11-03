import React from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { Button } from '@mui/material';

const OtpInput = ({ otp, handleChangeOTP, handleVerifyEmail }) => {
  return (
    <>
      <MuiOtpInput value={otp} length={6} onChange={handleChangeOTP} />

      <Button type="button" fullWidth variant="contained" className="submit-button" onClick={handleVerifyEmail}>
        Verify
      </Button>
    </>
  );
};

export default OtpInput;
