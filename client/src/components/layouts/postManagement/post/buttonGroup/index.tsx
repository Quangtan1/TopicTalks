import { IconButton, Typography } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';

export const LikeButton = ({ index, likedIndexes, likedPosts, setLikedIndexes, setLikedPosts }) => {
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
    <IconButton onClick={() => handleLikeClick(index)}>
      <ThumbUpAltIcon style={{ color: likedIndexes.includes(index) ? 'rgb(135,44,228)' : 'inherit' }} />
      <Typography>{likedPosts[index]}</Typography>
    </IconButton>
  );
};

export const CommentButton = ({ setIsModalOpen, commentsCount, isModalOpen }) => {
  const handleCommentClick = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <IconButton onClick={handleCommentClick}>
      <ChatBubbleOutlineIcon />
      <Typography>{commentsCount}</Typography>
    </IconButton>
  );
};

export const ShareButton = ({ setIsShareModalOpen, isShareModalOpen, sharesCount }) => {
  const handleShareClick = () => {
    setIsShareModalOpen(!isShareModalOpen);
  };
  return (
    <IconButton onClick={handleShareClick}>
      <ShareIcon />
      <Typography>{sharesCount}</Typography>
    </IconButton>
  );
};
