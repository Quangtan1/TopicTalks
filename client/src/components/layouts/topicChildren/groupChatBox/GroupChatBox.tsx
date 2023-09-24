import { FC } from 'react';
import { Box } from '@mui/material';
import './GroupChatBox.scss';
import GroupBox from './GroupBox';
import { ITopicChildren } from 'src/queries';

interface Props {
  topicChild: ITopicChildren;
}
const GroupChatBox: FC<Props> = ({ topicChild }) => {
  return (
    <Box className="groupChat-container">
      <GroupBox topicChild={topicChild} />
    </Box>
  );
};

export default GroupChatBox;
