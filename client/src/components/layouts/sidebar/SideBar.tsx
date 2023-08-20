import { Box, List, ListItem, Typography, Divider } from '@mui/material';
import React, { useState } from 'react';
import { logo } from '../../../utils/consts';
import './SideBar.scss';
import NewPost from '../home/newPost/NewPost';

//icon
import { AiOutlineHome, AiFillSetting } from 'react-icons/ai';
import { RiCompassDiscoverFill } from 'react-icons/ri';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { SiMessenger } from 'react-icons/si';
import { MdOutlineGroup } from 'react-icons/md';
import { BiHelpCircle } from 'react-icons/bi';
import { CiLogout } from 'react-icons/ci';
import CreateIcon from '@mui/icons-material/Create';

const listSideBar = [
  {
    title: 'NewsFeed',
    icon: <AiOutlineHome />,
    path: '/newfeed',
  },
  {
    title: 'Message',
    icon: <SiMessenger />,
    path: '/message',
  },
  {
    title: 'Create Post',
    icon: <CreateIcon />,
    path: '/newpost',
  },
  {
    title: 'Friends',
    icon: <MdOutlineGroup />,
    path: '/',
  },
  {
    title: 'Community',
    icon: <RiCompassDiscoverFill />,
    path: '/',
  },
  {
    title: 'Topics',
    icon: <MdOutlineAccountCircle />,
    path: '/',
  },
];

const SideBar = () => {
  const [navigation, setNavigation] = useState<string>('/newfeed');
  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);

  const goToNewFeedPage = () => {
    setNavigation('/newfeed');
  };

  const openPostModal = () => {
    setPostModalOpen(true);
  };

  const closePostModal = () => {
    setPostModalOpen(false);
  };

  return (
    <Box className="side-bar-container">
      <Box className="logo-sidebar-wrap" onClick={goToNewFeedPage}>
        <Typography variant="h5">TopicTalks</Typography>
        <Box className="logo-sidebar">
          <img src={logo} alt="logo" />
        </Box>
      </Box>
      <List className="list-item">
        {listSideBar.map((item, index) => {
          const isNewPostActive = item.title === 'Create Post';
          return (
            <ListItem
              key={index}
              className={navigation === item.path ? 'active-bar' : ''}
              onClick={isNewPostActive ? openPostModal : undefined}
            >
              {item.icon}
              <Typography>{item.title}</Typography>
            </ListItem>
          );
        })}
        <NewPost open={postModalOpen} closePostModal={closePostModal} />
      </List>

      <Divider />
      <List className="list-item">
        <ListItem>
          <AiFillSetting />
          <Typography>Setting</Typography>
        </ListItem>
        <ListItem>
          <BiHelpCircle />
          <Typography>Help</Typography>
        </ListItem>
        <ListItem>
          <CiLogout />
          <Typography>Logout</Typography>
        </ListItem>
      </List>
    </Box>
  );
};

export default SideBar;
