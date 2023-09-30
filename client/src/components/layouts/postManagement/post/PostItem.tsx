import { useState } from 'react';
import { Box, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import './PostItem.scss';
import CommentsList from './comments/CommentsListModal';
import ShareModal from './shareModal/ShareModal';
import { useGetAllPosts } from 'src/queries/functionQuery';
import Loading from 'src/components/loading/Loading';
import PostHeader from './postHeader';
import { CommentButton, LikeButton, ShareButton } from './buttonGroup';
import { IPost } from 'src/queries/types';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { useNavigate } from 'react-router-dom';

const PostItem = observer(() => {
  const navigate = useNavigate();

  // ============================== React Query Post ==============================
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };
  const { data: postData, isLoading, refetch: refetchPost } = useGetAllPosts(account, setAccount);

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

  const userName = account?.username;

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Box className="post-item-container">
          {postData?.data?.map((post: IPost, index) => {
            return (
              <Card key={post?.id} onClick={() => handleClickPostItem(post?.id)} className="post-item">
                <PostHeader refetchPost={refetchPost} data={post} userName={userName} account={account} />

                <CardContent>
                  <Typography>{post?.content}</Typography>
                </CardContent>

                <CardMedia component="img" image={post.img_url} title={userName} />

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
                  <ShareButton
                    isShareModalOpen={isShareModalOpen}
                    setIsShareModalOpen={setIsShareModalOpen}
                    sharesCount={12}
                  />
                  <CommentsList comments={['comments']} isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} />
                  <ShareModal open={isShareModalOpen} onClose={handleCloseShareModal} />
                </CardActions>
              </Card>
            );
          })}
        </Box>
      )}
    </>
  );
});

export default PostItem;
