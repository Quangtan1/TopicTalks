import { FC, useEffect, useRef, useState } from 'react';
import { Box, Button, Dialog, DialogContent, Skeleton, Typography } from '@mui/material';
import { handleImageUpload } from 'src/utils/helper';
import { observer } from 'mobx-react';
import uiStore from 'src/store/uiStore';
import './ImageUpload.scss';
import CropEasy from 'src/components/cropImage/crop/CropEasy';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface Props {
  selectedImage: string;
  setSelectedImage: (any) => void;
  isOpenModalCrop: boolean;
  setIsOpenModalCrop: (any) => void;
}

const ImageUpload: FC<Props> = observer(({ isOpenModalCrop, setIsOpenModalCrop, selectedImage, setSelectedImage }) => {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenCrop, setIsOpenCrop] = useState(false);
  const [isCropped, setIsCropped] = useState(false);
  const [file, setFile] = useState(null);
  const [isEditingImage, setIsEditingImage] = useState(false);

  const handleClose = () => {
    setIsOpenModalCrop(false);
  };

  const handleLinkClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (selectedImage !== '') {
      uiStore?.setLoading(false);
      setIsLoading(false);
    }
  }, [selectedImage]);

  return (
    <>
      <Box className="add_image_icon-text">
        {(!isEditingImage || !selectedImage) && (
          <>
            <Box className="add_image_icon-text__box">
              <Typography>Upload Image: </Typography>
              <Box className="add_image_icon-text__box__group" onClick={handleLinkClick}>
                <CloudUploadIcon className="add_image_icon-text__box__group__icon" />
              </Box>
            </Box>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: ' none' }}
              onChange={(e) => {
                handleImageUpload(e.target.files, setSelectedImage, true);
                setIsOpenModalCrop(true);
                setIsEditingImage(true);
                setIsLoading(true);
              }}
            />
          </>
        )}

        {/* {selectedImage && (
          <img
            src={selectedImage !== '' ? selectedImage : imageUrl}
            alt="Selected"
            className="selected-image-preview"
          />
        )} */}

        <Dialog open={isOpenModalCrop} onClose={handleClose}>
          <DialogContent>
            {isLoading ? (
              <Skeleton sx={{ height: '500px', width: '500px' }} animation="wave" variant="rectangular" />
            ) : (
              isEditingImage && (
                <Box>
                  <CropEasy
                    setFile={setFile}
                    photoURL={selectedImage}
                    setIsCropped={setIsCropped}
                    setIsOpenModalCrop={setIsOpenModalCrop}
                    onCancel={handleClose}
                    setLoading={setIsLoading}
                    setPhotoURL={setSelectedImage}
                    setOpenCrop={() => setIsOpenCrop(true)}
                  />
                </Box>
              )
            )}
          </DialogContent>
        </Dialog>
      </Box>
      {/* {isCropped && (
          <Box sx={{ height: '500px', width: '500px' }}>
            <CropEasy
              setFile={setFile}
              photoURL={selectedImage}
              setIsCropped={setIsCropped}
              setPhotoURL={setSelectedImage}
              setOpenCrop={() => setIsOpenCrop(true)}
            />
          </Box>
        )} */}
    </>
  );
});

export default ImageUpload;
