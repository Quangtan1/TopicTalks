//image local
import carousel1 from 'src/assets/images/carousel1.png';
import carousel2 from 'src/assets/images/carousel2.png';
import logo from 'src/assets/images/logo.png';
import loading from 'src/assets/images/loading.png';
import iconTopic from 'src/assets/icons/icon_topic_sidebar.svg';
import preminnum from 'src/assets/icons/preminium.svg';
import imageGroup from 'src/assets/images/group_image.jpg';
import logo_center from 'src/assets/images/logo_center.png';
import logo1 from 'src/assets/logo/Logo1.svg';
import aboutme from 'src/assets/images/Aboutme02.jpg';
import support from 'src/assets/images/aboutme1.jpg';
import overthink from 'src/assets/images/overthinkn.webp';
import topicdetail from 'src/assets/images/topicidetail.png';
import parttent from 'src/assets/images/pattern-05.png';
import partner from 'src/assets/images/partner.jpg';

export {
  partner,
  parttent,
  topicdetail,
  support,
  overthink,
  aboutme,
  logo,
  carousel1,
  carousel2,
  iconTopic,
  loading,
  preminnum,
  imageGroup,
  logo_center,
  logo1,
};

// router data
export const headerRoute = [
  {
    title: 'Home',
    path: '/home',
  },
  {
    title: 'Community',
    path: '/community',
  },
  {
    title: 'Message',
    path: '/message',
  },
  {
    title: 'All Group',
    path: '/all-group',
  },
  {
    title: 'Contact Us',
    path: '/contact',
  },
];

export const notifiData = [
  {
    title: 'Approve',
    messageA: '',
    isName: true,
    messageB: 'just approved to',
  },
  {
    title: 'Reject',
    messageA: '',
    isName: true,
    messageB: 'was refused from',
  },
  {
    title: 'DeleteConversation',
    messageA: '',
    isName: false,
    messageB: 'Conversation deleted from',
  },
  {
    title: 'Remove',
    messageA: '',
    isName: true,
    messageB: 'just deleted from',
  },
  {
    title: 'Leave',
    messageA: '',
    isName: true,
    messageB: 'just leaved',
  },
  {
    title: 'UpdateTopic',
    messageA: 'Topic',
    isName: true,
    messageB: 'from',
  },
  {
    title: 'UpdateGroupName',
    messageA: 'Group Name changed',
    isName: true,
    messageB: 'from',
  },
];
