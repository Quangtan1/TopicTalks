import './styles.scss';
import accountStore from 'src/store/accountStore';
import { createAxios, putDataAPI } from 'src/utils';
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
import { ToastSuccess } from 'src/utils/toastOptions';
import { useMutation } from 'react-query';
import { observer } from 'mobx-react';
import uiStore from 'src/store/uiStore';
import AvatarComponent from '../../postManagement/newPost/avatarComponent/AvatarComponent';
import './styles.scss';
import { formatDate } from 'src/utils/helper';
import { IUserProfile } from 'src/types/account.types';

const validationSchema = Yup.object({
  username: Yup.string().nullable().required('User Name is required'),
  email: Yup.string().nullable().required('Email is required'),
  fullName: Yup.string().nullable().required('Full Name is required'),
});

interface Props {
  isOpen?: boolean;
  onEditSuccess?: () => void;
  handleClose?: () => void;
  userInfor: IUserProfile;
  setUserInfor: React.Dispatch<React.SetStateAction<IUserProfile>>;
}

const EditProfileModal = observer((props: Props) => {
  const { isOpen, handleClose, userInfor, setUserInfor } = props;
  const formRef = useRef<FormikProps<any>>(null);

  const account = accountStore?.account;

  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const axiosJWT = createAxios(account, setAccount);

  const handleUpdateProfile = () => {
    const updateData = formik?.values;
    putDataAPI(`/user/${account.id}`, updateData, account.access_token, axiosJWT)
      .then((res) => {
        ToastSuccess('Update Profile Successfully');
        handleClose();
        setUserInfor(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const formik = useFormik({
    initialValues: {
      id: userInfor?.id,
      fullName: userInfor?.fullName,
      username: userInfor?.username,
      email: userInfor?.email,
      phoneNumber: userInfor?.phoneNumber,
      dob: formatDate(userInfor?.dob) || new Date().toISOString(),
      bio: userInfor?.bio,
      gender: userInfor?.gender,
      country: userInfor?.country,
      imageUrl: userInfor?.imageUrl,
    },
    validationSchema,
    innerRef: formRef,
    onSubmit: handleUpdateProfile,
  });

  const { errors, touched, getFieldProps, submitForm, values, dirty } = formik;

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth className="form-dialog-title">
      <DialogTitle id="form-dialog-title" className="dialog-title">
        Edit a profile
      </DialogTitle>
      <DialogContent className="dialog-content">
        <AvatarComponent url={account?.url_img} username={account?.username} />
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
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={submitForm} disabled={!dirty}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default EditProfileModal;
