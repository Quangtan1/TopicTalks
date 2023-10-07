import { useState } from 'react';
import { Box, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import './PostItem.scss';
import CommentsList from './comments/CommentsListModal';
import ShareModal from './shareModal/ShareModal';
import { useGetAllPosts, useGetAllPostsByAuthorId, useGetAllPostsByIsApproved } from 'src/queries/functionQuery';
import Loading from 'src/components/loading/Loading';
import PostHeader from './postHeader';
import { CommentButton, LikeButton, ShareButton } from './buttonGroup';
import { IPost } from 'src/queries/types';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { useNavigate } from 'react-router-dom';
import { createAxios } from 'src/utils';
import _ from 'lodash';
// import NewPost from '../newPost/NewPost';

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
  const { data: postDataAdmin, refetch: refetchPostAdmin } = useGetAllPostsByIsApproved(account, setAccount);
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
      <Card key={post?.id} className="post-item">
        <PostHeader
          refetchPost={isProfile ? refetchPostByAuthorId : refetchPost}
          data={post}
          refetchPostAdmin={refetchPostAdmin}
          userName={username}
          account={account}
        />

        <CardContent>
          <Typography>{post?.content}</Typography>
        </CardContent>

        <CardMedia
          component="img"
          image={post.img_url}
          title={username}
          onClick={() => handleClickPostItem(post?.id)}
        />

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

  // const handleOpenPostModal = () => {
  //   setIsOpenPost(!isOpenPost);
  // };

  const renderNoPost = () => {
    return (
      <>
        <Typography className="no-post">Currently, There are no posts. Create a post now!</Typography>
        {/* <Button onClick={handleOpenPostModal}>Create Post</Button> */}
      </>
    );
  };

  const renderPostItems = () => {
    const postItems = isProfile ? postByAuthorIdData : postData;

    if (_.isEmpty(postItems) && _.isEmpty(postDataAdmin)) {
      return renderNoPost();
    }

    if (!_.isEmpty(postDataAdmin) && _.isEmpty(postItems)) {
      return <Typography className="no-post">Post is waiting for admin approval!</Typography>;
    }

    return postItems.map((postItem: IPost, index: number) => {
      return renderPostItem(postItem, index);
    });
  };

  return (
    <>
      {isLoading || isLoadingPostByAuthorId ? (
        <Loading />
      ) : (
        <>
          <Box className="post-item-container">{renderPostItems()}</Box>
          {/* <NewPost open={isOpenPost} onEditSuccess={refetchPost} closePostModal={() => setIsOpenPost(!isOpenPost)} /> */}
        </>
      )}
    </>
  );
});

export default PostItem;
