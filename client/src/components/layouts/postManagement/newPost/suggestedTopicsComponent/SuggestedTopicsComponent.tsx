// SuggestedTopicsComponent.tsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { AiFillTag } from 'react-icons/ai';

interface SuggestedTopicsProps {
  suggestedTopic: string[];
}

const SuggestedTopicsComponent: React.FC<SuggestedTopicsProps> = ({ suggestedTopic }) => {
  // useEffect(() => {
  //   try {
  //     const handleCallApi = async () => {
  //       //TODO: call api to get suggested topic
  //       setSuggestedTopic(fakeDataTopic);
  //       getRecommendedTopic('I am feeling happy')
  //         .then((res) => {
  //           console.log(res);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     };
  //     handleCallApi();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

  return (
    <Box className="suggested-topics">
      <Typography variant="subtitle2">
        <AiFillTag />
        Hash tag suggestions by AI:
      </Typography>
      <Box display="flex" flexWrap="wrap" sx={{ border: '3px solid rgb(135, 44, 228)' }}>
        {suggestedTopic?.map((topic: string, index: number) => (
          <Button key={index} variant="outlined" size="small" className="suggested-topic">
            {topic}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default SuggestedTopicsComponent;
