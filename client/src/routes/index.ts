import HomePage from 'src/components/layouts/home/HomePage';
import AuthPage from 'src/components/layouts/auth/AuthPage';
import ChatContainer from 'src/components/layouts/chats/ChatContainer';
import Profile from 'src/components/layouts/profile/Profile';
import DashBoard from 'src/components/admin/dashboard/DashBoard';
import ManageTopic from 'src/components/admin/managetopic/ManageTopic';
import ManageUsers from 'src/components/admin/manageusers/ManageUsers';

const publicRoutes = [
  { path: '/newfeed', component: HomePage, isAdmin: false },
  { path: '/auth', component: AuthPage, layout: null },
  { path: '/profile', component: Profile },
  { path: '/message', component: ChatContainer, isAdmin: false },
  { path: '/dashboard', component: DashBoard, isAdmin: true },
  { path: '/manage-topic', component: ManageTopic, isAdmin: true },
  { path: '/manage-user', component: ManageUsers, isAdmin: true },
];

export { publicRoutes };
