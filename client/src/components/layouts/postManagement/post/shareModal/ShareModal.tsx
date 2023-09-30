import { Modal, Box, IconButton, Typography, Button } from '@mui/material';
import { IoCloseCircleOutline } from 'react-icons/io5';
import './ShareModal.scss';

function ShareModal({ open, onClose }) {
  const handleShareButtonClick = (platform: string) => {
    //add switch case for each platform
    switch (platform) {
      case 'Facebook':
        window.open('https://www.facebook.com/sharer/sharer.php?u=https://www.google.com', '_blank');
        break;
      case 'Twitter':
        window.open('https://twitter.com/intent/tweet?url=https://www.google.com', '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
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
        <IconButton className="close-icon" onClick={onClose}>
          <IoCloseCircleOutline />
        </IconButton>
        <Typography variant="h6">Share your post:</Typography>
        <Box sx={{ marginTop: '8px' }}>
          <Button variant="contained" onClick={() => handleShareButtonClick('Facebook')} style={{ marginRight: '8px' }}>
            Share on Facebook
          </Button>
          <Button variant="contained" onClick={() => handleShareButtonClick('Twitter')}>
            Share on Twitter
          </Button>
        </Box>
        {/* Add more share platform buttons as needed */}
      </Box>
    </Modal>
  );
}

export default ShareModal;
