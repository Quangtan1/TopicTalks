import React, { useEffect, useState } from 'react';
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
import { ListTopic, TopicChild } from 'src/types/topic.type';
import { createAxios, getDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';

const ManageTopic = () => {
  const [selectTopic, setSelectTopic] = useState<number | ''>(1);
  const [listTopic, setListTopic] = useState<ListTopic[]>([]);
  const [topicChild, setTopicChild] = useState<TopicChild[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const account = accountStore?.account;

  const setAccount = () => {
    return accountStore?.setAccount;
  };

  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  const rowsPerPageOptions = [10, 50, { value: -1, label: 'All' }];
  const count = 100;
  const page = 0;
  const rowsPerPage = 10;

  const handleChangePage = (event, newPage) => {};

  const handleChangeRowsPerPage = (event) => {};

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getDataAPI(`/topic-parent/all`, account.access_token, axiosJWT)
      .then((res) => {
        setListTopic(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getDataAPI(`/topic-children/topic-parent=${selectTopic}`, account.access_token, axiosJWT)
      .then((res) => {
        setTopicChild(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectTopic]);

  return (
    <Box className="manage_topic_container">
      <Box className="create_topic">
        <Typography className="titel_a1">List of Topics</Typography>
        <GrAdd title="Create Topic" onClick={() => setOpen(true)} />
      </Box>
      <Typography className="title_a2">Manage the topics in sytem</Typography>
      <Box className="select_topic">
        <Typography>The Primary Topic:</Typography>
        <Select value={selectTopic} onChange={(e: any) => setSelectTopic(e.target.value)}>
          {listTopic.length > 0 &&
            listTopic.map((item) => (
              <MenuItem value={item.id} key={item.id}>
                {item.topicParentName}
              </MenuItem>
            ))}
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
            {topicChild.length > 0 &&
              topicChild?.map((item: TopicChild, index: number) => (
                <TableRow key={index}>
                  <TableCell className="cell_no">{index + 1}</TableCell>
                  <TableCell className="cell_tname">{item.topicChildrenName}</TableCell>
                  <TableCell className="cell_cby">Admin</TableCell>
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
      {open === true && <CreateTopicDialog open={open} onClose={onClose} />}
    </Box>
  );
};

export default ManageTopic;
