import { FC } from 'react';
import { Input, TextField, Typography } from '@mui/material';

interface Props {
  touched: any;
  getFieldProps: any;
  errors: any;
  selectedImage: any;
  values: any;
  setSelectedImage: (any) => void;
}

const ImageUpload: FC<Props> = ({ touched, getFieldProps, errors, selectedImage, values, setSelectedImage }) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  return (
    <>
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
      <Input id="image-upload" type="file" onChange={handleImageUpload} />
      {values?.imageUrl && <img src={values?.imageUrl} alt="Selected" className="selected-image-preview" />}
      {selectedImage && (
        <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="selected-image-preview" />
      )}
    </>
  );
};

export default ImageUpload;
