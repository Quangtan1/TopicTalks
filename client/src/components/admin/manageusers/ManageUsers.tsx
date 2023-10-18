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
import { useState } from 'react';
import { MdOutlineErrorOutline } from 'react-icons/md';
import BanModal from './banModal';

const mockData = [
  { id: 1, name: 'John Doe', age: 30, email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', age: 25, email: 'jane.smith@example.com' },
  { id: 3, name: 'David Johnson', age: 35, email: 'david.johnson@example.com' },
  { id: 4, name: 'Emily Williams', age: 28, email: 'emily.williams@example.com' },
  { id: 5, name: 'Michael Brown', age: 40, email: 'michael.brown@example.com' },
  { id: 6, name: 'Emily Williams', age: 28, email: 'emily.williams@example.com' },
  { id: 7, name: 'Emily Williams', age: 28, email: 'emily.williams@example.com' },
  { id: 8, name: 'Michael Brown', age: 40, email: 'michael.brown@example.com' },
  { id: 9, name: 'Michael Brown', age: 40, email: 'michael.brown@example.com' },
  { id: 10, name: 'Emily Williams', age: 28, email: 'emily.williams@example.com' },
];

const ManageUser = () => {
  const [isOpenBanModal, setIsOpenBanModal] = useState<boolean>(false);
  // const [banTime, setBanTime] = useState<number | string>(null);

  const rowsPerPageOptions = [10, 50, { value: -1, label: 'All' }];
  const count = 100;
  const page = 0;
  const rowsPerPage = 10;

  const handleChangePage = (event, newPage) => {};

  const handleChangeRowsPerPage = (event) => {};

  const onClose = () => {
    setIsOpenBanModal((prev) => !prev);
  };

  const onConfirm = async () => {};

  const selectBanTimeModal = () => {
    return <></>;
  };

  const handleBanUser = () => {
    const BAN_CONTENT = 'Do you want to BAN this user?';
    return (
      <BanModal
        otherComponents={selectBanTimeModal()}
        open={isOpenBanModal}
        onClose={onClose}
        onConfirm={onConfirm}
        content={BAN_CONTENT}
      />
    );
  };

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
            {mockData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="cell_no">{item.id}</TableCell>
                <TableCell className="cell_name">{item.name}</TableCell>
                <TableCell className="cell_age">{item.age}</TableCell>
                <TableCell className="cell_email">{item.email}</TableCell>
                <TableCell className="cell_action">
                  <Button onClick={handleBanUser}>Ban</Button>
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

export default ManageUser;
