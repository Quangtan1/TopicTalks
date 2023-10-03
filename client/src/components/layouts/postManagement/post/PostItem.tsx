import { useState } from 'react';
import { Box, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import './PostItem.scss';
import CommentsList from './comments/CommentsListModal';
import ShareModal from './shareModal/ShareModal';
import { useGetAllPosts, useGetAllPostsByAuthorId } from 'src/queries/functionQuery';
import Loading from 'src/components/loading/Loading';
import PostHeader from './postHeader';
import { CommentButton, LikeButton, ShareButton } from './buttonGroup';
import { IPost } from 'src/queries/types';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { useNavigate } from 'react-router-dom';
import { createAxios } from 'src/utils';

const PostItem = observer(({ isProfile = false }) => {
  const navigate = useNavigate();

  // ============================== Config mobx ==============================
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };
  const axiosJWT = createAxios(account, setAccount);

  const { username, id } = account || {};

  // ============================== React Query Post ==============================

  const { data: postData, isLoading, refetch: refetchPost } = useGetAllPosts(account, setAccount);
  const {
    data: postByAuthorIdData,
    isLoading: isLoadingPostByAuthorId,
    refetch: refetchPostByAuthorId,
  } = useGetAllPostsByAuthorId(id, axiosJWT, account);

  // ============================== State ==============================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState([1, 2, 3, 4].map((post) => 12));
  const [likedIndexes, setLikedIndexes] = useState([]);

  const handleCloseModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  const handleClickPostItem = (postId: number) => {
    navigate(`/post-detail/${postId}`);
  };

  const renderPostItem = (post: IPost, index: number) => {
    return (
      <Card key={post?.id} onClick={() => handleClickPostItem(post?.id)} className="post-item">
        <PostHeader
          refetchPost={isProfile ? refetchPostByAuthorId : refetchPost}
          data={post}
          userName={username}
          account={account}
        />

        <CardContent>
          <Typography>{post?.content}</Typography>
        </CardContent>

        <CardMedia component="img" image={post.img_url} title={username} />

        <Box display="flex" flexWrap="wrap">
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              {likedPosts[index]} Likes
            </Typography>
          </CardContent>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              {12} Comments
            </Typography>
          </CardContent>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              {12} Shares
            </Typography>
          </CardContent>
        </Box>

        <CardActions>
          <LikeButton
            index={index}
            likedIndexes={likedIndexes}
            likedPosts={likedPosts}
            setLikedIndexes={setLikedIndexes}
            setLikedPosts={setLikedPosts}
          />
          <CommentButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} commentsCount={12} />
          <ShareButton isShareModalOpen={isShareModalOpen} setIsShareModalOpen={setIsShareModalOpen} sharesCount={12} />
          <CommentsList comments={['comments']} isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} />
          <ShareModal open={isShareModalOpen} onClose={handleCloseShareModal} />
        </CardActions>
      </Card>
    );
  };

  return (
    <>
      {isLoading || isLoadingPostByAuthorId ? (
        <Loading />
      ) : (
        <Box className="post-item-container">
          {!isProfile
            ? postData?.data?.map((post: IPost, index) => {
                return renderPostItem(post, index);
              })
            : postByAuthorIdData?.data?.map((postByAuthorData: IPost, index) => {
                return renderPostItem(postByAuthorData, index);
              })}
        </Box>
      )}
    </>
  );
});

export default PostItem;
