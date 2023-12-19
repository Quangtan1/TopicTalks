import React, { useEffect, useState, memo } from 'react';
import { Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { createAxios, getDataAPI, logo } from 'src/utils';
import NotificationDialog from 'src/components/dialogs/NotificationDialog';
import { notification_worker_script, worker_script } from '../../../utils/woker';
import friendStore from 'src/store/friendStore';
import uiStore from 'src/store/uiStore';
import './SideBarMessage.scss';
import { AiFillHome, AiFillShop } from 'react-icons/ai';
import { TiMessages } from 'react-icons/ti';
import { MdGroups2, MdOutlineHelp } from 'react-icons/md';

const SideBarMessage = observer(() => {
  const [activeRoute, setActiveRoute] = useState<string>('/home');
  const [openNotifi, setOpenNotifi] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  let worker;
  let notificationWorker;

  const account = accountStore?.account;
  const accountRole = accountStore?.account?.roles;
  const setAccount = (value) => {
    accountStore?.setAccount(value);
  };

  const axiosJWT = createAxios(account, setAccount);

  // useEffect(() => {
  //   if (account !== null) {
  //     worker = new Worker(worker_script);
  //     worker.onmessage = (ev) => {
  //       if (ev.data !== 'Empty') {
  //         friendStore?.setFriends(ev.data);
  //       }
  //     };
  //     const params = {
  //       id: account?.id,
  //       access_token: account?.access_token,
  //     };
  //     worker.postMessage(params);

  //     notificationWorker = new Worker(notification_worker_script);
  //     notificationWorker.onmessage = (ev: any) => {
  //       if (ev.data !== 'Empty') {
  //         // setNotification(ev.data);
  //       }
  //     };
  //     notificationWorker.postMessage(params);
  //   }

  //   return () => {
  //     account === null && friendStore?.setFriends([]);
  //   };
  // }, [account, location]);

  useEffect(() => {
    if (account !== null) {
      getDataAPI(`/friends/all/${account?.id}`, account?.access_token, axiosJWT)
        .then((res) => {
          friendStore?.setFriends(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return () => {
      account === null && friendStore?.setFriends([]);
    };
  }, [account, location]);

  useEffect(() => {
    account === null && navigate('/landing-view');
    if (account) {
      accountRole.includes('ROLE_ADMIN') && navigate('/dashboard');
    }
    uiStore?.setLocation(currentPath);
    setActiveRoute(currentPath);
  }, [location]);

  const handleActive = (route: string) => {
    setActiveRoute(route);
    navigate(route);
  };

  const routeData = [
    {
      icon: <AiFillHome />,
      route: '/home',
      title: 'Home',
    },
    {
      icon: <AiFillShop />,
      route: '/community',
      title: 'Community',
    },
    {
      icon: <TiMessages />,
      route: '/message',
      title: 'Message',
    },
    {
      icon: <MdGroups2 />,
      route: '/all-group',
      title: 'All Group',
    },
    {
      icon: <MdOutlineHelp />,
      route: '/contact',
      title: 'Contact Us',
    },
  ];
  return (
    <Box className="sidebar_message">
      <img loading="lazy" src={logo} alt="logo" className="logo" onClick={() => navigate('/home')} />
      <Box className="route">
        {routeData.map((item, index: number) => (
          <Box
            key={index}
            title={item.title}
            onClick={() => handleActive(item.route)}
            className={item.route === activeRoute && 'selected'}
          >
            {item.icon}
          </Box>
        ))}
      </Box>
      <span>.</span>
      {openNotifi && <NotificationDialog open={openNotifi} onClose={() => setOpenNotifi(false)} />}
    </Box>
  );
});

export default memo(SideBarMessage);
