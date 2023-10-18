import { Avatar, Box, Button, Dialog, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import { IComment, IPost } from 'src/queries';
import accountStore from 'src/store/accountStore';
import { createAxios, deleteDataAPI, getDataAPI, postDataAPI } from 'src/utils';
import './PostDetailDialog.scss';
import { BsEmojiSmile, BsThreeDots } from 'react-icons/bs';
import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { FcShare } from 'react-icons/fc';
import { formatTime } from 'src/utils/helper';
import uiStore from 'src/store/uiStore';
import { useNavigate } from 'react-router-dom';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { AiTwotoneHeart } from 'react-icons/ai';
import { ToastError } from 'src/utils/toastOptions';

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
    uiStore?.setLoading(true);
    if (inputComment.trim() !== '') {
      uiStore?.setLoading(true);
      const commentData = {
        postId: postId,
        userId: account.id,
        content: inputComment,
      };
      postDataAPI(`/comment/create`, commentData, account.access_token, axiosJWT)
        .then((res) => {
          setComments([...comments, res.data.data]);
          const inputElement = document.getElementById('text_input');
          inputElement.blur();
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
        console.log(res.data.data);
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
    setInputComment(inputComment + emoji.native);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const isLiked = post?.like.userLike.some((item) => item.id === account.id);

  return (
    <Dialog open={open} onClose={onClose} className="postdetail_dialog">
      <Grid container className="grid_container">
        <Grid item md={7.5} xs={12} className="image">
          <img src={post?.img_url} alt="img" />
        </Grid>
        <Grid item md={4.5} xs={12} className="post_infor">
          <Box className="infor_user">
            <span>
              <Avatar src={post?.avatar_url} onClick={() => handleNavigate(post?.author_id)} />
              <Typography onClick={() => handleNavigate(post?.author_id)}>{post?.username}</Typography>
            </span>
            <BsThreeDots />
          </Box>
          <Box className="list_comment_container">
            <Box className="list_comment">
              {comments?.length > 0 &&
                comments?.map((item) => (
                  <Box className="comment_item_box" key={item.id}>
                    <Avatar src={item?.userImage} alt="avt" onClick={() => handleNavigate(item.userId)} />
                    <Box className="comment_item">
                      <Box className="comment_content">
                        <Typography onClick={() => handleNavigate(item.userId)}>{item?.username}</Typography>
                        <Typography>{item?.content}</Typography>
                      </Box>
                      <Typography>{formatTime(item?.createAt)}</Typography>
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
              <FcShare />
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
    </Dialog>
  );
});

export default PostDetailDialog;
