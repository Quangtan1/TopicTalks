import HomePage from 'src/components/layouts/home/HomePage';
import AuthPage from 'src/components/layouts/auth/AuthPage';
import ChatContainer from 'src/components/layouts/chats/ChatContainer';
import Profile from 'src/components/layouts/profile/Profile';

const publicRoutes = [
  { path: '/newfeed', component: HomePage },
  { path: '/auth', component: AuthPage, layout: null },
  { path: '/message', component: ChatContainer },
  { path: '/profile', component: Profile },
];

export { publicRoutes };
