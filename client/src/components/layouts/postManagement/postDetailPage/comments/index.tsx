import { FC } from 'react';
import { IComment, IUserInformation } from 'src/queries';
import { Box, Typography, Button, Card, CardContent, Avatar, TextField } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AiOutlineHeart } from 'react-icons/ai';
import Loading from 'src/components/loading/Loading';
import ActionModal from '../../post/actionModal/ActionModal';
import { Actions, actionsMenu } from '../../post/actionModal/helpers';
import '../styles.scss';
import { BsArrowRightSquareFill } from 'react-icons/bs';
interface Props {
  allCommentData: IComment[];
  userDetailData: IUserInformation;
  isLoadingComments: boolean;
  handleActionsComments: Function;
  formikProps: any;
}

const Comments: FC<Props> = (props) => {
  dayjs.extend(relativeTime);
  const { allCommentData, formikProps, handleActionsComments, isLoadingComments, userDetailData } = props || {};
  const { errors, touched, getFieldProps, submitForm } = formikProps || {};
  const allComment = allCommentData || [];
  return (
    <Card>
      <CardContent className="comments-wrap">
        <Typography className="title-comments" variant="h6" gutterBottom>
          Comments ({allComment?.length})
        </Typography>

        <div className="comments-scroll-container">
          <div className="comments-list">
            {isLoadingComments ? (
              <Loading />
            ) : (
              allComment.map((comment: IComment) => {
                return (
                  <Box key={comment?.id} className={'itemComments'}>
                    <Box className="userGroup">
                      <Box className="userAvatarGroup">
                        <Avatar src={userDetailData?.imageUrl} alt={comment?.username} />
                        <Typography variant="subtitle1" className="userName">
                          {comment?.username?.slice(0, 11)}
                        </Typography>
                      </Box>
                      <Box className="buttonAndTime">
                        <ActionModal
                          actionsMenu={actionsMenu}
                          onClick={(value: Actions) => handleActionsComments(value, comment?.id)}
                        />
                        <Typography className="commentsDate" variant="subtitle2" color="text.secondary" gutterBottom>
                          {dayjs(comment?.createAt).fromNow()}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="contentWrap">
                      <Typography className="content" variant="body2">
                        {comment?.content}
                      </Typography>
                      <Button className="btn-like" variant="outlined" color="primary">
                        <AiOutlineHeart className="btn-like-icon" />
                      </Button>
                    </Box>
                  </Box>
                );
              })
            )}
          </div>
        </div>
        <Box justifyContent={'center'} alignItems={'center'}>
          <TextField
            autoFocus
            margin="dense"
            id="comment-content"
            {...getFieldProps('comment')}
            label="Comment"
            type="text"
            fullWidth
            required
            rows={1}
            multiline
            variant="outlined"
            className="comment-input"
            error={touched.comment && Boolean(errors.comment)}
            helperText={
              touched.comment && errors.comment ? (
                <Typography variant="caption" color="error">
                  {errors.comment as string}
                </Typography>
              ) : null
            }
          />
          <Button onClick={submitForm}>
            Comment <BsArrowRightSquareFill style={{ marginLeft: '10px' }} />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Comments;
