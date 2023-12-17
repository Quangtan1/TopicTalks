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
import { useEffect, memo, useState } from 'react';
import { MdOutlineErrorOutline } from 'react-icons/md';
import accountStore from 'src/store/accountStore';
import uiStore from 'src/store/uiStore';
import { createAxios, getDataAPI } from 'src/utils';
import relativeTime from 'dayjs/plugin/relativeTime';
import { observer } from 'mobx-react';
import AnswerQAModal from './answerModal';
import _ from 'lodash';
import AdminAnswer from './adminAnswer';

const USER_IMAGE = 'https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg';

const ManageUserQA = observer(() => {
  dayjs.extend(relativeTime);
  const [usersQA, setUsersQA] = useState([]);
  const [isOpenAnswerModal, setIsOpenAnswerModal] = useState(false);
  const [isOpenAnswer, setIsOpenAnswer] = useState(false);
  const [userQA, setUserQA] = useState({});
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
    getDataAPI(`/qa/all`, account.access_token, axiosJWT)
      .then((res) => {
        setUsersQA(res.data.data);
        uiStore?.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangePage = (event, newPage) => {};

  const handleChangeRowsPerPage = (event) => {};

  const handleOpenAnswerModal = (item) => {
    setIsOpenAnswerModal((prev) => !prev);
    setUserQA(item);
  };

  const handleOpenAnswer2 = (item) => {
    setIsOpenAnswer(true);
    setUserQA(item);
  };

  const userLis1 =
    typeof usersQA === 'string' ? [] : _.isEmpty(usersQA) ? [] : usersQA?.filter((user) => user?.answered === false);

  const userList = typeof usersQA === 'string' ? [] : _.isEmpty(usersQA) ? [] : usersQA;

  return (
    <>
      <Box className="manage_post_container">
        <Box className="post_title">
          <Typography className="title_a1">List of QA from Admin</Typography>
        </Box>
        <Typography className="title_a2">Manage user's QA in system</Typography>
        <Box className="warning">
          <MdOutlineErrorOutline />
          <Typography>Please answer user questions about the system!</Typography>
        </Box>
        <TableContainer className="table_container_head">
          <Table>
            <TableHead className="table_head">
              <TableRow>
                <TableCell className="cell_no">Question Id</TableCell>
                <TableCell className="cell_content">Subject</TableCell>
                <TableCell className="cell_content">Content</TableCell>
                <TableCell className="cell_createdAt">Created Time</TableCell>
                <TableCell className="cell_img">Image</TableCell>
                <TableCell className="cell_status">Status</TableCell>
                <TableCell className="cell_action">Action</TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
        <TableContainer className="table_container_body">
          <Table>
            <TableBody className="table_body">
              {!_.isEmpty(userList) &&
                userList.map((item, index: number) => {
                  const timeAgo = dayjs(item?.created_at).fromNow();
                  return (
                    <TableRow key={item?.id}>
                      <TableCell className="cell_id">{item?.id}</TableCell>
                      <TableCell className="cell_content">
                        <Tooltip title={item?.title} arrow>
                          <span className="cell_content">
                            {item?.subject?.length > 15 ? `${item?.subject?.slice(0, 15)}...` : item?.subject}
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
                        {
                          <img
                            loading="lazy"
                            src={item?.senderInfor?.avatarUrl || USER_IMAGE}
                            alt="img"
                            className="img"
                          />
                        }
                      </TableCell>
                      <TableCell className="cell_status">{item?.answered ? 'Answered' : 'Not Answered'}</TableCell>
                      <TableCell className="cell_action">
                        <Button onClick={() => handleOpenAnswerModal(item)}>
                          {item?.answered ? 'Edit ✅' : 'Reply❓'}
                        </Button>
                        {item?.answered && <Button onClick={() => handleOpenAnswer2(item)}>View your answer 👁️</Button>}
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
        <AnswerQAModal isOpen={isOpenAnswerModal} questionData={userQA} setIsOpenAnswerModal={setIsOpenAnswerModal} />
        <AdminAnswer isOpen={isOpenAnswer} questionData={userQA} setIsOpenAnswer={setIsOpenAnswer} />
      </Box>
    </>
  );
});

export default memo(ManageUserQA);
