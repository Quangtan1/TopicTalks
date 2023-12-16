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
import avatar_default from 'src/assets/images/avatarr_default.webp';
import beginChat from 'src/assets/images/beginChat.svg';
import chatcouple from 'src/assets/images/chatcouple.svg';
import lettermessage from 'src/assets/images/lettermessage.svg';
import contectedsvg from 'src/assets/images/contectedsvg.svg';
import phoneCall from 'src/assets/images/phoneCall.svg';
import socialNetwork from 'src/assets/images/socialnetwork.svg';
import typing from 'src/assets/images/typing.svg';
import banImage from 'src/assets/images/ban.svg';
import image_login from 'src/assets/images/login_imag.jpeg';
import admin_dashboard from 'src/assets/images/admin_dashboard.png';
import chatCarousel1 from 'src/assets/images/chat_carousel_1.svg';
import chatCarousel2 from 'src/assets/images/chat_carousel_2.svg';
import notfound from 'src/assets/images/404-error-img.png';
import notresponve from 'src/assets/images/Responsive.png';
import confirmsvg123 from 'src/assets/images/confirmsvg123.svg';
import suggest from 'src/assets/images/suggest.webp';

export {
  suggest,
  notresponve,
  confirmsvg123,
  notfound,
  admin_dashboard,
  chatCarousel2,
  chatCarousel1,
  image_login,
  banImage,
  typing,
  socialNetwork,
  avatar_default,
  partner,
  phoneCall,
  lettermessage,
  contectedsvg,
  chatcouple,
  beginChat,
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
  {
    title: 'UpdateImage',
    messageA: '',
    isName: true,
    messageB: 'changed group image',
  },
];

export const defaultStyle = {
  control: {
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
  },
  highlighter: {
    overflow: 'hidden',
  },
  input: {
    margin: 0,
    overflow: 'auto',
    height: '100% !important',
    maxHeight: '100px',
    scrollBehavior: 'unset',
  },
  '&multiLine': {
    control: {
      fontFamily: 'monospace',
      border: '1px solid silver',
    },
    highlighter: {
      padding: 9,
      height: '100% !important',
      maxHeight: '100px',
      scrollBehavior: 'unset',
    },
    input: {
      padding: 9,
      minHeight: 3,
      outline: 0,
      border: 0,
    },
  },
  suggestions: {
    bottom: '0',
    top: 'unset',
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
};

export const defaultMentionStyle = {
  backgroundColor: '#cee4e5',
};

export const imageRandom = [
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698086/TopicTalks_Post/5800_8_08_akhskn.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698083/TopicTalks_Post/5800_5_08_j2is8f.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698082/TopicTalks_Post/5300_4_04_vqttkz.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698082/TopicTalks_Post/5500_9_07_nq3yo1.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698082/TopicTalks_Post/4700_9_03_obj44j.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698081/TopicTalks_Post/4500_9_07_bn72q1.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698081/TopicTalks_Post/4500_6_06_kyxovs.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698078/TopicTalks_Post/4500_4_03_advr3b.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698076/TopicTalks_Post/4500_1_01_rwzupw.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698076/TopicTalks_Post/4200_1_07_bytn2b.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698075/TopicTalks_Post/4100_4_14_rzlhyr.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698075/TopicTalks_Post/3800_2_01_dzdeqx.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698075/TopicTalks_Post/3700_4_02_msqtcl.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698075/TopicTalks_Post/3700_6_10_zfsfym.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698074/TopicTalks_Post/3700_5_02_reszdk.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698074/TopicTalks_Post/3700_4_01_mwrvnd.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698074/TopicTalks_Post/3500_7_04_owarqa.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698073/TopicTalks_Post/2173_by3rz9.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698074/TopicTalks_Post/3500_3_01_higdiy.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698073/TopicTalks_Post/1-04_c915df.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698073/TopicTalks_Post/3600_2_10_cxxtb9.jpg',
  'https://res.cloudinary.com/tantqdev/image/upload/v1702698073/TopicTalks_Post/2262_nhtoa8.jpg',
];
