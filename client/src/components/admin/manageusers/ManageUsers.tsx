import './ManageUser.scss';
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
  Typography,
} from '@mui/material';
import React, { useEffect, memo, useState } from 'react';
import { MdOutlineErrorOutline } from 'react-icons/md';
import accountStore from 'src/store/accountStore';
import uiStore from 'src/store/uiStore';
import { createAxios, getDataAPI } from 'src/utils';

const ManageUser = () => {
  const [users, setUsers] = useState([]);
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
    getDataAPI(`/user`, account.access_token, axiosJWT)
      .then((res) => {
        setUsers(res.data.data);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChangePage = (event, newPage) => {};

  const handleChangeRowsPerPage = (event) => {};

  return (
    <Box className="manage_user_container">
      <Box className="user_title">
        <Typography className="titel_a1">List of Users</Typography>
      </Box>
      <Typography className="title_a2">Manage users in sytem</Typography>
      <Box className="warning">
        <MdOutlineErrorOutline />
        <Typography>Please monitor whether users are violating community content</Typography>
      </Box>
      <TableContainer className="table_container_head">
        <Table>
          <TableHead className="table_head">
            <TableRow>
              <TableCell className="cell_no">No.</TableCell>
              <TableCell className="cell_name">Name</TableCell>
              <TableCell className="cell_age">Age</TableCell>
              <TableCell className="cell_email">Email</TableCell>
              <TableCell className="cell_action">Action</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <TableContainer className="table_container_body">
        <Table>
          <TableBody className="table_body">
            {users.length > 0 &&
              users.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="cell_no">{item.id}</TableCell>
                  <TableCell className="cell_name">{item.username}</TableCell>
                  <TableCell className="cell_age">{item.role}</TableCell>
                  <TableCell className="cell_email">{item.email}</TableCell>
                  <TableCell className="cell_action">
                    <Button>Ban</Button>
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
    </Box>
  );
};

export default memo(ManageUser);
