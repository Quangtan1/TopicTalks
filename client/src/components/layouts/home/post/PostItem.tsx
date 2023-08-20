import { useState } from 'react';
import {
  Avatar,
  Box,
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
import TopicItem from './topicItem/TopicItem';
import CommentsList from './comments/CommentsListModal';
import fakeDataPost from './fakeDataPost.json';
import ShareModal from './shareModal/ShareModal';

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
          <TopicItem
            post={post.topic}
            open={isTopicModalOpen}
            onOpenClose={() => setIsTopicModalOpen(!isTopicModalOpen)}
            handleTopicSelect={handleTopicSelect}
          />
          <Box display="flex" flexWrap="wrap">
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
          </Box>
          <CardActions>
            <IconButton onClick={() => handleLikeClick(index)}>
              <ThumbUpAltIcon style={{ color: likedIndexes.includes(index) ? 'rgb(135,44,228)' : 'inherit' }} />
              <Typography>{likedPosts[index]}</Typography>
            </IconButton>
            <IconButton onClick={handleCommentClick}>
              <ChatBubbleOutlineIcon />
              <Typography>{post.comments.length}</Typography>
              <CommentsList comments={post.comments} isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} />
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