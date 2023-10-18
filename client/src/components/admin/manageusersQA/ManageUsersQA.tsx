import './ManageUserQA.scss';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, memo, useState } from 'react';
import { GrView } from 'react-icons/gr';
import { MdOutlineErrorOutline } from 'react-icons/md';
import accountStore from 'src/store/accountStore';
import uiStore from 'src/store/uiStore';
import { createAxios, getDataAPI } from 'src/utils';
import { ToastSuccess } from 'src/utils/toastOptions';
, postDataAPI
const ManageUserQA = () => {
  const [usersQA, setUsersQA] = useState([]);
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

  useEffect(() => {
    uiStore?.setLoading(true);
    getDataAPI(`/qa/all`, account.access_token, axiosJWT)
      .then((res) => {
        setUsersQA(res.data.data);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

    const handleAnswer = (id) => {
      const qaAnswerData = {
         qaId:id,
         adminReplyId:account?.id,
       content:''
      };
      postDataAPI('/qa/create', qaAnswerData, account.access_token, axiosJWT)
        .then((res) => {
          ToastSuccess('Send Question Successfully!!!');
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  const handleChangePage = (event, newPage) => {};

  const handleChangeRowsPerPage = (event) => {};

  return (
    <Box className="manage_post_container">
      <Box className="post_title">
        <Typography className="title_a1">List of posts waiting to be approve</Typography>
      </Box>
      <Typography className="title_a2">Manage user's post in system</Typography>
      <Box className="warning">
        <MdOutlineErrorOutline />
        <Typography>Please monitor whether user's post are violating community content</Typography>
      </Box>
      <TableContainer className="table_container_head">
        <Table>
          <TableHead className="table_head">
            <TableRow>
              <TableCell className="cell_no">No.</TableCell>
              <TableCell className="cell_no">Post Id</TableCell>
              <TableCell className="cell_content">Subject</TableCell>
              <TableCell className="cell_content">Content</TableCell>
              <TableCell className="cell_createdAt">Created Time</TableCell>
              <TableCell className="cell_img">Image</TableCell>
              <TableCell className="cell_action">Action</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <TableContainer className="table_container_body">
        <Table>
          <TableBody className="table_body">
            {usersQA?.length !== 0 &&
              usersQA?.map((item, index: number) => {
                const timeAgo = dayjs(item?.created_at).fromNow();
                return (
                  <TableRow key={item?.id}>
                    <TableCell className="cell_no">{index + 1}</TableCell>
                    <TableCell className="cell_id">{item?.id}</TableCell>
                    <TableCell className="cell_content">
                      <Tooltip title={item?.title} arrow>
                        <span className="cell_content">
                          {item?.subject?.length > 15 ? `${item?.subject?.slice(0, 15)}...` : item?.title}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="cell_content">
                      <Tooltip title={item?.content} arrow>
                        <span className="cell_content">
                          {item?.content?.length > 30 ? `${item?.content?.slice(0, 30)}...` : item?.content}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="cell_createdAt">{timeAgo}</TableCell>
                    <TableCell className="cell_img">
                      {<img src={item?.senderInfor?.avatarUrl} alt="img" className="img" />}
                    </TableCell>
                    <TableCell className="cell_action">
                      <Button onClick={() => handleAnswer(item?.id)}>Answer ❓❓❓</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
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
    </Box>
  );
};

export default memo(ManageUserQA);
