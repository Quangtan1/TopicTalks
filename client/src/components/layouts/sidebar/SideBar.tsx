import { Box, List, ListItem, Typography, Divider, Avatar } from '@mui/material';
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
import { SlArrowRight } from 'react-icons/sl';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from 'react-router-dom';
import uiStore from 'src/store/uiStore';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';

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

const SideBar = observer(() => {
  const [activeItem, setActiveItem] = useState<string>('/newfeed');
  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const account = accountStore?.account;

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

  const isResize = uiStore?.collapse;

  return (
    <Box className={`sidebar_container ${isResize ? 'expand_container' : 'collapse_container'}`}>
      <Box className="logo_sidebar">
        <Typography>TopicTalks</Typography>
        <img src={logo} alt="logo" />
      </Box>
      <Box className="admin_infor">
        <Avatar src={account?.url_img} alt="avt" />
        <Typography>{account?.username}</Typography>
        <Typography>Smart User</Typography>
      </Box>
      <List className="list_item">
        {listSideBar.map(renderSidebarItem)}
        <NewPost open={postModalOpen} closePostModal={closePostModal} />
      </List>
      <Divider />
      <List className="list_item_setting">
        <AiFillSetting />
        <BiHelpCircle />
        <CiLogout />
      </List>
      <button
        className={`resize_sidebar ${isResize ? 'expand' : 'collapse'}`}
        onClick={() => uiStore?.setCollapse(!isResize)}
      >
        <SlArrowRight />
      </button>
    </Box>
  );
});

export default SideBar;
