import React, { useRef, useState, useEffect } from 'react';
import './VideoCall.scss';
import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { ICallData } from 'src/types/chat.type';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { TbPhoneCall } from 'react-icons/tb';
import { MdCallEnd } from 'react-icons/md';
import { BsFillCameraVideoFill, BsFillCameraVideoOffFill, BsMicFill, BsMicMuteFill } from 'react-icons/bs';

interface DialogProps {
  open: boolean;
  callUser?: ICallData;
  receiveCallUser?: ICallData;
  onLeaveCall: () => void;
  acceptCall: () => void;
  isAccepted: boolean;
  saveCall: (seconds: number) => void;
  handleTurnVideo: () => void;
  turnMyVideo: boolean;
  turnUserVideo: boolean;
}

const VideoCall = observer((props: DialogProps) => {
  const {
    open,
    callUser,
    receiveCallUser,
    onLeaveCall,
    acceptCall,
    isAccepted,
    saveCall,
    handleTurnVideo,
    turnMyVideo,
    turnUserVideo,
  } = props;
  const [stream, setStream] = useState<MediaStream>(null);
  const [muted, setMuted] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);

  const myVideo = useRef(null);
  const userVideo = useRef(null);

  const account = accountStore?.account;

  useEffect(() => {
    let userMediaStream = null;
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
          userMediaStream = stream;
          if (isAccepted && userVideo.current) {
            userVideo.current.srcObject = stream;
          }
        }
      } catch (error) {
        console.log('Error accessing media devices:', error);
      }
    };
    getUserMedia();
    return () => {
      if (userMediaStream) {
        const tracks = userMediaStream.getTracks();
        tracks.forEach((track) => {
          track.stop();
          userMediaStream.removeTrack(track);
        });
      }
    };
  }, [callUser, receiveCallUser, isAccepted]);

  useEffect(() => {
    if (isAccepted) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isAccepted]);

  const distroyMediaStream = () => {
    saveCall(seconds);
    if (stream) {
      const tracks = stream?.getTracks();
      tracks?.forEach((track) => {
        track?.stop();
        stream?.removeTrack(track);
        onLeaveCall();
      });
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <Dialog open={open} className="video_call_container">
      <DialogTitle className="dialog-title"></DialogTitle>
      <DialogContent className="dialog-content">
        <Box className="video_box">
          <Box className="video_view">
            {stream && <video playsInline muted={muted} ref={myVideo} autoPlay className="video" />}
            {!turnMyVideo && <div className="overlay"></div>}
          </Box>
          <Box className="video_view">
            {isAccepted ? <video playsInline muted={true} ref={userVideo} autoPlay className="video" /> : null}
            {!turnUserVideo && <div className="overlay"></div>}
          </Box>
        </Box>
        {account.id === callUser?.userId && isAccepted === false && (
          <Typography className="in_call">You are calling to {callUser?.targetName}...</Typography>
        )}
        {account.id === receiveCallUser?.targetId && isAccepted === false && (
          <Typography className="in_call">You have a call from {receiveCallUser?.username}...</Typography>
        )}
        {account.id === receiveCallUser?.targetId && isAccepted && (
          <>
            <Typography className="in_call">In Calling...</Typography>
            <Typography className="timer">{formatTime(seconds)}</Typography>
          </>
        )}

        <Box className="action_box">
          {isAccepted && (
            <Button onClick={() => setMuted(!muted)} className="muted-call">
              {!muted ? <BsMicFill /> : <BsMicMuteFill />}
            </Button>
          )}
          <Button onClick={distroyMediaStream} className="reject_call">
            <MdCallEnd />
            Cancel
          </Button>
          {account.id === receiveCallUser?.targetId && isAccepted === false && (
            <Button className="accept_call" onClick={acceptCall}>
              <TbPhoneCall />
              Answer
            </Button>
          )}
          {isAccepted && (
            <Button onClick={handleTurnVideo} className="muted-call">
              {turnMyVideo ? <BsFillCameraVideoFill /> : <BsFillCameraVideoOffFill />}
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
});

export default VideoCall;
