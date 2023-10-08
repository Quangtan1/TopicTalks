import './ManagePost.scss';
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
import { observer } from 'mobx-react';
import { useState } from 'react';
import { MdOutlineErrorOutline } from 'react-icons/md';
import DialogCommon from 'src/components/dialogs/DialogCommon';
import Loading from 'src/components/loading/Loading';
import { IPost, approvedPost, deletePost, useGetAllPosts, useGetAllPostsByIsApproved } from 'src/queries';
import accountStore from 'src/store/accountStore';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMutation } from 'react-query';
import { ToastError, ToastSuccess } from 'src/utils/toastOptions';

// const mockData = [
//   { id: 1, name: 'John Doe', age: 30, email: 'john.doe@example.com' },
//   { id: 2, name: 'Jane Smith', age: 25, email: 'jane.smith@example.com' },
//   { id: 3, name: 'David Johnson', age: 35, email: 'david.johnson@example.com' },
//   { id: 4, name: 'Emily Williams', age: 28, email: 'emily.williams@example.com' },
//   { id: 5, name: 'Michael Brown', age: 40, email: 'michael.brown@example.com' },
//   { id: 6, name: 'Emily Williams', age: 28, email: 'emily.williams@example.com' },
//   { id: 7, name: 'Emily Williams', age: 28, email: 'emily.williams@example.com' },
//   { id: 8, name: 'Michael Brown', age: 40, email: 'michael.brown@example.com' },
//   { id: 9, name: 'Michael Brown', age: 40, email: 'michael.brown@example.com' },
//   { id: 10, name: 'Emily Williams', age: 28, email: 'emily.williams@example.com' },
// ];

export const APPROVE_POST = 'Do you want to APPROVE this post?';

export const REJECT_POST = 'Do you want to REJECT AND DELETE FOREVER this post?';

const ManagePost = observer(() => {
  dayjs.extend(relativeTime);
  const [isOpen, setIsOpen] = useState(false);
  const [postId, setPostId] = useState(null);
  const [isRejectAction, setIsRejectAction] = useState(false);

  // ============================== Config mobx ==============================
  const account = accountStore?.account;
  const setAccount = () => {
    return accountStore?.setAccount;
  };
  // ============================== Query ==============================

  const {
    data: postsWaitingForApproval,
    isLoading,
    refetch: reLoadPost,
  } = useGetAllPostsByIsApproved(account, setAccount);

  const { refetch: reLoadPostUser } = useGetAllPosts(account, setAccount);

  const useApprovePost = useMutation((postId: number) => approvedPost(postId, account));
  const useDeletePost = useMutation((postId: number) => deletePost(postId, account));

  const rowsPerPageOptions = [10, 50, { value: -1, label: 'All' }];
  const count = 100;
  const page = 0;
  const rowsPerPage = 10;

  const handleChangePage = (event, newPage) => {};

  const handleChangeRowsPerPage = (event) => {};

  const handleApprovePost = async (postId: number) => {
    try {
      const res = await useApprovePost.mutateAsync(postId);
      console.log(res);
      if (res?.status === 200) {
        ToastSuccess('Approve post successfully!');
        setIsOpen(false);
        reLoadPostUser();
        reLoadPost();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectPost = async (postId: number) => {
    try {
      const result = await useDeletePost.mutateAsync(postId);
      if (result.status === 200) {
        ToastSuccess('Reject post successfully!');
        reLoadPost();
        setIsOpen(false);
      }
    } catch (error) {
      ToastError('Error Reject post!');
    }
  };

  const handleOpenModalApproveReject = (id: number, isReject = false) => {
    setIsOpen(!isOpen);
    setPostId(id);
    setIsRejectAction(isReject);
  };

  return isLoading ? (
    <Loading />
  ) : (
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
              <TableCell className="cell_content">Post Title</TableCell>
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
            {postsWaitingForApproval?.length !== 0 &&
              postsWaitingForApproval?.map((item: IPost, index: number) => {
                const timeAgo = dayjs(item?.created_at).fromNow();
                return (
                  <TableRow key={item?.id}>
                    <TableCell className="cell_no">{index + 1}</TableCell>
                    <TableCell className="cell_id">{item?.id}</TableCell>
                    <TableCell className="cell_content">
                      <Tooltip title={item?.title} arrow>
                        <span className="cell_content">
                          {item?.title?.length > 15 ? `${item?.title?.slice(0, 15)}...` : item?.title}
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
                    <TableCell className="cell_img">{<img src={item?.img_url} alt="img" className="img" />}</TableCell>
                    <TableCell className="cell_action">
                      <Button onClick={() => handleOpenModalApproveReject(item?.id)}>Approve ✅</Button>
                      <Button onClick={() => handleOpenModalApproveReject(item?.id, true)}>Reject ❌</Button>
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
      <DialogCommon
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={isRejectAction ? () => handleRejectPost(postId) : () => handleApprovePost(postId)}
        content={isRejectAction ? REJECT_POST : APPROVE_POST}
      />
    </Box>
  );
});

export default ManagePost;
