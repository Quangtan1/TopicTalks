import React, { useRef, useState, useEffect } from 'react';
import './VideoCall.scss';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { ICallData } from 'src/types/chat.type';
import { observer } from 'mobx-react';
import accountStore from 'src/store/accountStore';
import { TbPhoneCall } from 'react-icons/tb';
import { MdCallEnd } from 'react-icons/md';

interface DialogProps {
  open: boolean;
  callUser?: ICallData;
  receiveCallUser?: ICallData;
  onLeaveCall: () => void;
  acceptCall: () => void;
  isAccepted: boolean;
  saveCall: () => void;
}

const VideoCall = observer((props: DialogProps) => {
  const { open, callUser, receiveCallUser, onLeaveCall, acceptCall, isAccepted, saveCall } = props;
  const [stream, setStream] = useState<MediaStream>(null);

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
          console.log('disstroy2');
          userMediaStream.removeTrack(track);
        });
      }
    };
  }, [callUser, receiveCallUser, isAccepted]);

  const distroyMediaStream = () => {
    if (isAccepted) {
      saveCall();
      console.log('save');
    }
    if (stream) {
      const tracks = stream?.getTracks();
      tracks?.forEach((track) => {
        track?.stop();
        stream?.removeTrack(track);
        onLeaveCall();
      });
    }
  };

  return (
    <Dialog open={open} className="video_call_container">
      <DialogTitle className="dialog-title"></DialogTitle>
      <DialogContent className="dialog-content">
        <Box className="video_box">
          {stream && <video playsInline muted ref={myVideo} autoPlay className="video" />}

          {isAccepted ? <video playsInline ref={userVideo} autoPlay className="video" /> : null}
        </Box>
        {account.id === callUser?.userId && isAccepted === false && (
          <Typography className="in_call">You are calling to {callUser?.targetName}...</Typography>
        )}
        {account.id === receiveCallUser?.targetId && isAccepted === false && (
          <Typography className="in_call">You have a call from {receiveCallUser?.username}...</Typography>
        )}
        {account.id === receiveCallUser?.targetId && isAccepted && (
          <Typography className="in_call">In Calling...</Typography>
        )}
        <Box className="action_box">
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
        </Box>
      </DialogContent>
    </Dialog>
  );
});

export default VideoCall;
