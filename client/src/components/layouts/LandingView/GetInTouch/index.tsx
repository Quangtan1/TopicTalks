import { Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import Title from '../Title';
import Paragraph from '../Paragraph';

const GetInTouch = () => {
  return (
    <Stack
      component="section"
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        py: 10,
        mx: 6,
      }}
    >
      <Title text={'Connect with Us'} textAlign={'center'} />
      <Paragraph
        text={`We are dedicated to providing a secure and user-friendly platform for you to explore various topics and connect with like-minded individuals. If you're ready to join our engaging community and start meaningful conversations, click the button below.`}
        maxWidth={'sm'}
        mx={0}
        textAlign={'center'}
      />
      <Button
        component={Link}
        to={'/auth'}
        variant="contained"
        type="submit"
        size="medium"
        sx={{
          fontSize: '0.9rem',
          textTransform: 'capitalize',
          py: 2,
          px: 4,
          mt: 3,
          mb: 2,
          borderRadius: 0,
          backgroundColor: '#14192d',
          '&:hover': {
            backgroundColor: '#1e2a5a',
          },
        }}
      >
        Join Now
      </Button>
    </Stack>
  );
};

export default GetInTouch;
