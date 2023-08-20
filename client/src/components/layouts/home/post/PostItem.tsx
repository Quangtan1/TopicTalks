import { useState } from 'react';
import {
  Avatar,
  Box,
  Modal,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import { HiDotsHorizontal } from 'react-icons/hi';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import './PostItem.scss';
import TopicItem from './TopicItem';
import CommentsList from './CommentsListModal';
import { IoCloseCircleOutline } from 'react-icons/io5';
import fakeDataPost from './fakeDataPost.json';
import ShareModal from './ShareModal';

export interface IPost {
  id: number;
  userName: string;
  content: string;
  topic: string[];
  status: string;
  image: string[];
  likes: number;
  comments: IComment[];
  shares: number;
}

export interface IComment {
  id: number;
  user: string;
  text: string;
}

const PostItem = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState(fakeDataPost.map((post) => post.likes));
  const [likedIndexes, setLikedIndexes] = useState([]);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setIsTopicModalOpen(false);
  };

  const handleCommentClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  const handleLikeClick = (index: number) => {
    if (likedIndexes.includes(index)) {
      const newLikedIndexes = likedIndexes.filter((likedIndex) => likedIndex !== index);
      setLikedIndexes(newLikedIndexes);
      const newLikedPosts = [...likedPosts];
      newLikedPosts[index] -= 1;
      setLikedPosts(newLikedPosts);
    } else {
      const newLikedIndexes = [...likedIndexes, index];
      setLikedIndexes(newLikedIndexes);
      const newLikedPosts = [...likedPosts];
      newLikedPosts[index] += 1;
      setLikedPosts(newLikedPosts);
    }
  };

  return (
    <Box className="post-item-container">
      {fakeDataPost.map((post: IPost, index) => (
        <Card key={post.id}>
          <CardHeader
            avatar={<Avatar />}
            title={post.userName}
            subheader={
              <Typography variant="body2" color="textSecondary">
                {post?.status}
              </Typography>
            }
            action={<HiDotsHorizontal />}
          />
          <CardContent>
            <Typography>{post.content}</Typography>
          </CardContent>
          <CardMedia component="img" image={post.image[0]} title={post.userName} />
          {/* Post */}
          <TopicItem
            post={post.topic}
            open={isTopicModalOpen}
            onOpenClose={() => setIsTopicModalOpen(!isTopicModalOpen)}
            handleTopicSelect={handleTopicSelect}
          />

          <CardContent>
            <Typography variant="body2" color="textSecondary">
              {likedPosts[index]} Likes
            </Typography>
          </CardContent>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              {post.comments.length} Comments
            </Typography>
          </CardContent>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              {post.shares} Shares
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton onClick={() => handleLikeClick(index)}>
              <ThumbUpAltIcon color={likedIndexes.includes(index) ? 'primary' : 'inherit'} />
              <Typography>{likedPosts[index]}</Typography>
            </IconButton>
            <IconButton onClick={handleCommentClick}>
              <ChatBubbleOutlineIcon />
              <Typography>{post.comments.length}</Typography>
              <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <IconButton
                    className="close-icon"
                    style={{ position: 'absolute', top: '8px', right: '8px' }}
                    //TODO: khong hieu sao khong dung duoc css, Tan help Son fix nha
                    onClick={handleCloseModal}
                  >
                    <IoCloseCircleOutline />
                  </IconButton>
                  <CommentsList comments={post.comments} />
                </Box>
              </Modal>
            </IconButton>
            <IconButton onClick={handleShareClick}>
              <ShareIcon />
              <Typography>{post.shares}</Typography>
            </IconButton>
            <ShareModal open={isShareModalOpen} onClose={handleCloseShareModal} />
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default PostItem;
