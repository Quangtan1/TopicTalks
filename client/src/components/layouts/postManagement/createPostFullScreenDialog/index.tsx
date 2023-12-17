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
import { createAxios, defaultMentionPostStyle, getDataAPI, postDataAPI } from 'src/utils';
import { defaultMentionStyle } from 'src/utils';
import {
  Avatar,
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
  editPost,
  useGetAllPosts,
  useGetAllPostsByAuthorId,
  useGetAllPostsByIsApproved,
  useGetAllTopicParents,
} from 'src/queries/functionQuery';
import { useMutation } from 'react-query';
import { IFriends, IPost } from 'src/queries';
import uiStore from 'src/store/uiStore';
import postItemStore from 'src/store/postStore';
import AvatarComponent from '../newPost/avatarComponent/AvatarComponent';
import { Box } from '@mui/system';
import { MentionsInput, Mention } from 'react-mentions';
import { handleGetOnlyTitle } from 'src/components/admin/managepost/ManagePost';
import WaitingApproveTitle from '../pendingForApproveInformation';
import { IUser } from 'src/types/account.types';
import { debounce } from 'lodash';

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
  const friendsMentionRef = React.useRef('');

  React.useEffect(() => {
    if (dataEdit?.title && isEdit) {
      if (dataEdit?.title?.includes('#')) {
        const regex = /(.+?)#(.+)/;
        const match = dataEdit?.title.match(regex);
        if (match) {
          const friendsMentionSplit = match[2].trim();
          friendsMentionRef.current = friendsMentionSplit;
        }
      }
    }
  }, [dataEdit?.title, isEdit, dataEdit?.status]);

  const account = accountStore?.account;

  const [selectedImage, setSelectedImage] = React.useState(dataEdit?.img_url || '');

  const [isOpenModalCrop, setIsOpenModalCrop] = React.useState(false);

  const [listFriends, setListFriends] = React.useState([]);

  const newListFriends = listFriends?.filter((item) => item);

  const isFormattedString = (inputString: string): boolean => {
    inputString = inputString.trim();

    const startsWithAtBracket = inputString.startsWith('@[');

    const endsWithClosingParenthesis = inputString.endsWith(')') || inputString.endsWith('@');

    return startsWithAtBracket && endsWithClosingParenthesis;
  };

  function convertFriendList(listFriends: IFriends[], account: IUser) {
    const listFriendNew = [];

    listFriends.map((item: IFriends) => {
      const itemConvert = {
        friendName: item?.userName === account?.username ? item?.friendName : item?.userName,
        friendId: item?.userid === account?.id ? item?.friendId : item?.userid,
        friendUrl: item?.userUrl === account?.url_img ? item?.friendUrl : item?.userUrl,
        accept: item?.accept,
      };

      listFriendNew.push(itemConvert);
      return [];
    });

    return listFriendNew;
  }

  const [friendsMention, setFriendsMention] = React.useState(friendsMentionRef.current);

  const formRef = React.useRef<FormikProps<any>>(null);

  const setAccount = (value) => {
    accountStore?.setAccount(value);
  };

  const axiosJWT = createAxios(account, setAccount);

  React.useEffect(() => {
    uiStore?.setLoading(true);
    getDataAPI(`friends/all/${account?.id}`, account.access_token, axiosJWT)
      .then((res) => {
        const temp = convertFriendList(res.data.data, account);
        setListFriends(temp?.filter((item) => item?.accept === true));
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        uiStore?.setLoading(false);
        console.log(err);
      });
  }, [friendsMention]);

  // ========================== Query ==========================
  const {
    data: topicParentData,
    isLoading: isLoadingTopicParent,
    refetch: refetchTopic,
  } = useGetAllTopicParents(account, setAccount);
  const { refetch: refetchPost } = useGetAllPosts(account, setAccount);
  const { refetch: refetchPostByIsApproved } = useGetAllPostsByIsApproved(account, setAccount);
  const { refetch: refetchPostByAuthorId } = useGetAllPostsByAuthorId(account?.id, axiosJWT, account);
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

  const handleMutationPost = (postData) => {
    postDataAPI(`/post/create`, postData, account.access_token, axiosJWT)
      .then((res) => {
        ToastSuccess('Post created! Awaiting admin approval.');
        onCreateSuccess?.();
        refetchTopic();
        refetchPost();
        refetchPostByAuthorId();
        refetchPostByIsApproved();
      })
      .catch((err) => {
        console.log(err);
      });
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
      image: selectedImage !== '' ? selectedImage : data?.imageUrl || '',
      author_id: +accountStore.account.id,
      title: friendsMention ? `${data?.postTitle}#${friendsMention}` : data?.postTitle,
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
      postTitle: handleGetOnlyTitle(dataEdit?.title),
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

  const renderSuggestion = (
    suggestion: any,
    search: string,
    highlightedDisplay: React.ReactNode,
    index: number,
    focused: boolean,
  ) => {
    return (
      <div
        className={`mention-suggestion ${focused ? 'mention-suggestion-focused' : ''}`}
        style={{ display: 'flex', gap: '5px', alignItems: 'center' }}
      >
        <div className="mention-avatar">
          <Avatar src={suggestion?.friendUrl} alt="avt" />
        </div>
        <div className="mention-content">
          <span>{highlightedDisplay}</span>
        </div>
      </div>
    );
  };

  React.useEffect(() => {
    if (dataEdit?.title && isEdit) {
      if (values?.status !== 2 || values?.status !== '2' || dataEdit?.status !== 2) {
        setFriendsMention('');
      }
    }
  }, [dataEdit?.title, isEdit, values?.status, dataEdit?.status]);

  const handleInputChange = debounce((value) => {
    setFriendsMention(value);
  }, 50);

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        className="new-post-dialog"
      >
        <AppBar className="new-post-dialog__app-bar">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={closePostModal} aria-label="close">
              <CloseIcon />
            </IconButton>

            <Typography className="new-post-dialog__app-bar__title" variant="h6" component="div">
              {isEdit ? 'Edit Your Post' : 'Create New Post'}
            </Typography>

            <Button
              className={
                selectedImage === '' || (!!friendsMention && !isFormattedString(friendsMention?.trim()))
                  ? 'new-post-dialog__app-bar__btn__disabled'
                  : `new-post-dialog__app-bar__btn`
              }
              onClick={submitForm}
              disabled={selectedImage === '' || (!!friendsMention && !isFormattedString(friendsMention?.trim()))}
            >
              {isEdit ? 'Edit' : 'Create'}
            </Button>
          </Toolbar>
        </AppBar>
        <Grid container className="new-post-dialog__grid">
          {!isEdit && <WaitingApproveTitle />}

          <Grid item xs={selectedImage ? 7.5 : 11} className="new-post-dialog__grid__left">
            <DialogContent className="new-post-dialog__grid__left__dialog">
              <Box sx={{ py: 2 }}>
                <AvatarComponent url={account?.url_img} username={account?.username} />
              </Box>

              <DialogContentText sx={{ mb: 2 }} className="new-post-dialog__grid__left__dialog__label">
                Submit a post you are interested:
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

              {(values.status === '2' || values.status === 2) && (
                <MentionsInput
                  id="text_input"
                  required
                  disabled={newListFriends?.length === 0 || !newListFriends}
                  value={friendsMention || friendsMentionRef.current}
                  placeholder={
                    newListFriends?.length === 0 ? "You don't have any friends to mention" : 'Mention Friend'
                  }
                  className="new-post-dialog__grid__left__dialog__input__mention"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                    handleInputChange(e.target.value);
                  }}
                  allowSpaceInQuery={false}
                  onKeyDown={(event) => {
                    if (event.keyCode === 13 && !event.shiftKey) {
                      event.preventDefault();
                    }
                  }}
                  style={{
                    ...defaultMentionPostStyle,
                    border: `${newListFriends?.length === 0 ? 'none' : '1px solid #C0C0C0'}`,
                  }}
                >
                  <Mention
                    appendSpaceOnAdd
                    trigger="@"
                    data={newListFriends?.map(
                      (item) =>
                        ({
                          id: item?.friendId?.toString(),
                          display: `${item.friendName}`,
                          friendUrl: item?.friendUrl,
                        } || []),
                    )}
                    style={defaultMentionStyle}
                    renderSuggestion={renderSuggestion}
                  />
                </MentionsInput>
              )}

              {!!friendsMention && friendsMention?.trim()?.length > 1 && !isFormattedString(friendsMention) && (
                <Typography color={'#d32f2f'} sx={{ textAlign: 'start', fontSize: '12px', ml: 1 }}>
                  This friends is incorrect or does not exist
                </Typography>
              )}

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
            <DialogActions className="dialog-actions"></DialogActions>
          </Grid>
          <Grid item xs={selectedImage ? 3.5 : 0} className="new-post-dialog__grid__right">
            <Card
              sx={
                selectedImage
                  ? {
                      width: '600px',
                      height: '410px',
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
                      {'Preview Image'}
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
                  </CardContent>
                </CardActionArea>
              </Tooltip>
              <CardActions className="new-post-dialog__grid__right__card__actions">
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
