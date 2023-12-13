import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import './NewPost.scss';
import { FormikProps, useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import accountStore from 'src/store/accountStore';
import {
  createPost,
  editPost,
  useGetAllPosts,
  useGetAllPostsByAuthorId,
  useGetAllPostsByIsApproved,
  useGetAllTopicParents,
} from 'src/queries/functionQuery';
import { useMutation } from 'react-query';
import AvatarComponent from './avatarComponent/AvatarComponent';
import ImageUpload from './imageUpload/ImageUpload';
import { observer } from 'mobx-react';
import { IPost } from 'src/queries';
import uiStore from 'src/store/uiStore';
import { createAxios } from 'src/utils';
import postItemStore from 'src/store/postStore';

const validationSchema = Yup.object({
  postContent: Yup.string().nullable().required('Post content is required'),
  selectedTopicParent: Yup.string().nullable().required('Topic is required'),
  postTitle: Yup.string().nullable().required('Post title is required'),
  imageUrl: Yup.string().url('Invalid URL format'), // Add validation for imageUrl
});
interface Props {
  open?: boolean;
  closePostModal?: (open) => void;
  isEdit?: boolean;
  dataEdit?: IPost;
  onEditSuccess?: () => void;
  onCreateSuccess?: () => void;
  setPost?: React.Dispatch<React.SetStateAction<IPost>>;
}

const NewPost: React.FC<Props> = observer(
  ({ onCreateSuccess, onEditSuccess, open, closePostModal, isEdit, dataEdit, setPost }) => {
    const formRef = useRef<FormikProps<any>>(null);
    // ========================== get store Mobx ==========================
    const account = accountStore?.account;
    const setAccount = () => {
      return accountStore?.setAccount;
    };
    const axiosJWT = createAxios(account, setAccount);
    const url_img = accountStore?.account?.url_img;

    // ========================== State ==========================
    const [selectedImage, setSelectedImage] = useState('');

    // ========================== Query ==========================
    const {
      data: topicParentData,
      isLoading: isLoadingTopicParent,
      refetch: refetchTopic,
    } = useGetAllTopicParents(account, setAccount);
    const { refetch: refetchPost } = useGetAllPosts(account, setAccount);
    const { refetch: refetchPostByIsApproved } = useGetAllPostsByIsApproved(account, setAccount);
    const { refetch: refetchPostByAuthorId } = useGetAllPostsByAuthorId(account?.id, axiosJWT, account);
    const useCreatePost = useMutation((postData) => createPost(postData, account));
    const useEditPost = useMutation((postData) => editPost(postData, account));

    const setDefaultValue = () => {
      resetForm();
    };

    useEffect(() => {
      if (selectedImage !== '') {
        uiStore?.setLoading(false);
        refetchPost();
        refetchPostByIsApproved();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedImage]);

    const handleMutationPost = async (postData) => {
      try {
        const result = await useCreatePost.mutateAsync(postData);
        if (result.status === 201) {
          ToastSuccess('Your post has been successfully created and is awaiting approval from the Admin!');
          onCreateSuccess?.();
          refetchTopic();
          refetchPost();
          refetchPostByAuthorId();
          refetchPostByIsApproved();
        }
        console.log(`Post result: `, result);
      } catch (error) {
        ToastError(`Error creating post!`);
      }
    };

    const handleEditPost = async (postData) => {
      try {
        const result = await useEditPost.mutateAsync(postData);
        if (result.status === 200) {
          ToastSuccess('Edit post successfully!');
          setPost(result.data);
          postItemStore?.updatePost(dataEdit.id, result.data);
        }
      } catch (error) {
        ToastError(`Error edit post!`);
      }
    };

    const handleCreatePost = (data) => {
      const postData = {
        postId: dataEdit?.id,
        content: data?.postContent,
        image: selectedImage !== '' ? selectedImage : data?.imageUrl,
        author_id: +accountStore.account.id,
        title: data?.postTitle,
        tparent_id: +data?.selectedTopicParent,
        status_id: +data?.status,
      };

      isEdit ? handleEditPost(postData) : handleMutationPost(postData);
      closePostModal?.(!open);
      setDefaultValue();
    };

    const formik = useFormik({
      initialValues: {
        postContent: dataEdit?.content,
        selectedTopicParent: dataEdit?.tparent_id || 1,
        postTitle: dataEdit?.title,
        imageUrl: dataEdit?.img_url,
        status: dataEdit?.status || 1,
      },
      validationSchema,
      validateOnChange: true,
      validateOnBlur: false,
      innerRef: formRef,
      onSubmit: handleCreatePost,
    });

    const { errors, touched, getFieldProps, submitForm, resetForm, dirty, values } = formik;

    return (
      <Dialog open={open} onClose={closePostModal} className="form-dialog-title">
        <DialogTitle id="form-dialog-title" className="dialog-title">
          {isEdit ? 'Edit a post' : 'Create a post'}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <AvatarComponent url={url_img} username={account?.username} />
          {!isEdit && <DialogContentText className="post-label">Post a post you are interested:</DialogContentText>}
          <FormControl fullWidth variant="outlined" className="topic-parent-select">
            <InputLabel htmlFor="topic-parent">Select Status Post</InputLabel>

            <Select label="Select Status" id="status" native {...getFieldProps('status')}>
              <option value={1}>Public</option>
              <option value={2}>Friend</option>
              <option value={3}>Private</option>
            </Select>

            <Typography variant="caption" color="error">
              {errors.status as string}
            </Typography>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            id="post-title"
            {...getFieldProps('postTitle')}
            label="Post Title"
            type="text"
            fullWidth
            required
            rows={1}
            multiline
            variant="outlined"
            className="post-title-input"
            error={touched.postTitle && Boolean(errors.postTitle)}
            helperText={
              errors.postTitle ? (
                <Typography variant="caption" color="error">
                  {errors.postTitle as string}
                </Typography>
              ) : null
            }
          />
          <TextField
            autoFocus
            margin="dense"
            id="post-content"
            {...getFieldProps('postContent')}
            label="Post content"
            type="text"
            fullWidth
            required
            rows={4}
            multiline
            variant="outlined"
            className="post-content-input"
            error={touched.postContent && Boolean(errors.postContent)}
            helperText={
              errors.postContent ? (
                <Typography variant="caption" color="error">
                  {errors.postContent as string}
                </Typography>
              ) : null
            }
          />

          {!isLoadingTopicParent && (
            <FormControl fullWidth variant="outlined" className="topic-parent-select">
              <InputLabel htmlFor="topic-parent">Select a Topic Parent</InputLabel>

              <Select label="Select a Topic Parent" id="topic-parent" native {...getFieldProps('selectedTopicParent')}>
                {topicParentData?.data?.map((topicParent) => (
                  <option key={topicParent.id} value={topicParent.id}>
                    {topicParent?.topicParentName}
                  </option>
                ))}
              </Select>

              <Typography variant="caption" color="error">
                {errors.selectedTopicParent as string}
              </Typography>
            </FormControl>
          )}

          {/* <ImageUpload {...{ selectedImage, values, setSelectedImage }} /> */}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={closePostModal} color="primary">
            Cancel
          </Button>
          <Button className="post-button" onClick={submitForm} disabled={!dirty}>
            {isEdit ? 'Edit' : 'Post'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);

export default NewPost;
