import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const CountDownOtp = ({ remainingSeconds, setRemainingSeconds, generateOTP, onTimeout }) => {
  const [showSendOTPAgain, setShowSendOTPAgain] = useState(false);

  useEffect(() => {
    if (remainingSeconds > 0) {
      const intervalId = setInterval(() => {
        setRemainingSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      setShowSendOTPAgain(true);
      onTimeout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds, onTimeout]);

  return (
    <Box className="forgot-password">
      {remainingSeconds !== 0 && (
        <Typography variant="body1">
          <strong>{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}s</strong> remain to invalid OTP
        </Typography>
      )}
      {remainingSeconds === 0 && showSendOTPAgain && (
        <Box className="forgot-password">
          {
            <Typography onClick={generateOTP} variant="body1">
              Send OTP again
            </Typography>
          }
        </Box>
      )}
    </Box>
  );
};

export default CountDownOtp;
