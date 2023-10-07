import { Avatar, Box, CardHeader, Typography } from '@mui/material';
import { formatDate } from 'src/utils/helper';
import ActionModal from '../actionModal/ActionModal';
import { Actions, actionsMenu } from '../actionModal/helpers';
import { useMutation } from 'react-query';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import { deletePost } from 'src/queries';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import { useState } from 'react';
import NewPost from '../../newPost/NewPost';

export const DELETE_POST = 'Do you want to DELETE post?';

const PostHeader = ({ userName, account, refetchPost, data, refetchPostAdmin }) => {
  const useDeletePost = useMutation((id: number) => deletePost(id, account));

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleDeletePost = async (postId: number) => {
    try {
      const result = await useDeletePost.mutateAsync(postId);
      if (result.status === 200) {
        ToastSuccess('Delete post successfully!');
        refetchPost();
        setOpen(!open);
        refetchPostAdmin();
      }
    } catch (error) {
      ToastError('Error deleting post!');
    }
  };

  const handleActions = (action: Actions) => {
    switch (action) {
      case Actions.Edit:
        setIsEdit(!isEdit);
        break;
      case Actions.Delete:
        setOpen(!open);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <CardHeader
        avatar={<Avatar />}
        title={userName}
        subheader={
          <>
            <Typography variant="body2" color="textSecondary">
              {formatDate(data?.created_at)}
            </Typography>
            {data?.approved === false && (
              <Typography variant="body2" style={{ color: 'red' }} color="textSecondary">
                This post is waiting for approval
              </Typography>
            )}
          </>
        }
        action={
          <Box sx={{ cursor: 'pointer' }}>
            <ActionModal actionsMenu={actionsMenu} onClick={handleActions} />
          </Box>
        }
      />
      <DialogCommon
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => handleDeletePost(data?.id)}
        content={DELETE_POST}
      />
      <NewPost
        isEdit
        open={isEdit}
        onEditSuccess={refetchPost}
        closePostModal={() => setIsEdit(!isEdit)}
        dataEdit={data}
      />
    </>
  );
};

export default PostHeader;
