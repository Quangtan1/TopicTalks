import { Box, Button, Typography } from '@mui/material';
import './PostItem.scss';
import { IPost } from 'src/queries';
import friendStore from 'src/store/friendStore';
import accountStore from 'src/store/accountStore';
import { observer } from 'mobx-react';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { RiDoubleQuotesL } from 'react-icons/ri';
import { formatDatePost } from 'src/utils/helper';
import { handleTitle } from 'src/components/layouts/profile/PartnerProfile';
import { useNavigate } from 'react-router-dom';

interface PostProps {
  posts?: IPost[];
  handleDetailPost: (id: number) => void;
}

const PostItem = observer((props: PostProps) => {
  const { posts, handleDetailPost } = props;

  const navigate = useNavigate();

  const handleNavigateToFriendPage = (friendId: number) => {
    if (!friendId) return;
    navigate(`/personal-profile/${friendId}`);
  };

  const postApproves =
    posts &&
    posts?.filter((item) => {
      const isFriend = friendStore?.friends?.some(
        (friend) => (friend.friendId === item?.author_id || friend.userid === item?.author_id) && friend.accept,
      );
      return (
        item.status === 1 ||
        (item.status === 2 && isFriend) ||
        (accountStore?.account.id === item.author_id && item.status !== 3)
      );
    });

  const postApprovesSort = postApproves?.sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return Math.floor(timeB / 1000) - Math.floor(timeA / 1000);
  });

  return (
    <Box className="postitem_container">
      {postApprovesSort?.length > 0 ? (
        postApprovesSort?.map((item, index: number) => (
          <Box className={`card_post ${index % 2 === 0 ? 'image_right' : 'image_left'}`} key={item.id}>
            <img src={item.img_url} className="image" alt="img" loading="lazy" />
            <Box className="box_card_content">
              <RiDoubleQuotesL className="quotes" />
              <Typography className="topic_name">{item.topicName},</Typography>
              {handleTitle(item.title, handleNavigateToFriendPage)}
              <Typography className="date">
                {formatDatePost(item.created_at)} / / {item.like.totalLike} LIKES && {item.totalComment} COMMENTS
              </Typography>
              <span>_________</span>
              <Typography className="content">{item.content}</Typography>
              <Button onClick={() => handleDetailPost(item.id)}>
                Read More <HiOutlineArrowRight />
              </Button>
            </Box>
          </Box>
        ))
      ) : (
        <Box className="no_data">
          <Typography>There are no results found</Typography>
        </Box>
      )}
    </Box>
  );
});

export default PostItem;
