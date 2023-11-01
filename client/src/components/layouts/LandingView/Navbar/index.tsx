import {
    AppBar,
    Toolbar,
    Box,
    List,
    ListItem,
    Typography, 
    styled,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import DrawerItem from '../DrawerItem';
import { logo1 } from 'src/utils';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: 'black',
});

const ListMenu = styled(List)(({ theme }) => ({
  display: 'none',
  backgroundColor: 'black',
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },
}));

const itemList = [
  {
    text: 'About',
    to: '/about',
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <AppBar
      component="nav"
      position="sticky"
      sx={{
        backgroundColor: 'orange',
      }}
      elevation={0}
    >
      <StyledToolbar>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer', alignItems: 'center' }}
          onClick={() => navigate('/landing-view')}
        >
          <img
            src={logo1}
            alt="logoT"
            width={40}
            height={40}
            style={{ backgroundColor: 'white', padding: 8, marginRight: 12 }}
          />
          <Typography variant="h6" component="h2">
            TopicTalks
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <DrawerItem />
        </Box>
        <ListMenu>
          {itemList.map((item) => {
            const { text } = item;
            return (
              <ListItem key={text}>
                <ListItemButton
                  component={Link}
                  to={item.to}
                  sx={{
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#1e2a5a',
                    },
                  }}
                >
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </ListMenu>
      </StyledToolbar>
    </AppBar>
  );
};

export default Navbar;
