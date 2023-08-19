import { Box, TableContainer, TableHead, TableBody, TableCell, TableRow, Table, Typography } from '@mui/material';
import React from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsFire } from 'react-icons/bs';
import { GrView } from 'react-icons/gr';

const rows = [
  {
    friends: 'Akaido,Soki',
    topic: 'Information Technology',
  },
  {
    friends: 'Soku,Xuka',
    topic: 'Information Technology',
  },
  {
    friends: 'Nobiuta,Chaien',
    topic: 'Gaminngg',
  },
  {
    friends: 'Xekio,Nutabi',
    topic: 'Gym and Healthy',
  },
];

const TopicBox = () => {
  return (
    <Box className="hot-topic-container">
      <Box className="hot-topic-title">
        <Typography>Hot Topic</Typography>
        <BsFire />
      </Box>
      <TableContainer className="table-container">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Interested</TableCell>
              <TableCell>Topic content</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.friends}</TableCell>
                <TableCell>{item.topic}</TableCell>
                <TableCell className="table-cell-action">
                  <AiOutlineHeart />
                  <GrView />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TopicBox;
