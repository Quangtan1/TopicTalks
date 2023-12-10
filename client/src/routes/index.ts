import Community from 'src/components/layouts/home/community/Community';
import AuthPage from 'src/components/layouts/auth/AuthPage';
import ChatContainer from 'src/components/layouts/chats/ChatContainer';
import DashBoard from 'src/components/admin/dashboard/DashBoard';
import ManageTopic from 'src/components/admin/managetopic/ManageTopic';
import ManageUsers from 'src/components/admin/manageusers/ManageUsers';
import HomePage from 'src/components/layouts/home/homepage/HomePage';
import TopicChildDetail from 'src/components/layouts/home/homepage/TopicChildDetail';
import ContactUs from 'src/components/layouts/contactUs';
// import PostDetail from 'src/components/layouts/postManagement/postDetailPage';
import ManagePost from 'src/components/admin/managepost/ManagePost';
import PartnerProfile from 'src/components/layouts/profile/PartnerProfile';
import ManageUsersQA from 'src/components/admin/manageusersQA/ManageUsersQA';
import LandingView from 'src/components/layouts/LandingView';
import About from 'src/components/layouts/LandingView/about';
import GroupChat from 'src/components/layouts/groups/GroupChat';
import PostDetail from 'src/components/layouts/home/community/posts/PostDetail';
import VerifyScreen from 'src/components/layouts/auth/verifyScreen';
import ForgotPassword from 'src/components/layouts/auth/ChangePW';
import ChangePassword from 'src/components/layouts/auth/SendLinkForgotPW';
import BanLayout from 'src/components/defaultLayout/BanLayout';
import ListTopicChild from 'src/components/layouts/home/homepage/topicchild/ListTopicChild';
import PageNotFound from 'src/components/layouts/pagenotfound/PageNotFound';
// import PostDetailDialog from 'src/components/layouts/home/community/posts/PostDetailDialog';

const publicRoutes = [
  { path: '/community', component: Community, isAdmin: false },
  { path: '/contact', component: ContactUs, isAdmin: false },
  { path: '/home', component: HomePage, isAdmin: false },
  { path: '/auth', component: AuthPage, layout: null },
  { path: '/forgot-password', component: ForgotPassword, layout: null },
  { path: '/change-password', component: ChangePassword, layout: null },
  { path: '/verify-account', component: VerifyScreen, layout: null },
  { path: '/personal-profile/:id', component: PartnerProfile, isAdmin: false },
  { path: '/message', component: ChatContainer, isAdmin: false, layout: null },
  { path: '/dashboard', component: DashBoard, isAdmin: true },
  { path: '/manage-qa', component: ManageUsersQA, isAdmin: true },
  { path: '/manage-topic', component: ManageTopic, isAdmin: true },
  { path: '/manage-user', component: ManageUsers, isAdmin: true },
  { path: '/manage-post', component: ManagePost, isAdmin: true },
  { path: '/topic-detail/:id', component: TopicChildDetail },
  { path: '/landing-view', component: LandingView, layout: null },
  { path: '/about', component: About, layout: null },
  { path: '/group-chat/:id/:name', component: GroupChat },
  { path: '/all-group', component: GroupChat },
  { path: '/post-detail/:id', component: PostDetail },
  { path: '/list-topic/:id/:name', component: ListTopicChild },
  { path: '/list-topic/search/:search', component: ListTopicChild },
  { path: '/ban-page', component: BanLayout, layout: null },
  { path: '*', component: PageNotFound, layout: null },
];

export { publicRoutes };
