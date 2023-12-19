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
import { createAxios, getDataAPI, putDataAPI } from 'src/utils';
import accountStore from 'src/store/accountStore';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import { ToastSuccess } from 'src/utils/toastOptions';
import UpdateTopicDialog from './UpdateTopicDialog';
import { BiEdit } from 'react-icons/bi';
import UpdateTopicParent from './UpdateTopicParent';

const ManageTopic = () => {
  const [selectTopic, setSelectTopic] = useState<number>(null);
  const [listTopic, setListTopic] = useState<ListTopic[]>([]);
  const [topicChild, setTopicChild] = useState<TopicChild[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [topicSelected, setTopicSelected] = useState<TopicChild>(null);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openUpdateParent, setOpenUpdateParent] = useState<boolean>(false);
  const [topicParent, setTopicParent] = useState<ListTopic>(null);

  const account = accountStore?.account;

  const setAccount = (value) => {
    accountStore?.setAccount(value);
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
        if (res.data.data !== 'Not exist any children topic.') {
          setListTopic(res.data.data);
          setSelectTopic(res.data.data[0]?.id);
          setTopicParent(res.data.data[0]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (selectTopic) {
      getDataAPI(`/topic-children/topic-parent=${selectTopic}`, account.access_token, axiosJWT)
        .then((res) => {
          setTopicChild(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectTopic]);

  const CONTENT = `Do you want to ${topicSelected?.expired ? 'undisable' : 'disale'} ${
    topicSelected?.topicChildrenName
  } topic`;

  const handleConfirm = () => {
    putDataAPI(
      `/topic-children/update-expired?id=${topicSelected?.id}&&is_expired=${topicSelected?.expired ? false : true}`,
      null,
      account.access_token,
      axiosJWT,
    )
      .then((res) => {
        ToastSuccess('Successfully');
        setTopicChild((prev) =>
          prev.map((item) => (item.id === topicSelected?.id ? { ...item, expired: !topicSelected?.expired } : item)),
        );
        setOpenConfirm(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDisable = (item: TopicChild) => {
    setTopicSelected(item);
    setOpenConfirm(true);
  };
  const handleUpdate = (item: TopicChild) => {
    setTopicSelected(item);
    setOpenUpdate(true);
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

        <Select value={selectTopic} onChange={(e: any) => setSelectTopic(e.target.value)}>
          {listTopic?.length > 0 &&
            listTopic?.map((item) => (
              <MenuItem value={item.id} key={item.id} onClick={() => setTopicParent(item)}>
                {item.topicParentName}
              </MenuItem>
            ))}
        </Select>
        <BiEdit onClick={() => setOpenUpdateParent(true)} />
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
                    <Button onClick={() => handleUpdate(item)}>Update</Button>
                    {item.expired ? (
                      <Button onClick={() => handleDisable(item)}>Undisable</Button>
                    ) : (
                      <Button onClick={() => handleDisable(item)}>Disable</Button>
                    )}
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
      {open === true && (
        <CreateTopicDialog open={open} onClose={onClose} listTopic={listTopic} setListTopic={setListTopic} />
      )}
      {openConfirm && (
        <DialogCommon
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onConfirm={handleConfirm}
          content={CONTENT}
        />
      )}
      {openUpdate && (
        <UpdateTopicDialog
          open={openUpdate}
          onClose={() => setOpenUpdate(false)}
          topic={topicSelected}
          setTopicChild={setTopicChild}
          topicParentId={selectTopic}
        />
      )}
      {openUpdateParent && (
        <UpdateTopicParent
          open={openUpdateParent}
          setTopicParent={setTopicParent}
          onClose={() => setOpenUpdateParent(false)}
          topic={topicParent}
        />
      )}
    </Box>
  );
};

export default ManageTopic;
