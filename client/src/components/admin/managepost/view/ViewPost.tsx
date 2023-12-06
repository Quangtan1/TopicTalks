import { FiberManualRecordTwoTone } from '@mui/icons-material';
import { Avatar, Box, Dialog, Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React from 'react';
import { IPost } from 'src/queries';
import { formatDatePost } from 'src/utils/helper';
import './ViewPost.scss';

interface IDialogProps {
  open: boolean;
  post: IPost;
  onClose: () => void;
}

const ViewPost = observer((props: IDialogProps) => {
  const { open, post, onClose } = props;
  return (
    <Dialog open={open} onClose={onClose} className="view_postdetail_dialog">
      <Grid container className="grid_container">
        <Grid item md={7.5} xs={12} className="image">
          <img src={post?.img_url} alt="img" />
        </Grid>
        <Grid item md={4.5} xs={12} className="post_infor">
          <Box className="infor_user">
            <span className="active_avatar">
              <Avatar src={post?.avatar_url} />
              {post?.author_active ? (
                <FiberManualRecordTwoTone className="online" />
              ) : (
                <FiberManualRecordTwoTone className="offline" />
              )}
              <Box className="select_status">
                <Typography>{post?.username}</Typography>

                <Typography className="hashtag">#{post?.topicName}</Typography>
              </Box>
            </span>
          </Box>
          <Box className="list_comment_container">
            {post?.content && (
              <Box className="content_post">
                <span className="active_avatar">
                  <Avatar src={post?.avatar_url} alt="avt" />
                  {post?.author_active ? (
                    <FiberManualRecordTwoTone className="online" />
                  ) : (
                    <FiberManualRecordTwoTone className="offline" />
                  )}
                </span>
                <Box className="content">
                  <Typography>{post?.content}</Typography>
                  <Typography>
                    {`---`} {formatDatePost(post?.created_at)} {`---`}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
});

export default ViewPost;
