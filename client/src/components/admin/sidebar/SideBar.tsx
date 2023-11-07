import { Box, List, ListItem, Typography, Divider, Avatar } from '@mui/material';
import { useState } from 'react';
import { logo } from 'src/utils/consts';
import './SideBar.scss';

//icon
import { AiOutlineHome, AiFillSetting } from 'react-icons/ai';
import { IoIosHelpCircleOutline } from 'react-icons/io';
import { BsPostcard } from 'react-icons/bs';
import { MdOutlineGroup, MdBugReport } from 'react-icons/md';
import { BiEdit } from 'react-icons/bi';
import { CiLogout } from 'react-icons/ci';
import { RiAccountCircleFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';

type SidebarItem = {
  title: string;
  icon: JSX.Element;
  path: string;
};

const listSideBar: SidebarItem[] = [
  {
    title: 'Dashboard',
    icon: <AiOutlineHome />,
    path: '/dashboard',
  },
  {
    title: 'Manage Post',
    icon: <BsPostcard />,
    path: '/manage-post',
  },
  {
    title: 'Manage User',
    icon: <MdOutlineGroup />,
    path: '/manage-user',
  },
  {
    title: 'Manage Topic',
    icon: <BiEdit />,
    path: '/manage-topic',
  },
  {
    title: 'FAQ Page',
    icon: <IoIosHelpCircleOutline />,
    path: '/manage-qa',
  },
];

const SideBar = observer(() => {
  const [activeItem, setActiveItem] = useState<string>('/dashboard');
  const navigate = useNavigate();
  const account = accountStore?.account;

  const handleItemClick = (item: SidebarItem) => {
    setActiveItem(item.path);
    navigate(item.path);
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
    <Box className="sidebar_container_admin">
      <Box className="logo_sidebar">
        <Box className="title_logo">
          <Typography>TopicTalks</Typography>
          <Typography>Admintration</Typography>
        </Box>
        <img src={logo} alt="logo" />
      </Box>
      <Box className="admin_infor">
        <Avatar src={account?.url_img} alt="avt" />
        <Typography>{account?.username}</Typography>
        <Typography>Smart Admin</Typography>
      </Box>
      <List className="list_item">{listSideBar.map(renderSidebarItem)}</List>

      <Divider />
      <List className="list_item_setting">
        <RiAccountCircleFill />
        <AiFillSetting />
        <CiLogout />
      </List>
    </Box>
  );
});

export default SideBar;
