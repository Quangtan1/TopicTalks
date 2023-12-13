import { FC, useEffect, useRef, useState } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import { handleImageUpload } from 'src/utils/helper';
import { IoDocumentAttachSharp } from 'react-icons/io5';
import { observer } from 'mobx-react';
import uiStore from 'src/store/uiStore';
import './ImageUpload.scss';
import CropEasy from 'src/components/cropImage/crop/CropEasy';

interface Props {
  selectedImage: string;
  imageUrl: string;
  setSelectedImage: (any) => void;
}

const ImageUpload: FC<Props> = observer(({ selectedImage, imageUrl, setSelectedImage }) => {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenCrop, setIsOpenCrop] = useState(false);
  const [isCropped, setIsCropped] = useState(false);
  const [file, setFile] = useState(null);
  const [isEditingImage, setIsEditingImage] = useState(false);

  const handleClose = () => {
    setIsEditingImage(false);
    setSelectedImage('');
  };

  const handleLinkClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (selectedImage !== '') {
      setIsEditingImage(true);
      uiStore?.setLoading(false);
      setIsLoading(false);
    }
  }, [selectedImage]);

  return (
    <>
      <Box className="add_image_icon-text">
        {!isEditingImage && (
          <>
            <Box className="add_image_icon-text__box">
              <Typography>Upload Image: </Typography>
              <IoDocumentAttachSharp className="add_image_icon-text__box__icon" onClick={handleLinkClick} />
            </Box>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: ' none' }}
              onChange={(e) => {
                handleImageUpload(e.target.files, setSelectedImage, true);
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

        {isLoading ? (
          <Skeleton sx={{ height: '500px', width: '500px' }} animation="wave" variant="rectangular" />
        ) : (
          isEditingImage && (
            <Box sx={{ height: '500px', width: '600px' }}>
              <CropEasy
                setFile={setFile}
                photoURL={selectedImage}
                setIsCropped={setIsCropped}
                onCancel={handleClose}
                setLoading={setIsLoading}
                setPhotoURL={setSelectedImage}
                setOpenCrop={() => setIsOpenCrop(true)}
              />
            </Box>
          )
        )}
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
