import accountStore from 'src/store/accountStore';
import React, { useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import { useMutation } from 'react-query';
import { observer } from 'mobx-react';
import { editComment } from 'src/queries';
import Loading from 'src/components/loading/Loading';
import AvatarComponent from '../../newPost/avatarComponent/AvatarComponent';

const validationSchema = Yup.object({
  content: Yup.string().nullable().required('Comment is required'),
});

interface Props {
  isOpen?: boolean;
  commentId: number;
  onEditSuccess?: () => void;
  handleClose?: () => void;
  content: string;
}

const EditCommentModal: React.FC<Props> = observer(({ content, commentId, isOpen, handleClose, onEditSuccess }) => {
  const formRef = useRef<FormikProps<any>>(null);

  const account = accountStore?.account;

  const useEditComment = useMutation((commentBody) => editComment(commentBody, account));

  const { mutateAsync, isLoading } = useEditComment;

  const handleEditComment = async (commentBody) => {
    try {
      const result = await mutateAsync(commentBody);
      if (result.status === 200) {
        ToastSuccess('Edit comment successfully!');
        handleClose();
        onEditSuccess();
        handleResetForm();
      }
    } catch (error) {
      ToastError(`Error edit comment!`);
    }
  };

  const handleEditProfile = (dataInput) => {
    const commentBody = {
      id: commentId,
      userId: account.id,
      content: dataInput.content,
    };

    handleEditComment(commentBody);
  };

  const formik = useFormik({
    initialValues: {
      id: commentId,
      userId: account.id,
      content: content,
    },
    validationSchema,
    innerRef: formRef,
    onSubmit: handleEditProfile,
  });

  const handleResetForm = () => {
    resetForm();
  };

  const { errors, touched, getFieldProps, submitForm, resetForm } = formik;

  return isLoading ? (
    <Loading />
  ) : (
    <Dialog open={isOpen} onClose={handleClose} fullWidth className="form-dialog-title">
      <DialogTitle id="form-dialog-title" className="dialog-title">
        Edit a comment
      </DialogTitle>
      <DialogContent className="dialog-content">
        <AvatarComponent url={account.url_img} username={account.username} />
        {<DialogContentText className="post-label">Edit comment:</DialogContentText>}
        <TextField
          autoFocus
          margin="dense"
          id="content"
          {...getFieldProps('content')}
          label="Comment"
          type="text"
          fullWidth
          required
          variant="outlined"
          error={touched.content && Boolean(errors.content)}
          helperText={
            touched.content && errors.content ? (
              <Typography variant="caption" color="error">
                {errors.content as string}
              </Typography>
            ) : null
          }
        />

        <Box className="actions-container">
          <Button className="post-button" onClick={submitForm}>
            Edit
          </Button>
        </Box>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default EditCommentModal;
