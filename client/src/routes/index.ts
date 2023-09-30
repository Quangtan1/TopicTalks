import Community from 'src/components/layouts/home/Community';
import AuthPage from 'src/components/layouts/auth/AuthPage';
import ChatContainer from 'src/components/layouts/chats/ChatContainer';
import Profile from 'src/components/layouts/profile/Profile';
import DashBoard from 'src/components/admin/dashboard/DashBoard';
import ManageTopic from 'src/components/admin/managetopic/ManageTopic';
import ManageUsers from 'src/components/admin/manageusers/ManageUsers';
import LandingView from 'src/components/layouts/home/landingView/LandingView';
import TopicChildDetail from 'src/components/layouts/home/landingView/TopicChildDetail';
import ContactUs from 'src/components/layouts/contactUs';
import PostDetail from 'src/components/layouts/postManagement/postDetailPage';

const publicRoutes = [
  { path: '/community', component: Community, isAdmin: false },
  { path: '/contact', component: ContactUs, isAdmin: false },
  { path: '/landing-view', component: LandingView, isAdmin: false },
  { path: '/auth', component: AuthPage, layout: null },
  { path: '/profile', component: Profile },
  { path: '/message', component: ChatContainer, isAdmin: false },
  { path: '/dashboard', component: DashBoard, isAdmin: true },
  { path: '/manage-topic', component: ManageTopic, isAdmin: true },
  { path: '/manage-user', component: ManageUsers, isAdmin: true },
  { path: '/topic-detail/:id', component: TopicChildDetail },
  { path: '/post-detail/:id', component: PostDetail },
];

export { publicRoutes };
