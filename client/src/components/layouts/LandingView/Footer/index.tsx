import { Box, Stack, styled } from '@mui/material';
import Link from '@mui/material/Link';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import FooterLink from './FooterLink';
import FooterTitle from './FooterTitle';
import { logo1 } from 'src/utils';

const Footer = () => {
  const StackColumn = styled(Stack)(() => ({
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    gap: 8,
    textAlign: 'center',
  }));

  const BoxRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f7f3f0',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: 30,
    },
  }));

  return (
    <BoxRow
      component="footer"
      sx={{
        py: 4,
        px: 2,
      }}
    >
      <StackColumn>
        <img
          src={logo1}
          alt="logoT"
          width={40}
          height={40}
          style={{ backgroundColor: 'white', padding: 8, marginRight: 12 }}
        />
        <FooterTitle text={'TopicTalks'} />
        <Stack direction="row" width="70px" maxWidth="100%" justifyContent="space-between">
          <Link
            href="#"
            variant="body2"
            sx={{
              color: '#414141',
              '&:hover': {
                color: '#1c2859',
              },
            }}
          >
            <InstagramIcon />
          </Link>
          <Link
            href="#"
            variant="body2"
            sx={{
              color: '#414141',
              '&:hover': {
                color: '#1c2859',
              },
            }}
          >
            <FacebookIcon />
          </Link>
        </Stack>
      </StackColumn>
      <StackColumn>
        <FooterTitle text={'address'} />
        <FooterLink text={'fpt university'} />
        <FooterLink text={'0982123456'} />
        <FooterLink text={'topictalkAnonymous@gmail.com'} />
      </StackColumn>

      <StackColumn>
        <FooterTitle text={'Our Functions'} />
        <FooterLink text={'Anonymous Conversations'} />
        <FooterLink text={'Engaging Discussions'} />
        <FooterLink text={'Topic-Based Chats'} />
        <FooterLink text={'Community Building'} />
      </StackColumn>
    </BoxRow>
  );
};

export default Footer;
