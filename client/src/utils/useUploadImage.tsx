/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from 'react';
import { Button, Typography, Input } from '@mui/material';
import { RemoveCircle as RemoveCircleIcon } from '@mui/icons-material';

export const useUploadAndDisplayImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return { selectedImage, handleImageChange, removeImage };
};
