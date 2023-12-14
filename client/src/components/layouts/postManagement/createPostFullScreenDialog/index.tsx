import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import './styles.scss';
import accountStore from 'src/store/accountStore';
import { avatar_default, createAxios } from 'src/utils';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import './styles.scss';
import ImageUpload from '../newPost/imageUpload/ImageUpload';
import {
  createPost,
  editPost,
  useGetAllPosts,
  useGetAllPostsByAuthorId,
  useGetAllPostsByIsApproved,
  useGetAllTopicParents,
} from 'src/queries/functionQuery';
import { useMutation } from 'react-query';
import { IPost } from 'src/queries';
import uiStore from 'src/store/uiStore';
import postItemStore from 'src/store/postStore';
import AvatarComponent from '../newPost/avatarComponent/AvatarComponent';
import { Box } from '@mui/system';

const validationSchema = Yup.object({
  postContent: Yup.string().nullable().required('Post content is required'),
  selectedTopicParent: Yup.string().nullable().required('Topic is required'),
  postTitle: Yup.string().nullable().required('Post title is required'),
  imageUrl: Yup.string().url('Invalid URL format'), // Add validation for imageUrl
});

interface Props {
  isOpen?: boolean;
  handleClose?: () => void;
  isEdit?: boolean;
  dataEdit?: IPost;
  open?: boolean;
  closePostModal?: (open) => void;
  onCreateSuccess?: () => void;
  setPost?: React.Dispatch<React.SetStateAction<IPost>>;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreatePostFullScreenDialog = observer((props: Props) => {
  const { isOpen, handleClose, closePostModal, onCreateSuccess, open, setPost, isEdit, dataEdit } = props;

  const [selectedImage, setSelectedImage] = React.useState(dataEdit?.img_url || '');

  const [isOpenModalCrop, setIsOpenModalCrop] = React.useState(false);

  const formRef = React.useRef<FormikProps<any>>(null);

  const account = accountStore?.account;

  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const axiosJWT = createAxios(account, setAccount);

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

  React.useEffect(() => {
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
        ToastSuccess('Post created! Awaiting admin approval.');
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

  const { errors, touched, resetForm, getFieldProps, submitForm, dirty, values } = formik;

  const onClickEditCrop = () => {
    setIsOpenModalCrop(true);
  };

  return (
    <React.Fragment>
      <Dialog fullScreen open={true} onClose={handleClose} TransitionComponent={Transition} className="new-post-dialog">
        <AppBar className="new-post-dialog__app-bar">
          <Toolbar>
            <Typography className="new-post-dialog__app-bar__title" variant="h6" component="div">
              Create New Post
            </Typography>
            <IconButton edge="end" color="inherit" onClick={closePostModal} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Grid container className="new-post-dialog__grid">
          <Grid item xs={selectedImage ? 7.5 : 11} className="new-post-dialog__grid__left">
            <DialogContent className="new-post-dialog__grid__left__dialog">
              <Box sx={{ py: 2 }}>
                <AvatarComponent url={account?.url_img} username={account?.username} />
              </Box>

              <DialogContentText sx={{ mb: 2 }} className="new-post-dialog__grid__left__dialog__label">
                Post a post you are interested:
              </DialogContentText>

              <FormControl fullWidth variant="outlined" className="topic-parent-select">
                <InputLabel htmlFor="topic-parent" sx={{ marginBottom: '10px' }}>
                  Select Status Post
                </InputLabel>

                <Select
                  className="new-post-dialog__grid__left__dialog__input"
                  label="Select Status"
                  id="status"
                  native
                  {...getFieldProps('status')}
                >
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
                className="new-post-dialog__grid__left__dialog__input"
                {...getFieldProps('postTitle')}
                label="Post Title"
                type="text"
                fullWidth
                required
                rows={1}
                multiline
                variant="outlined"
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
                className="new-post-dialog__grid__left__dialog__input"
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
                <FormControl fullWidth variant="outlined" className="new-post-dialog__grid__left__dialog__input">
                  <InputLabel htmlFor="topic-parent">Select a Topic Parent</InputLabel>

                  <Select
                    label="Select a Topic Parent"
                    id="topic-parent"
                    native
                    {...getFieldProps('selectedTopicParent')}
                  >
                    {/* <option aria-label="None" value="" /> */}
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

              <ImageUpload
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                isOpenModalCrop={isOpenModalCrop}
                setIsOpenModalCrop={setIsOpenModalCrop}
              />
            </DialogContent>
            <DialogActions className="dialog-actions">
              {/*  <Button className="post-button" onClick={submitForm} disabled={!dirty}>
                {isEdit ? 'Edit' : 'Post'}
              </Button> */}
            </DialogActions>
          </Grid>
          <Grid item xs={selectedImage ? 3.5 : 0} className="new-post-dialog__grid__right">
            <Card
              sx={
                selectedImage
                  ? {
                      width: '600px',
                      height: '400px',
                    }
                  : {
                      display: 'none',
                    }
              }
              className="new-post-dialog__grid__right__card"
            >
              <Tooltip title="Click here to edit image" placement="top">
                <CardActionArea className="new-post-dialog__grid__right__card__action-area" onClick={onClickEditCrop}>
                  <CardContent className="new-post-dialog__grid__right__card__action-area">
                    <Typography
                      className="new-post-dialog__grid__right__card__action-area__text"
                      variant="h6"
                      color="text.secondary"
                    >
                      {values?.postTitle || 'Post Title'}
                    </Typography>
                    <Box>
                      {selectedImage ? (
                        <CardMedia
                          component="img"
                          image={selectedImage}
                          alt="Post Image"
                          className="new-post-dialog__grid__right__card__action-area__img"
                        />
                      ) : (
                        <Box className="new-post-dialog__grid__right__card__action-area__img" />
                      )}
                    </Box>
                    <Box>
                      <Typography
                        className="new-post-dialog__grid__right__card__action-area__text"
                        variant="body1"
                        color="text.secondary"
                      >
                        {values?.postContent || 'Post content'}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Tooltip>
              <CardActions className="new-post-dialog__grid__right__card__actions">
                <Button
                  className="new-post-dialog__grid__right__card__actions__button"
                  onClick={submitForm}
                  disabled={!dirty && selectedImage === ''}
                >
                  {isEdit ? 'Edit' : 'Create'}
                </Button>
                <Button
                  className="new-post-dialog__grid__right__card__actions__button-remove"
                  onClick={() => setSelectedImage('')}
                  disabled={!selectedImage}
                >
                  {'Remove Image'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Dialog>
    </React.Fragment>
  );
});
export default CreatePostFullScreenDialog;
