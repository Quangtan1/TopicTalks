import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './Rating.scss';
import { GiRoundStar } from 'react-icons/gi';
import { ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { createAxios, getDataAPI, postDataAPI } from 'src/utils';
import { RatingByTopicChild } from 'src/types/topic.type';

interface IDialogProps {
  ratingThisTopic: RatingByTopicChild[];
  open: boolean;
  onClose: () => void;
  tpcId: string;
  setRatingThisTopic: React.Dispatch<React.SetStateAction<RatingByTopicChild[]>>;
}
const Rating = observer((props: IDialogProps) => {
  const { open, onClose, tpcId, setRatingThisTopic, ratingThisTopic } = props;
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };
  const axiosJWT = createAxios(account, setAccount);

  const handleStarHover = (value: number) => {
    setHoverValue(value);
  };

  useEffect(() => {
    getDataAPI(`/ratings/all/usr/${account?.id}/tpc/${tpcId}`, account?.access_token, axiosJWT)
      .then((res) => {
        setHoverValue(res.data.data.rating);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleStarClick = (value: number) => {
    const data = {
      tpcId: tpcId,
      userId: account?.id,
      rating: value,
    };
    postDataAPI(`/ratings/topic`, data, account.access_token, axiosJWT)
      .then((res) => {
        ToastSuccess('Rating Successfully');
        const existingIndex = ratingThisTopic.findIndex(
          (item) => item.userId === res.data.data.userId && item.tpcId === res.data.data.tpcId,
        );
        if (existingIndex !== -1) {
          const updatedRatingArray = [...ratingThisTopic];
          updatedRatingArray[existingIndex] = res.data.data;
          setRatingThisTopic(updatedRatingArray);
        } else {
          setRatingThisTopic((prevRating) => [...prevRating, res.data.data]);
        }
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Dialog open={open} onClose={onClose} className="rating_container">
      <DialogTitle className="dialog_title">Your rating</DialogTitle>
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
