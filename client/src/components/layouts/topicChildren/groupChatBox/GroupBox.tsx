import React, { FC } from 'react';
import { Box, List, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { ITopicChildren } from 'src/queries';
import { BsDoorClosed } from 'react-icons/bs';

const listGroup = [
  {
    groupChatName: 'Group 1',
    groupChatImg: 'https://res.cloudinary.com/tantqdev/image/upload/v1685694100/SocialMedia/v16i5f2dogqp5iywvvfg.jpg',
    groupUserNumber: 2,
    groupChatId: 1,
  },
  {
    groupChatName: 'Group 2',
    groupChatImg: 'https://res.cloudinary.com/tantqdev/image/upload/v1685694100/SocialMedia/v16i5f2dogqp5iywvvfg.jpg',
    groupChatId: 2,
    groupUserNumber: 8,
  },
  {
    groupChatName: 'Group 3',
    groupChatImg: 'https://res.cloudinary.com/tantqdev/image/upload/v1685694100/SocialMedia/v16i5f2dogqp5iywvvfg.jpg',
    groupChatId: 3,
    groupUserNumber: 4,
  },
];

interface Props {
  topicChild: ITopicChildren;
}
const GroupBox: FC<Props> = ({ topicChild }) => {
  return (
    <Box className="group-box-container">
      <Typography className="group-box-title">Group chat for topic {topicChild?.topicChildrenName}</Typography>
      <List>
        <TableContainer className="table-container">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Group Name</TableCell>
                <TableCell>People</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listGroup.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item?.groupChatName}</TableCell>
                  <TableCell>{item?.groupUserNumber}</TableCell>
                  <TableCell className="table-cell-action">
                    <BsDoorClosed />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </List>
    </Box>
  );
};

export default GroupBox;
