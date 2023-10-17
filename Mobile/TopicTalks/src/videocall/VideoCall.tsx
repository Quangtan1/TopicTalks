import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { RTCView, MediaStream, MediaStreamTrack } from 'react-native-webrtc';
import { observer } from 'mobx-react';
import accountStore from '../store/accountStore';

const VideoCall = observer(props => {
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
   const [stream, setStream] = useState(null);
   const [muted, setMuted] = useState<boolean>(false);
   const [seconds, setSeconds] = useState<number>(0);

   const myVideoCall = useRef(null);
   const userVideo = useRef(null);

   const account = accountStore?.account;

   useEffect(() => {
      let userMediaStream = null;
      const getUserMedia = async () => {
         try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(stream);
            // Set stream to RTCView in React Native
            // Check documentation for the exact syntax
            if (myVideoCall.current) {
               myVideoCall.current.srcObject = stream;
               userMediaStream = stream;
               if (isAccepted && userVideo.current) {
                  // Set stream to userVideo in React Native
                  // Check documentation for the exact syntax
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
            tracks.forEach(track => {
               track.stop();
               userMediaStream.removeTrack(track);
            });
         }
      };
   }, [callUser, receiveCallUser, isAccepted]);

   useEffect(() => {
      if (isAccepted) {
         const timer = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
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
         tracks?.forEach(track => {
            track?.stop();
            stream?.removeTrack(track);
            onLeaveCall();
         });
      }
   };

   const formatTime = time => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;

      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');

      return `${formattedMinutes}:${formattedSeconds}`;
   };

   return (
      <View>
         {/* Replace Dialog with the appropriate React Native component */}
         {/* Adjust styles accordingly */}
         <RTCView
            streamURL={stream.toURL()}
            objectFit='cover'
            mirror={true}
            style={{ width: '100%', height: '50%' }}
            ref={myVideoCall}
         />
         {/* Additional components and buttons will also need to be translated */}
         <Button onPress={() => setMuted(!muted)} title='Mute/Unmute' />
         <Button onPress={distroyMediaStream} title='Cancel' />
         {/* Adjust other components and styles accordingly */}
      </View>
   );
});

export default VideoCall;
