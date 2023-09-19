import React, { useState } from 'react';
import './ManageTopic.scss';
import {
  Box,
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { GrAdd } from 'react-icons/gr';
import CreateTopicDialog from '../admindialog/CreateTopicDialog';

interface MockData {
  name: string;
  createBy: string;
}

function createData(name: string, createBy: string): MockData {
  return {
    name,
    createBy,
  };
}

const healthData = [
  createData('Fitness Tips', 'John Doe'),
  createData('Healthy Recipes', 'Jane Smith'),
  createData('Mental Wellness', 'David Johnson'),
  createData('Yoga and Meditation', 'Emily Williams'),
  createData('Nutrition Guidelines', 'Michael Brown'),
  createData('Yoga and Meditation', 'Emily Williams'),
  createData('Yoga and Meditation', 'Emily Williams'),
  createData('Nutrition Guidelines', 'Michael Brown'),
  createData('Nutrition Guidelines', 'Michael Brown'),
  createData('Yoga and Meditation', 'Emily Williams'),
];

const ManageTopic = () => {
  const [selectTopic, setSelectTopic] = useState<string>('Healthy');
  const [open, setOpen] = useState<boolean>(false);

  const rowsPerPageOptions = [10, 50, { value: -1, label: 'All' }];
  const count = 100;
  const page = 0;
  const rowsPerPage = 10;

  const handleChangePage = (event, newPage) => {};

  const handleChangeRowsPerPage = (event) => {};

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Box className="manage_topic_container">
      <Box className="create_topic">
        <Typography className="titel_a1">List of Topics</Typography>
        <GrAdd title="Create Topic" onClick={() => setOpen(true)} />
      </Box>
      <Typography className="title_a2">Manage the topics in sytem</Typography>
      <Box className="select_topic">
        <Typography>The Primary Topic:</Typography>
        <Select value={selectTopic} onChange={(e) => setSelectTopic(e.target.value)}>
          <MenuItem value="Healthy">Healthy</MenuItem>
          <MenuItem value="Food">Food</MenuItem>
          <MenuItem value="Math">Math</MenuItem>
        </Select>
      </Box>
      <Box className="warning">
        <MdOutlineErrorOutline />
        <Typography>Please avoid duplicating similar topics</Typography>
      </Box>
      <TableContainer className="table_container_head">
        <Table>
          <TableHead className="table_head">
            <TableRow>
              <TableCell className="cell_no">No.</TableCell>
              <TableCell className="cell_tname">Topic Name</TableCell>
              <TableCell className="cell_cby">Create By</TableCell>
              <TableCell className="cell_action">Action</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <TableContainer className="table_container_body">
        <Table>
          <TableBody className="table_body">
            {healthData.map((item: MockData, index: number) => (
              <TableRow key={index}>
                <TableCell className="cell_no">{index + 1}</TableCell>
                <TableCell className="cell_tname">{item.name}</TableCell>
                <TableCell className="cell_cby">{item.createBy}</TableCell>
                <TableCell className="cell_action">
                  <Button>Update</Button>
                  <Button>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className="table_pagination"
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <CreateTopicDialog open={open} onClose={onClose} />
    </Box>
  );
};

export default ManageTopic;
