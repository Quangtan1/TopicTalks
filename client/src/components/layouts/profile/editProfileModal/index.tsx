import './styles.scss';
import accountStore from 'src/store/accountStore';
import { createAxios } from 'src/utils';
import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';
import { useMutation } from 'react-query';
import { observer } from 'mobx-react';
import uiStore from 'src/store/uiStore';
import AvatarComponent from '../../postManagement/newPost/avatarComponent/AvatarComponent';
import { IUserInformation, editUser, useGetUserById } from 'src/queries';
import Loading from 'src/components/loading/Loading';
import './styles.scss';
import ImageUpload from '../../postManagement/newPost/imageUpload/ImageUpload';
import { formatDate } from 'src/utils/helper';

const validationSchema = Yup.object({
  username: Yup.string().nullable().required('User Name is required'),
  email: Yup.string().nullable().required('Email is required'),
});

interface Props {
  isOpen?: boolean;
  onEditSuccess?: () => void;
  handleClose?: () => void;
}

const EditProfileModal: React.FC<Props> = observer(({ isOpen, handleClose, onEditSuccess }) => {
  const formRef = useRef<FormikProps<any>>(null);

  const account = accountStore?.account;

  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const axiosJWT = createAxios(account, setAccount);

  const { id, url_img } = accountStore?.account;

  const [selectedImage, setSelectedImage] = useState('');

  const {
    data: userDetailData,
    isLoading: isLoadingUserDetail,
    refetch: refetchUserById,
  } = useGetUserById(id, axiosJWT, account);

  const useEditUser = useMutation((userData) => editUser(userData, account));

  const handleEditUserProfile = async (userData) => {
    try {
      const result = await useEditUser.mutateAsync(userData);
      if (result.status === 200) {
        ToastSuccess('Edit user profile successfully!');
        onEditSuccess?.();
        handleClose?.();
        handleResetForm();
      }
    } catch (error) {
      ToastError(`Error edit User!`);
    }
  };

  const handleEditProfile = (data: IUserInformation) => {
    const userData = {
      id: data?.id,
      fullName: data?.fullName,
      username: data?.username,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
      dob: new Date(data?.dob).toISOString(),
      bio: data?.bio,
      gender: data?.gender,
      country: data?.country,
      avatar: selectedImage || data?.imageUrl,
      imageUrl: data?.imageUrl,
    };

    handleEditUserProfile(userData);
  };

  const formik = useFormik({
    initialValues: {
      //==========InitialValues===========
      id: userDetailData?.id,
      fullName: userDetailData?.fullName,
      username: userDetailData?.username,
      email: userDetailData?.email,
      phoneNumber: userDetailData?.phoneNumber,
      dob: formatDate(userDetailData?.dob),
      bio: userDetailData?.bio,
      gender: userDetailData?.gender,
      country: userDetailData?.country,
      imageUrl: userDetailData?.imageUrl,
    },
    validationSchema,
    innerRef: formRef,
    onSubmit: handleEditProfile,
  });

  const handleResetForm = () => {
    setSelectedImage('');
    refetchUserById();
    resetForm();
  };

  const { errors, touched, getFieldProps, submitForm, resetForm, values } = formik;

  return isLoadingUserDetail ? (
    <Loading />
  ) : (
    <Dialog open={isOpen} onClose={handleClose} fullWidth className="form-dialog-title">
      <DialogTitle id="form-dialog-title" className="dialog-title">
        Edit a profile
      </DialogTitle>
      <DialogContent className="dialog-content">
        <AvatarComponent url={url_img} username="Le V. Son" />
        {<DialogContentText className="post-label">Edit User Profile:</DialogContentText>}
        <TextField
          autoFocus
          margin="dense"
          id="username"
          {...getFieldProps('username')}
          label="Username"
          type="text"
          fullWidth
          required
          variant="outlined"
          error={touched.username && Boolean(errors.username)}
          helperText={
            touched.username && errors.username ? (
              <Typography variant="caption" color="error">
                {errors.username as string}
              </Typography>
            ) : null
          }
        />

        <TextField
          autoFocus
          margin="dense"
          id="Full Name"
          {...getFieldProps('fullName')}
          label="Full Name"
          type="text"
          fullWidth
          required
          variant="outlined"
          error={touched.fullName && Boolean(errors.fullName)}
          helperText={
            touched.fullName && errors.fullName ? (
              <Typography variant="caption" color="error">
                {errors.fullName as string}
              </Typography>
            ) : null
          }
        />

        <TextField
          autoFocus
          margin="dense"
          id="email"
          {...getFieldProps('email')}
          label="Email"
          type="email"
          fullWidth
          required
          variant="outlined"
          error={touched.email && Boolean(errors.email)}
          helperText={
            touched.email && errors.email ? (
              <Typography variant="caption" color="error">
                {errors.email as string}
              </Typography>
            ) : null
          }
        />

        <TextField
          autoFocus
          margin="dense"
          id="phoneNumber"
          {...getFieldProps('phoneNumber')}
          label="Phone Number"
          type="tel"
          fullWidth
          variant="outlined"
          error={touched.phoneNumber && Boolean(errors.phoneNumber)}
          helperText={
            touched.phoneNumber && errors.phoneNumber ? (
              <Typography variant="caption" color="error">
                {errors.phoneNumber as string}
              </Typography>
            ) : null
          }
        />

        <TextField
          autoFocus
          margin="dense"
          id="dob"
          {...getFieldProps('dob')}
          label="Date of Birth"
          type="date"
          fullWidth
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          error={touched.dob && Boolean(errors.dob)}
          helperText={
            touched.dob && errors.dob ? (
              <Typography variant="caption" color="error">
                {errors.dob as string}
              </Typography>
            ) : null
          }
        />

        <TextField
          autoFocus
          margin="dense"
          id="bio"
          {...getFieldProps('bio')}
          label="Bio"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          error={touched.bio && Boolean(errors.bio)}
          helperText={
            touched.bio && errors.bio ? (
              <Typography variant="caption" color="error">
                {errors.bio as string}
              </Typography>
            ) : null
          }
        />

        <FormControl fullWidth variant="outlined" error={touched.gender && Boolean(errors.gender)}>
          <InputLabel htmlFor="gender">Gender</InputLabel>
          <Select id="gender" {...getFieldProps('gender')} label="Gender">
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          {touched.gender && errors.gender ? (
            <FormHelperText variant="outlined" color="error">
              {errors.gender as string}
            </FormHelperText>
          ) : null}
        </FormControl>

        <TextField
          autoFocus
          margin="dense"
          id="country"
          {...getFieldProps('country')}
          label="Country"
          type="text"
          fullWidth
          variant="outlined"
          error={touched.country && Boolean(errors.country)}
          helperText={
            touched.country && errors.country ? (
              <Typography variant="caption" color="error">
                {errors.country as string}
              </Typography>
            ) : null
          }
        />

        <ImageUpload
          isSelected={!!selectedImage}
          {...{ uiStore, touched, getFieldProps, errors, selectedImage, values, setSelectedImage }}
        />

        <Box className="actions-container">
          <Button className="post-button" onClick={submitForm}>
            Edit
          </Button>
        </Box>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default EditProfileModal;
