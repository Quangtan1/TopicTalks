import HomePage from 'src/components/layouts/home/HomePage';
import AuthPage from 'src/components/layouts/auth/AuthPage';
import ChatContainer from 'src/components/layouts/chats/ChatContainer';

const publicRoutes = [
  { path: '/newfeed', component: HomePage },
  { path: '/auth', component: AuthPage, layout: null },
  { path: '/message', component: ChatContainer },
];

export { publicRoutes };
