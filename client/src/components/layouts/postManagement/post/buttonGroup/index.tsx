import { IconButton, Typography } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import { FC } from 'react';

interface Props {
  isLiked: boolean;
  postId: number;
  likeCount: number;
  useUnlike: any;
  useLike: any;
  onSuccess: Function;
}

export const LikeButton: FC<Props> = ({ postId, onSuccess, isLiked, likeCount, useUnlike, useLike }) => {
  const { mutateAsync: unLikePost } = useUnlike;
  const { mutateAsync: likePost } = useLike;

  const handleLikeAction = async (postId: number) => {
    try {
      const result = await likePost(postId);
      if (result.status === 201) {
        onSuccess();
        console.log('liked', result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveLiked = async (postId: number) => {
    try {
      const result = await unLikePost(postId);
      if (result.status === 200) {
        onSuccess();
        console.log('unLiked', result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IconButton onClick={isLiked ? () => handleRemoveLiked(postId) : () => handleLikeAction(postId)}>
      <ThumbUpAltIcon style={{ color: isLiked ? 'rgb(135,44,228)' : 'inherit' }} />
      <Typography>{likeCount}</Typography>
    </IconButton>
  );
};

export const CommentButton = ({ handleClickCommentItem, commentsCount }) => {
  return (
    <IconButton onClick={handleClickCommentItem}>
      <ChatBubbleOutlineIcon />
      <Typography>{commentsCount}</Typography>
    </IconButton>
  );
};

export const ShareButton = ({ handleShare, setIsShareModalOpen, isShareModalOpen }) => {
  // const handleShareClick = () => {
  //   setIsShareModalOpen(!isShareModalOpen);
  // };
  return (
    <IconButton onClick={handleShare}>
      <ShareIcon />
      {/* <Typography>{sharesCount}</Typography> */}
    </IconButton>
  );
};
