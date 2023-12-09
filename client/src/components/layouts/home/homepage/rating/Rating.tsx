import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import './Rating.scss';
import { GiRoundStar } from 'react-icons/gi';
import { ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { createAxios, postDataAPI } from 'src/utils';

interface IDialogProps {
  open: boolean;
  onClose: () => void;
  tpcId: string;
}
const Rating = observer((props: IDialogProps) => {
  const { open, onClose, tpcId } = props;
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };
  const axiosJWT = createAxios(account, setAccount);

  const handleStarHover = (value: number) => {
    setHoverValue(value);
  };

  // const handleStarClick = (value: number) => {
  //   console.log(value);
  //   ToastSuccess('Rating Successfully');
  //   onClose();
  // };

  const handleStarClick = (value: number) => {
    const data = {
      tpcId: tpcId,
      userId: account?.id,
      rating: value,
    };
    postDataAPI(`/ratings/topic`, data, account.access_token, axiosJWT)
      .then(() => {
        ToastSuccess('Rating Successfully');
        onClose();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Dialog open={open} onClose={onClose} className="rating_container">
      <DialogTitle className="dialog_title">Rating</DialogTitle>
      <DialogContent className="dialog_content">
        {[1, 2, 3, 4, 5].map((value) => (
          <GiRoundStar
            key={value}
            className={`star ${value <= (hoverValue || 0) ? 'hovered' : ''}`}
            onMouseEnter={() => handleStarHover(value)}
            onMouseLeave={() => handleStarHover(null)}
            onClick={() => handleStarClick(value)}
          />
        ))}
      </DialogContent>
    </Dialog>
  );
});

export default Rating;
