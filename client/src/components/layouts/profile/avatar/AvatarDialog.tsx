import { Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import './AvatarDialog.scss';
import { IUserProfile } from 'src/types/account.types';
import { IoImagesOutline } from 'react-icons/io5';
import { AiOutlineClose } from 'react-icons/ai';
import { handleImageUpload } from 'src/utils/helper';
import uiStore from 'src/store/uiStore';
import { observer } from 'mobx-react';
import { createAxios, postDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import { ToastSuccess } from 'src/utils/toastOptions';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  userInfor: IUserProfile;
  setUserInfor: React.Dispatch<React.SetStateAction<IUserProfile>>;
}
const AvatarDialog = observer((props: DialogProps) => {
  const { open, onClose, userInfor, setUserInfor } = props;
  const [imageFile, setImageFile] = useState<string>('');
  const imageRef = useRef(null);

  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  useEffect(() => {
    if (imageFile === 'err') {
      uiStore?.setLoading(false);
      setImageFile('');
    } else {
      uiStore?.setLoading(false);
    }
  }, [imageFile]);

  const handleLinkClick = () => {
    imageRef.current.click();
  };

  const updateAvatar = () => {
    const data = {
      image: imageFile,
      userId: account?.id,
    };
    postDataAPI(`/user/upload`, data, account.access_token, axiosJWT)
      .then(() => {
        ToastSuccess('Update Avatar Successfully');
        setUserInfor({ ...userInfor, imageUrl: imageFile });
        accountStore?.setAccount({ ...account, url_img: imageFile });
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteAvatar = () => {
    const data = {
      image: '',
      userId: account?.id,
    };
    postDataAPI(`/user/upload`, data, account.access_token, axiosJWT)
      .then(() => {
        ToastSuccess('Delete Avatar Successfully');
        setUserInfor({ ...userInfor, imageUrl: '' });
        accountStore?.setAccount({ ...account, url_img: '' });
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Dialog open={open} onClose={onClose} className="avatar_dialog">
      <DialogTitle className="dialog_title">
        Update Avatar <AiOutlineClose onClick={onClose} />
      </DialogTitle>
      <DialogContent className="dialog_content">
        {imageFile !== '' ? <img src={imageFile} alt="avatar" /> : <IoImagesOutline />}

        {userInfor?.imageUrl !== '' && userInfor?.imageUrl !== null && imageFile === '' && (
          <Typography className="delete" onClick={deleteAvatar}>
            Delete Current Photo
          </Typography>
        )}
        <input
          type="file"
          ref={imageRef}
          style={{ display: ' none' }}
          onChange={(e) => {
            handleImageUpload(e.target.files, setImageFile, true);
            uiStore?.setLoading(true);
          }}
        />
        {imageFile !== '' ? (
          <Typography className="delete" onClick={handleLinkClick}>
            Other Picture
          </Typography>
        ) : (
          <Typography className="choose_image" onClick={handleLinkClick}>
            Choose from computer
          </Typography>
        )}
        {imageFile !== '' && (
          <Typography className="choose_image" onClick={updateAvatar}>
            Submit
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
});

export default AvatarDialog;
