import React, { useEffect, useState } from 'react';
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
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { AiFillTag } from 'react-icons/ai';
import './NewPost.scss';
import EmotionModal from './emotionModal/EmotionModal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastSuccess } from 'src/utils/toastOptions';

const fakeDataTopic = ['AI Suggested Topic 1', 'AI Suggested Topic 2'];

const validationSchema = Yup.object({
  postContent: Yup.string().nullable().required('Post content is required'),
});
interface Props {
  open?: boolean;
  closePostModal?: () => void;
}
const NewPost: React.FC<Props> = ({ open, closePostModal }) => {
  const [suggestedTopic, setSuggestedTopic] = useState([]);
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);
  const [emotion, setEmotion] = useState('');

  useEffect(() => {
    try {
      const handleCallApi = async () => {
        //TODO:
        setSuggestedTopic(fakeDataTopic);
      };
      handleCallApi();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const setDefaultValue = () => {
    setEmotion('');
    setSuggestedTopic([]);
    resetForm();
  };

  const handleCreatePost = (data: any) => {
    ToastSuccess('Create post successfully!');
    closePostModal?.();
    setDefaultValue();
  };

  const openEmotionModal = () => {
    setIsEmotionModalOpen(true);
  };

  const closeEmotionModal = () => {
    setIsEmotionModalOpen(false);
  };

  const handleClickRemoveEmotion = () => {
    setEmotion('');
  };

  const formik = useFormik({
    initialValues: { postContent: '' },
    validationSchema,
    onSubmit: handleCreatePost,
  });

  const { errors, touched, getFieldProps, submitForm, resetForm } = formik;

  return (
    <Dialog open={open} onClose={closePostModal} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" className="dialog-title">
        Create a post
      </DialogTitle>
      <DialogContent className="dialog-content">
        <Box className="avatar-container">
          <img
            alt="avatar"
            src="https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.6435-9/133705653_1640137159522663_508931059513204360_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=174925&_nc_ohc=OYdhvQnAJMEAX-B8rzC&_nc_ht=scontent.fsgn2-3.fna&oh=00_AfBAjH_WOu99Q59AEMsqblhOURvXohqlk4eoTUMaNZA6yQ&oe=6509781B"
            width={50}
            height={50}
            className="avatar"
          />
          <Box marginLeft={2}>
            <Typography variant="subtitle1" className="username">
              Le V. Son
            </Typography>
            <Typography variant="body2" className="topic-tag">
              Topic tag
            </Typography>
          </Box>
        </Box>
        <DialogContentText className="post-label">Post a topic you are interested:</DialogContentText>
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
            touched.postContent && errors.postContent ? (
              <Typography variant="caption" color="error">
                {errors.postContent as string}
              </Typography>
            ) : null
          }
        />
        {!!emotion && (
          <Box display={'flex'} alignItems={'center'} className="wrap-emotion">
            {/* Emotion */}
            <Typography variant="body2" className="emotion-text">
              Feeling:
            </Typography>
            <img
              src={emotion}
              alt={`Emotion ${emotion.toString()}}`}
              className="emotion-icon"
              onClick={() => handleClickRemoveEmotion()}
            />
          </Box>
        )}
        <Box className="actions-container">
          <Button className="post-button" onClick={submitForm}>
            Post
          </Button>
          <Button startIcon={<EmojiEmotionsIcon />} className="emotion-button" onClick={openEmotionModal}>
            Emotion
          </Button>
          <EmotionModal
            open={isEmotionModalOpen}
            onClose={closeEmotionModal}
            emotion={emotion}
            setEmotion={setEmotion}
          />
        </Box>
        <Box className="suggested-topics">
          <Typography variant="subtitle2">
            <AiFillTag />
            Hash tag suggestions by AI:
          </Typography>
          <Box display="flex" flexWrap="wrap" sx={{ border: '3px solid rgb(135, 44, 228)' }}>
            {suggestedTopic?.map((topic: string, index: number) => (
              <Button key={index} variant="outlined" size="small" className="suggested-topic">
                {topic}
              </Button>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button onClick={closePostModal} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewPost;
