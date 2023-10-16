import { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import './PostItem.scss';
import {
  createLike,
  removeLike,
  useGetAllPosts,
  useGetAllPostsByAuthorId,
  useGetAllPostsByIsApproved,
} from 'src/queries/functionQuery';
import Loading from 'src/components/loading/Loading';
import PostHeader from './postHeader';
import { CommentButton, LikeButton, ShareButton } from './buttonGroup';
import { IPost } from 'src/queries/types';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { useNavigate } from 'react-router-dom';
import { createAxios } from 'src/utils';
import _ from 'lodash';
import { useMutation } from 'react-query';
import { useShare } from 'react-facebook';
import 'react-multi-carousel/lib/styles.css';
import 'react-multi-carousel/lib/styles.css';
import SimplePost from './postInCommunity';

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

  //================================= React Query Like ====================================
  const useUnlike = useMutation((postId: number) => removeLike(postId, account));
  const useLike = useMutation((postId: number) => createLike(postId, account));
  // ============================== State ==============================
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleClickCommentItem = (postId: number) => {
    navigate(`/post-detail/${postId}`);
  };

  const handleLikeActionSuccess = () => {
    refetchPost();
    refetchPostAdmin();
    refetchPostByAuthorId();
  };

  const handleClickPostItem = (postId: number) => {
    navigate(`/post-detail/${postId}`);
  };

  const renderPostItemInProfile = (post: IPost, index: number) => {
    const isLiked = post?.like?.username?.some((user) => user === username);
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

        <Box display="flex" flexWrap="wrap" className="count-group">
          <CardContent>
            <Button className="like-count" variant="outlined">
              {post?.like?.totalLike} Likes
            </Button>
          </CardContent>
          <CardContent>
            <Button className="comment-count" variant="outlined">
              {post?.totalComment} Comments
            </Button>
          </CardContent>
        </Box>

        <CardActions>
          <LikeButton
            useLike={useLike}
            isLiked={isLiked}
            postId={post?.id}
            likeCount={post?.like?.totalLike}
            onSuccess={handleLikeActionSuccess}
            useUnlike={useUnlike}
          />
          <CommentButton
            handleClickCommentItem={() => handleClickCommentItem(post?.id)}
            commentsCount={post?.totalComment}
          />
          <ShareButton
            handleShare={handleShare}
            isShareModalOpen={isShareModalOpen}
            setIsShareModalOpen={setIsShareModalOpen}
          />
        </CardActions>
      </Card>
    );
  };

  const { share } = useShare();

  const handleShare = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await share({
        href: 'https://www.facebook.com/sharer',
        display: 'popup',
        hashtag: 'Share post from topicTalks app',
      });
    } catch (error) {
      console.log('🚀 handleShare ~ error:', error);
    }
  };

  const renderNoPost = () => {
    return (
      <>
        <Typography className="no-post">Currently, There are no posts. Create a post now!</Typography>
      </>
    );
  };
  const renderPostItemInCommunity = (posts: IPost[]) => {
    return (
      <>
        <SimplePost posts={posts} handleClickPostItem={handleClickPostItem} />
      </>
    );
  };
  const postItems = isProfile ? postByAuthorIdData : postData;
  console.log('🚀 ~ file: PostItem.tsx:156 ~ PostItem ~ postByAuthorIdData:', postByAuthorIdData);

  const renderPostItems = () => {
    if (_.isEmpty(postItems) && _.isEmpty(postDataAdmin)) {
      return renderNoPost();
    }

    if (!_.isEmpty(postDataAdmin) && _.isEmpty(postItems)) {
      return <Typography className="no-post">Post is waiting for admin approval!</Typography>;
    }

    return postItems.map((postItem: IPost, index: number) => {
      return renderPostItemInProfile(postItem, index);
    });
  };

  return (
    <>
      {isLoading || isLoadingPostByAuthorId ? (
        <Loading />
      ) : (
        <>
          <Box className="post-item-container">
            {isProfile ? renderPostItems() : renderPostItemInCommunity(postItems)}
          </Box>
        </>
      )}
    </>
  );
});

export default PostItem;
