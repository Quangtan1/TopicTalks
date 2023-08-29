import { Box, List, ListItem, Typography, Divider } from '@mui/material';
import { useState } from 'react';
import { logo } from 'src/utils/consts';
import './SideBar.scss';
import NewPost from 'src/components/layouts/home/newPost/NewPost';

//icon
import { AiOutlineHome, AiFillSetting } from 'react-icons/ai';
import { RiCompassDiscoverFill } from 'react-icons/ri';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { SiMessenger } from 'react-icons/si';
import { MdOutlineGroup } from 'react-icons/md';
import { BiHelpCircle } from 'react-icons/bi';
import { CiLogout } from 'react-icons/ci';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from 'react-router-dom';

type SidebarItem = {
  title: string;
  icon: JSX.Element;
  path: string;
};

const listSideBar: SidebarItem[] = [
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
    path: 'newpost',
  },
  {
    title: 'Friends',
    icon: <MdOutlineGroup />,
    path: '/friends',
  },
  {
    title: 'Community',
    icon: <RiCompassDiscoverFill />,
    path: '/community',
  },
  {
    title: 'Topics',
    icon: <MdOutlineAccountCircle />,
    path: '/topics',
  },
];

const SideBar = () => {
  const [activeItem, setActiveItem] = useState<string>('/newfeed');
  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleItemClick = (item: SidebarItem) => {
    if (item.path === 'newpost') {
      openPostModal();
    } else {
      setActiveItem(item.path);
      navigate(item.path);
    }
  };

  const openPostModal = () => {
    setPostModalOpen(true);
  };

  const closePostModal = () => {
    setPostModalOpen(false);
  };

  const renderSidebarItem = (item: SidebarItem) => {
    const isActive = activeItem === item.path;
    return (
      <ListItem key={item.path} className={isActive ? 'active-bar' : ''} onClick={() => handleItemClick(item)}>
        {item.icon}
        <Typography>{item.title}</Typography>
      </ListItem>
    );
  };
  return (
    <Box className="side-bar-container">
      <Box className="logo-sidebar">
        <img src={logo} alt="logo" />
        <Typography>TopicTalks</Typography>
      </Box>
      <List className="list-item">
        {listSideBar.map(renderSidebarItem)}
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
