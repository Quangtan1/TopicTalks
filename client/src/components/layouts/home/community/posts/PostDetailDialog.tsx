import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import { IComment, IPost } from 'src/queries';
import accountStore from 'src/store/accountStore';
import { API_KEY, createAxios, deleteDataAPI, getDataAPI, postDataAPI, putDataAPI } from 'src/utils';
import './PostDetailDialog.scss';
import { BsEmojiSmile, BsThreeDots } from 'react-icons/bs';
import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { FcEditImage, FcShare } from 'react-icons/fc';
import { formatTime } from 'src/utils/helper';
import uiStore from 'src/store/uiStore';
import { useNavigate } from 'react-router-dom';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { AiOutlineEdit, AiTwotoneHeart } from 'react-icons/ai';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import { RiDeleteBin2Line, RiDeleteBin5Line } from 'react-icons/ri';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import NewPost from 'src/components/layouts/postManagement/newPost/NewPost';
import postItemStore from 'src/store/postStore';
import { MdDone, MdOutlineCancel } from 'react-icons/md';
import { FiberManualRecordTwoTone } from '@mui/icons-material';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  postId: number;
}
const PostDetailDialog = observer((props: DialogProps) => {
  const { open, onClose, postId } = props;
  const [post, setPost] = useState<IPost>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [inputComment, setInputComment] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [openConfirm, setOpenConFirm] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isEditComment, setIsEditComment] = useState<number>();
  const [inputEdit, setInputEdit] = useState<string>('');
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [commentId, setCommentId] = useState<number>();
  const [statusSelect, setStatusSelect] = useState<number>();
  const [statusConfirm, setStatusConfirm] = useState<boolean>(false);
  const [statusId, setStatusId] = useState<number>();
  const navigate = useNavigate();
  const emoijiRef = useRef(null);

  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const handleClickOutside = (event) => {
    const idSvg = document.querySelector('#svg_emoiji');
    const idText = document.querySelector('#text_input');
    if (
      emoijiRef?.current &&
      !emoijiRef?.current.contains(event.target) &&
      !idSvg.contains(event.target) &&
      !idText.contains(event.target)
    ) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    uiStore?.setLoading(true);
    getDataAPI(`/post/${postId}`, account.access_token, axiosJWT)
      .then((res) => {
        setPost(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getDataAPI(`/comment/${postId}`, account.access_token, axiosJWT)
      .then((res) => {
        setComments(res.data.data);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleComment = () => {
    if (inputComment.trim() !== '') {
      uiStore?.setLoading(true);
      const commentData = {
        postId: postId,
        userId: account.id,
        content: inputComment,
      };
      postDataAPI(`/comment/create`, commentData, account.access_token, axiosJWT)
        .then((res) => {
          comments?.length === undefined ? setComments([res.data.data]) : setComments([...comments, res.data.data]);
          const inputElement = document.getElementById('text_input');
          inputElement.blur();
          setPost({
            ...post,
            totalComment: post?.totalComment + 1,
          });
          setShowEmojiPicker(false);
          setInputComment('');
          uiStore?.setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleLike = () => {
    const likeData = {
      postId: postId,
      userId: account.id,
    };
    postDataAPI(`/like/create`, likeData, account.access_token, axiosJWT)
      .then((res) => {
        setPost({
          ...post,
          like: {
            totalLike: post.like.totalLike + 1,
            userLike: [
              ...post.like?.userLike,
              {
                id: account.id,
                username: account.username,
              },
            ],
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUnlike = () => {
    deleteDataAPI(`/like/remove/uid=${account?.id}&&pid=${post?.id}`, account.access_token, axiosJWT)
      .then((res) => {
        setPost((prevPost) => {
          const updatedUserLike = prevPost.like?.userLike.filter((user) => {
            return user.id !== account.id && user.username !== account.username;
          });

          return {
            ...prevPost,
            like: {
              totalLike: prevPost.like.totalLike - 1,
              userLike: updatedUserLike,
            },
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const disableInput = inputComment.trim() === '';

  const handleNavigate = (id: number) => {
    if (id !== account.id) {
      navigate(`/personal-profile/${id}`);
    }
  };

  const addEmoji = (emoji: any) => {
    if (isEditComment) {
      setInputEdit(inputEdit + emoji.native);
    } else {
      setInputComment(inputComment + emoji.native);
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const deletePost = () => {
    deleteDataAPI(`/post/${post?.id}`, account.access_token, axiosJWT)
      .then(() => {
        ToastSuccess('Delete Post Succesfully');
        const newPosts = postItemStore?.posts.filter((item) => item.id !== post?.id);
        postItemStore?.setPosts(newPosts);
        handleClose();
        setOpenConFirm(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clickEditComment = (comment: IComment) => {
    setIsEditComment(comment.id);
    setInputEdit(comment.content);
  };

  const handleEditComment = (id: number) => {
    const commentData = {
      userId: account.id,
      content: inputEdit,
    };
    putDataAPI(`/comment/update/${id}`, commentData, account.access_token, axiosJWT)
      .then((res) => {
        const updatedComment = res.data.data;
        setComments((prevComments) => {
          const updatedComments = [...prevComments];
          const index = updatedComments.findIndex((item) => item.id === id);
          if (index !== -1) {
            updatedComments[index] = updatedComment;
          }
          return updatedComments;
        });
        setIsEditComment(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const confirmDeleteComment = (id: number) => {
    setCommentId(id);
    setOpenDelete(true);
  };

  const handleDeleteComment = (id: number) => {
    deleteDataAPI(`/comment/${account.id}/${id}`, account.access_token, axiosJWT)
      .then(() => {
        const newComments = comments.filter((item) => item.id !== id);
        setComments(newComments);
        setPost({
          ...post,
          totalComment: post?.totalComment - 1,
        });
        setOpenDelete(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = () => {
    postItemStore?.updatePost(post?.id, post);
    onClose();
  };

  const updateStatus = () => {
    putDataAPI(`/post/update-status?pid=${post?.id}&&sid=${statusId}`, null, account.access_token, axiosJWT)
      .then((res) => {
        setPost({
          ...post,
          status: statusId,
        });
        setStatusSelect(statusId);
        setStatusConfirm(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onChangeStatus = (e) => {
    const value = e.target.value;

    if (value !== post?.status) {
      setStatusConfirm(true);
      setStatusId(value);
    } else {
      setStatusSelect(value);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`http://localhost:3000/post-detail/${post?.id}`);
    ToastSuccess('Copied Link This Post');
  };
  const isLiked = post?.like.userLike.some((item) => item.id === account.id);

  return (
    <Dialog open={open} onClose={handleClose} className="postdetail_dialog">
      <Grid container className="grid_container">
        <Grid item md={7.5} xs={12} className="image">
          <img src={post?.img_url} alt="img" />
        </Grid>
        <Grid item md={4.5} xs={12} className="post_infor">
          <Box className="infor_user">
            <span className="active_avatar">
              <Avatar
                src={post?.avatar_url}
                onClick={() => handleNavigate(post?.author_id)}
                className={post?.author_id !== account.id && 'avatar'}
              />
              {post?.author_active ? (
                <FiberManualRecordTwoTone className="online" />
              ) : (
                <FiberManualRecordTwoTone className="offline" />
              )}
              <Box className="select_status">
                <Typography
                  onClick={() => handleNavigate(post?.author_id)}
                  className={post?.author_id !== account.id && 'link_title'}
                >
                  {post?.username}
                </Typography>
                {post?.author_id === account.id && (
                  <Select
                    value={statusSelect || post?.status}
                    className="select"
                    onChange={(e: SelectChangeEvent<number>) => onChangeStatus(e)}
                  >
                    <MenuItem value={1}>Public</MenuItem>
                    <MenuItem value={2}>Friend</MenuItem>
                    <MenuItem value={3}>Private</MenuItem>
                  </Select>
                )}

                <Typography className="hashtag">#{post?.topicName}</Typography>
              </Box>
            </span>
            <Box>
              {account.id === post?.author_id && (
                <>
                  {!post?.approved && (
                    <Button
                      onClick={() => setIsEdit(true)}
                      className={`edit`}
                      disabled={account.id !== post?.author_id}
                    >
                      <FcEditImage />
                    </Button>
                  )}

                  <Button onClick={() => setOpenConFirm(true)} className={`delete`}>
                    <RiDeleteBin5Line />
                  </Button>
                </>
              )}
            </Box>
          </Box>
          <Box className="list_comment_container">
            <Box className="list_comment">
              {comments?.length > 0 &&
                comments?.map((item) => (
                  <Box className="comment_item_box" key={item.id}>
                    <span className="active_avatar">
                      <Avatar
                        src={item?.userImage}
                        alt="avt"
                        onClick={() => handleNavigate(item.userId)}
                        className={item.userId !== account.id && 'avatar'}
                      />
                      {item.active ? (
                        <FiberManualRecordTwoTone className="online" />
                      ) : (
                        <FiberManualRecordTwoTone className="offline" />
                      )}
                    </span>
                    <Box className="comment_item">
                      <Box className="comment_content">
                        <Typography
                          onClick={() => handleNavigate(item.userId)}
                          className={item.userId !== account.id && 'link'}
                        >
                          {item?.username}
                        </Typography>
                        {isEditComment === item.id ? (
                          <Box className="box_edit_comment">
                            <TextField
                              className="edit_comment"
                              value={inputEdit}
                              multiline
                              rows={1}
                              onChange={(e) => setInputEdit(e.target.value)}
                            />
                            <MdDone
                              className={(inputEdit === '' || inputEdit === item.content) && 'disable_done'}
                              onClick={() => handleEditComment(item.id)}
                            />
                            <MdOutlineCancel onClick={() => setIsEditComment(null)} />
                          </Box>
                        ) : (
                          <Typography>{item?.content}</Typography>
                        )}
                      </Box>
                      <Box className="time_content">
                        <Typography>{formatTime(item?.createAt)}</Typography>
                        {account.id === item.userId && (
                          <>
                            <Typography onClick={() => clickEditComment(item)}>Edit</Typography>
                            <Typography onClick={() => confirmDeleteComment(item.id)}>Delete</Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
            </Box>
          </Box>
          <Box className="action_post">
            <Box className="action_post_item">
              {isLiked ? (
                <AiTwotoneHeart className="liked" onClick={handleUnlike} />
              ) : (
                <FaRegHeart onClick={handleLike} />
              )}

              <FaRegComment />
              <FcShare onClick={handleShare} />
            </Box>
            <Typography>{post?.like.totalLike} likes</Typography>
            <Typography>{formatTime(post?.created_at)}</Typography>
          </Box>
          <Box className="comment_action">
            {showEmojiPicker && (
              <span className="emoiji" ref={emoijiRef}>
                <Picker data={data} onEmojiSelect={addEmoji} />
              </span>
            )}
            <BsEmojiSmile id="svg_emoiji" onClick={toggleEmojiPicker} />
            <TextField
              id="text_input"
              placeholder="Comment here..."
              multiline
              rows={1}
              value={inputComment}
              onChange={(e) => setInputComment(e.target.value)}
              onKeyDown={(event) => {
                if (event.keyCode === 13 && !event.shiftKey) {
                  handleComment();
                }
              }}
            />
            <Button disabled={disableInput} onClick={handleComment} className={disableInput && 'button_disable'}>
              Send
            </Button>
          </Box>
        </Grid>
      </Grid>
      {openConfirm && (
        <DialogCommon
          open={openConfirm}
          onClose={() => setOpenConFirm(false)}
          content="Do you want to delete this post"
          onConfirm={deletePost}
        />
      )}
      {openDelete && (
        <DialogCommon
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          onConfirm={() => handleDeleteComment(commentId)}
          content="Do you want to delete this comment?"
        />
      )}
      {statusConfirm && (
        <DialogCommon
          open={statusConfirm}
          onClose={() => setStatusConfirm(false)}
          onConfirm={updateStatus}
          content="Do you want to update status post?"
        />
      )}
      {isEdit && (
        <NewPost isEdit open={isEdit} dataEdit={post} closePostModal={() => setIsEdit(false)} setPost={setPost} />
      )}
    </Dialog>
  );
});

export default PostDetailDialog;
