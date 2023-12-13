import { FC, useEffect, useRef, useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { handleImageUpload } from 'src/utils/helper';
import { IoDocumentAttachSharp } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { observer } from 'mobx-react';
import uiStore from 'src/store/uiStore';
import CropEasy from 'src/components/cropImage/crop/CropEasy';

interface Props {
  touched: any;
  getFieldProps: any;
  errors: any;
  selectedImage: any;
  // uiStore: any;
  isSelected?: boolean;
  values: any;
  setSelectedImage: (any) => void;
}

const ImageUpload: FC<Props> = observer(
  ({
    // uiStore,
    isSelected,
    touched,
    getFieldProps,
    errors,
    selectedImage,
    values,
    setSelectedImage,
  }) => {
    const fileInputRef = useRef(null);

    const [isOpenCrop, setIsOpenCrop] = useState(false);
    const [isCropped, setIsCropped] = useState(false);
    const [file, setFile] = useState(null);

    const handleClose = () => {};

    const handleLinkClick = () => {
      fileInputRef.current.click();
    };

    useEffect(() => {
      if (selectedImage !== '') {
        uiStore?.setLoading(false);
        setIsCropped(false);
      }
    }, [selectedImage]);

    return (
      <>
        {/* {!isSelected && (
          <TextField
            autoFocus
            margin="dense"
            id="image-upload"
            {...getFieldProps('imageUrl')}
            label="Image URL or Upload Image"
            type="text"
            fullWidth
            variant="outlined"
            className="image-url-input"
            error={touched.imageUrl && Boolean(errors.imageUrl)}
            helperText={
              touched.imageUrl && errors.imageUrl ? (
                <Typography variant="caption" color="error">
                  {errors.imageUrl as string}
                </Typography>
              ) : null
            }
          />
        )} */}
        <Box className="add_image_child">
          <Typography>Upload Image: </Typography>
          <IoDocumentAttachSharp onClick={handleLinkClick} style={{ cursor: 'pointer' }} />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: ' none' }}
            onChange={(e) => {
              handleImageUpload(e.target.files, setSelectedImage, true);
              uiStore?.setLoading(true);
            }}
          />
        </Box>

        <img
          src={selectedImage !== '' ? selectedImage : values?.imageUrl}
          alt="Selected"
          className="selected-image-preview"
        />
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
  },
);

export default ImageUpload;
