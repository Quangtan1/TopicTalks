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
import { GrView } from 'react-icons/gr';
import { MdOutlineErrorOutline } from 'react-icons/md';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import accountStore from 'src/store/accountStore';
import uiStore from 'src/store/uiStore';
import { IUserProfile } from 'src/types/account.types';
import { createAxios, getDataAPI, putDataAPI } from 'src/utils';
import { ToastSuccess } from 'src/utils/toastOptions';
import DialogBanUser from './DialogBanUser';
import ViewDeitalUser from './ViewDeitailUser';

const CONTENT = 'Do you want to Ban user?';

const ManageUser = () => {
  const [users, setUsers] = useState<IUserProfile[]>([]);
  const [openView, setOpenView] = useState<boolean>(false);
  const [openBan, setOpenBan] = useState<boolean>(false);
  const [userBan, setUserBan] = useState<IUserProfile>(null);
  const [isBan, setIsBan] = useState<boolean>(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenModalBan = (user: IUserProfile, isBan: boolean) => {
    setUserBan(user);
    setOpenBan(true);
    setIsBan(isBan);
  };

  const handleOpenView = (user: IUserProfile) => {
    setUserBan(user);
    setOpenView(true);
  };

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
                    {item.isBanned ? (
                      <Button onClick={() => handleOpenModalBan(item, false)} className="un_ban">
                        UnBan
                      </Button>
                    ) : (
                      <Button
                        className="ban"
                        disabled={item.role.includes('ADMIN')}
                        onClick={() => handleOpenModalBan(item, true)}
                      >
                        Ban
                      </Button>
                    )}

                    <Button onClick={() => handleOpenView(item)}>
                      <GrView />
                      View
                    </Button>
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
      <ViewDeitalUser open={openView} onClose={() => setOpenView(false)} user={userBan} />
      {openBan && (
        <DialogBanUser
          isBan={isBan}
          listUser={users}
          setUsers={setUsers}
          open={openBan}
          onClose={() => setOpenBan(false)}
          user={userBan}
        />
      )}
    </Box>
  );
};

export default memo(ManageUser);
