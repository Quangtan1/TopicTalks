import {
  Avatar,
  Box,
  Modal,
  List,
  IconButton,
  Typography,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { IComment } from '../PostItem';
import './CommentsListModal.scss';

interface Props {
  comments: IComment[];
  isModalOpen: boolean;
  handleCloseModal: () => void;
}

const CommentsList: React.FC<Props> = ({ comments, isModalOpen, handleCloseModal }) => {
  return (
    <Modal open={isModalOpen}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          className="close-icon"
          style={{ position: 'absolute', top: '8px', right: '8px' }}
          onClick={handleCloseModal}
        >
          <IoCloseCircleOutline />
        </IconButton>
        <List>
          {comments.map((comment, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar>{comment.user[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={comment.user}
                secondary={<Typography variant="body2">{comment.text}</Typography>}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default CommentsList;
