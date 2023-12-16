import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './Rating.scss';
import { GiRoundStar } from 'react-icons/gi';
import { ToastSuccess } from 'src/utils/toastOptions';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { createAxios, getDataAPI, postDataAPI } from 'src/utils';
import { RatingByTopicChild } from 'src/types/topic.type';
import { FaSadCry, FaSadTear, FaSmileBeam, FaSmileWink } from 'react-icons/fa';
import { BsFillEmojiSmileFill } from 'react-icons/bs';
import { ImSad } from 'react-icons/im';

const rating = [
  {
    id: 1,
    title: 'Very Poor',
    icon: <FaSadCry />,
  },
  {
    id: 2,
    title: ' Poor',
    icon: <FaSadTear />,
  },
  {
    id: 3,
    title: 'Average',
    icon: <BsFillEmojiSmileFill />,
  },
  {
    id: 4,
    title: 'Good',
    icon: <FaSmileBeam />,
  },
  {
    id: 5,
    title: 'Excellent',
    icon: <FaSmileWink />,
  },
];

interface IDialogProps {
  nameTopic: string;
  ratingThisTopic: RatingByTopicChild[];
  open: boolean;
  onClose: () => void;
  tpcId: string;
  setRatingThisTopic: React.Dispatch<React.SetStateAction<RatingByTopicChild[]>>;
}
const Rating = observer((props: IDialogProps) => {
  const { open, onClose, tpcId, setRatingThisTopic, ratingThisTopic, nameTopic } = props;
  const [star, setStar] = useState<number | null>(null);
  const account = accountStore?.account;
  const setAccount = (value) => {
    accountStore?.setAccount(value);
  };
  const axiosJWT = createAxios(account, setAccount);

  useEffect(() => {
    getDataAPI(`/ratings/all/usr/${account?.id}/tpc/${tpcId}`, account?.access_token, axiosJWT)
      .then((res) => {
        setStar(res.data.data.rating);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleClick = (value: number) => {
    setStar(value);
  };

  const handleRating = () => {
    const data = {
      tpcId: tpcId,
      userId: account?.id,
      rating: star,
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

  const hoveredRating = rating.find((item) => item.id === star);

  return (
    <Dialog open={open} onClose={onClose} className="rating_container">
      <DialogTitle className="dialog_title">Your Rating</DialogTitle>
      <DialogContent className="dialog_content">
        <Box className="content">
          <Typography>How would you rate</Typography>
          <Typography>{nameTopic} ?</Typography>
        </Box>
        <Box className="vote">
          {star ? (
            <>
              {hoveredRating?.icon}
              <Typography>{hoveredRating?.title}</Typography>
            </>
          ) : (
            <>
              <ImSad />
              <Typography>Rating for this topic</Typography>
            </>
          )}
        </Box>
        <Box className="box_star">
          {[1, 2, 3, 4, 5].map((value) => (
            <GiRoundStar
              key={value}
              className={`star ${value <= (star || 0) ? 'hovered' : ''}`}
              onClick={() => handleClick(value)}
            />
          ))}
        </Box>
        <Button onClick={handleRating} disabled={!star} className={!star && 'disable'}>
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
});

export default Rating;
