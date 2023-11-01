import React from 'react'
import { Box, Button, styled, Typography } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
//img
import undraw_group_chat_re_frmo from '../../../../assets/images/undraw_group_chat_re_frmo.svg';

const Header = () => {
  const navigate = useNavigate();
  const CustomBox = styled(Box)(({ theme }) => ({
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(10),
    backgroundColor: '#f7f3f0',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    },
  }));

  const BoxText = styled(Box)(({ theme }) => ({
    flex: '1',
    paddingLeft: theme.spacing(8),
    [theme.breakpoints.down('md')]: {
      flex: '2',
      textAlign: 'center',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  }));

  return (
    <CustomBox component="header">
      {/*  Box text  */}
      <BoxText component="section">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            color: 'black',
            fontFamily: 'Open Sans,Arial,sans-serif',
          }}
        >
          Connect with like-minded individuals anonymously
        </Typography>

        <Typography
          variant="body1"
          component="p"
          sx={{
            py: 3,
            lineHeight: 1.6,
            color: 'black',
            fontFamily: 'Open Sans,Arial,sans-serif',
          }}
        >
          Join our community of users who share valuable insights and discover new ideas with confidence.
        </Typography>

        <Box>
          <Button
            variant="contained"
            sx={{
              mr: 2,
              px: 4,
              py: 1,
              fontSize: '0.9rem',
              textTransform: 'capitalize',
              borderRadius: 0,
              borderColor: '#14192d',
              color: '#fff',
              backgroundColor: '#14192d',
              '&&:hover': {
                backgroundColor: '#343a55',
              },
              '&&:focus': {
                backgroundColor: '#343a55',
              },
            }}
            onClick={() => navigate('/auth')}
          >
            Join Now
          </Button>
          <Button
            component={Link}
            to={'/about'}
            variant="outlined"
            sx={{
              px: 4,
              py: 1,
              fontSize: '0.9rem',
              textTransform: 'capitalize',
              borderRadius: 0,
              color: '#fff',
              backgroundColor: 'transparent',
              borderColor: '#fff',
              '&&:hover': {
                color: '#343a55',
                borderColor: '#343a55',
              },
              '&&:focus': {
                color: '#343a55',
                borderColor: '#343a55',
              },
            }}
          >
            explore
          </Button>
        </Box>
      </BoxText>

      <Box
        sx={(theme) => ({
          [theme.breakpoints.down('md')]: {
            flex: '1',
            paddingTop: '30px',
            alignSelf: 'center',
          },
          [theme.breakpoints.up('md')]: {
            flex: '2',
            alignSelf: 'flex-end',
          },
        })}
      >
        <img
          src={undraw_group_chat_re_frmo}
          alt="headerImg"
          style={{
            width: '80%',
            marginBottom: -15,
          }}
        />
      </Box>
    </CustomBox>
  );
};

export default Header