import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import './styles.scss';

//
import accountStore from 'src/store/accountStore';
import { avatar_default, createAxios, putDataAPI } from 'src/utils';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import './styles.scss';
import { formatDateUserInfor } from 'src/utils/helper';
import { IUserProfile } from 'src/types/account.types';
import { FaUserLock } from 'react-icons/fa';
import { IoIosUnlock } from 'react-icons/io';
import DialogCommon from 'src/components/dialogs/DialogCommon';

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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditProfileFullScreenDialog = observer((props: Props) => {
  const { isOpen, handleClose, userInfor, setUserInfor } = props;
  const [isConfirm, setIsConfirm] = React.useState<boolean>(false);

  const CONTENT =
    'Switching to anonymous mode will conceal your personal information, hiding it even from your friends.';
  const formRef = React.useRef<FormikProps<any>>(null);

  const account = accountStore?.account;

  const setAccount = (value) => {
    accountStore?.setAccount(value);
  };

  const axiosJWT = createAxios(account, setAccount);

  const handleUpdateProfile = () => {
    const updateData = values;
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
      email: userInfor?.email,
      phoneNumber: userInfor?.phoneNumber,
      dob: formatDateUserInfor(userInfor?.dob) === '' ? null : formatDateUserInfor(userInfor?.dob),
      bio: userInfor?.bio,
      gender: userInfor?.gender,
      country: userInfor?.country,
    },
    validationSchema,
    innerRef: formRef,
    onSubmit: handleUpdateProfile,
  });

  const handleSwitchMode = () => {
    const updateData = values;
    putDataAPI(
      `/user/status-profile?id=${account?.id}&&isPublic=${userInfor?.public ? false : true}`,
      updateData,
      account.access_token,
      axiosJWT,
    )
      .then((res) => {
        ToastSuccess(`Switch Mode Successfully!`);
        setIsConfirm(false);
        setUserInfor({ ...userInfor, public: res.data.data.public });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { errors, touched, getFieldProps, dirty, values } = formik;

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        className="edit-profile-dialog"
      >
        <AppBar className="edit-profile-dialog__app-bar">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography className="edit-profile-dialog__app-bar__title" variant="h6" component="div">
              Edit General Information
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container className="edit-profile-dialog__grid">
          <Grid item xs={8} className="edit-profile-dialog__grid__left">
            <DialogContent className="edit-profile-dialog__grid__left__dialog">
              <DialogContentText className="post-label">Edit User Profile:</DialogContentText>

              <TextField
                autoFocus
                margin="dense"
                id="Full Name"
                className="edit-profile-dialog__grid__left__dialog__input"
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
                disabled
                margin="dense"
                id="email"
                {...getFieldProps('email')}
                className="edit-profile-dialog__grid__left__dialog__input"
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
                className="edit-profile-dialog__grid__left__dialog__input"
                type="number"
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
                id="dob"
                type="date"
                label="Date of Birth"
                {...getFieldProps('dob')}
                InputLabelProps={{
                  shrink: true,
                  htmlFor: 'dob',
                }}
                inputProps={{
                  ...getFieldProps('dob'),
                  max: new Date().toISOString().split('T')[0],
                }}
                error={touched.dob && Boolean(errors.dob)}
                helperText={
                  touched.dob && errors.dob ? (
                    <Typography variant="caption" color="error">
                      {errors.dob as string}
                    </Typography>
                  ) : null
                }
                className="edit-profile-dialog__grid__left__dialog__input-date"
              />

              <TextField
                autoFocus
                margin="dense"
                className="edit-profile-dialog__grid__left__dialog__input"
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

              <FormControl
                fullWidth
                variant="outlined"
                className="edit-profile-dialog__grid__left__dialog__input"
                error={touched.gender && Boolean(errors.gender)}
              >
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
                className="edit-profile-dialog__grid__left__dialog__input"
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
              <Button onClick={handleUpdateProfile} disabled={!dirty}>
                Update
              </Button>
            </DialogActions>
          </Grid>
          <Grid item xs={3} className="edit-profile-dialog__grid__right">
            <Card className="edit-profile-dialog__grid__right__card">
              <CardActionArea className="edit-profile-dialog__grid__right__card__action-area">
                <CardMedia
                  component="img"
                  image={account?.url_img || avatar_default}
                  alt="green iguana"
                  className="edit-profile-dialog__grid__right__card__action-area__img"
                />
                <CardContent>
                  <Typography
                    className="edit-profile-dialog__grid__right__card__action-area__text"
                    variant="h5"
                    component="div"
                  >
                    {values?.username}
                  </Typography>
                  <Typography
                    className="edit-profile-dialog__grid__right__card__action-area__text"
                    variant="body1"
                    color="text.secondary"
                  >
                    {values?.fullName || 'XXXXXXXX'}
                  </Typography>
                  <Typography
                    className="edit-profile-dialog__grid__right__card__action-area__text"
                    variant="body2"
                    color="text.secondary"
                  >
                    {values?.bio || 'Update your bio'}
                  </Typography>
                  {!userInfor?.public ? (
                    <Button className="anonymous" onClick={() => setIsConfirm(true)}>
                      Switch anonymous mode. <FaUserLock />
                    </Button>
                  ) : (
                    <Button className="cancel_anonymous" onClick={handleSwitchMode}>
                      Cancel anonymous mode. <IoIosUnlock />
                    </Button>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
        {isConfirm && (
          <DialogCommon
            open={isConfirm}
            onClose={() => setIsConfirm(false)}
            content={CONTENT}
            onConfirm={handleSwitchMode}
          />
        )}
      </Dialog>
    </React.Fragment>
  );
});
export default EditProfileFullScreenDialog;
