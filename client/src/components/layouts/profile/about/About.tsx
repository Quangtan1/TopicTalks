import { Paper, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Person, Cake, LocationOn, Email, Phone } from '@mui/icons-material';

import './About.scss';
import { IUserInformation } from 'src/queries';
import { formatDate } from 'src/utils/helper';

interface AboutProps {
  data?: IUserInformation;
}

const About: React.FC<AboutProps> = ({ data }) => {
  const { gender, dob, country, email, phoneNumber } = data || {};
  return (
    <Paper className="column__1_paper_about" elevation={3}>
      <Typography className="aboutText" variant="h6">
        About
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <Person className="iconAbout" />
          </ListItemIcon>
          <ListItemText className="infoText">{gender || '???'}</ListItemText>
        </ListItem>
        <Divider sx={{ margin: '8px 0' }} />
        <ListItem>
          <ListItemIcon>
            <Cake className="iconAbout" />
          </ListItemIcon>
          <ListItemText className="infoText">{formatDate(dob) || '???'}</ListItemText>
        </ListItem>
        <Divider sx={{ margin: '8px 0' }} />
        <ListItem>
          <ListItemIcon>
            <LocationOn className="iconAbout" />
          </ListItemIcon>
          <ListItemText className="infoText">{country || '???'}</ListItemText>
        </ListItem>
        <Divider sx={{ margin: '8px 0' }} />
        <ListItem>
          <ListItemIcon>
            <Email className="iconAbout" />
          </ListItemIcon>
          <ListItemText className="infoText">{email || '???'}</ListItemText>
        </ListItem>
        <Divider sx={{ margin: '8px 0' }} />
        <ListItem>
          <ListItemIcon>
            <Phone className="iconAbout" />
          </ListItemIcon>
          <ListItemText className="infoText">{phoneNumber || '???'}</ListItemText>
        </ListItem>
      </List>
      <Divider sx={{ margin: '20px 0' }} />
    </Paper>
  );
};

export default About;
