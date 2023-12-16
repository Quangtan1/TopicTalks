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
import { createAxios, postDataAPI, putDataAPI } from 'src/utils';
import ViewPost from './view/ViewPost';
import { GrView } from 'react-icons/gr';

export const APPROVE_POST = 'Do you want to approve this post?';

export const REJECT_POST = 'Do you want to reject this post?';

const ManagePost = observer(() => {
  dayjs.extend(relativeTime);
  const [isOpen, setIsOpen] = useState(false);
  const [post, setPost] = useState<IPost>(null);
  const [isRejectAction, setIsRejectAction] = useState(false);
  const [viewPost, setViewPost] = useState<IPost>(null);

  // ============================== Config mobx ==============================
  const account = accountStore?.account;
  const setAccount = (value) => {
    accountStore?.setAccount(value);
  };
  const accountJwt = account;
  const axiosJWT = createAxios(accountJwt, setAccount);

  // ============================== Query ==============================

  const {
    data: postsWaitingForApproval,
    isLoading,
    refetch: reLoadPost,
  } = useGetAllPostsByIsApproved(account, setAccount);

  // const { refetch: reLoadPostUser } = useGetAllPosts(account, setAccount);

  const useApprovePost = useMutation((postId: number) => approvedPost(postId, account));
  const useDeletePost = useMutation((postId: number) => deletePost(postId, account));

  const rowsPerPageOptions = [10, 50, { value: -1, label: 'All' }];
  const count = 100;
  const page = 0;
  const rowsPerPage = 10;

  const handleChangePage = (event, newPage) => {};

  const handleChangeRowsPerPage = (event) => {};

  const handleApprovePost = async (post: IPost) => {
    try {
      const res = await useApprovePost.mutateAsync(post.id);
      if (res?.status === 200) {
        ToastSuccess('Approve post successfully!');
        const content = `This post has approved by Admin`;
        saveNotifi(post, content);
        setIsOpen(false);
        // reLoadPostUser();
        reLoadPost();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectPost = (post: IPost) => {
    const data = {
      postId: post.id,
      reasonReject: 'Your post is not valid for the systems content',
    };
    putDataAPI(`/post/reject`, data, account?.access_token, axiosJWT)
      .then(() => {
        ToastSuccess('Reject post successfully!');
        const content = `This post has rejected by Admin`;
        saveNotifi(post, content);
        reLoadPost();
        setIsOpen(false);
      })
      .catch(() => {
        ToastError('Error Reject post!');
      });
  };

  const handleOpenModalApproveReject = (post: IPost, isReject = false) => {
    setIsOpen(!isOpen);
    setPost(post);
    setIsRejectAction(isReject);
  };

  const saveNotifi = (post: IPost, message: string) => {
    const dataRequest = {
      conversationId: null,
      userId: post.author_id,
      messageNoti: message,
      postId: post.id,
    };
    postDataAPI(`/notification/pushNoti`, dataRequest, account.access_token, axiosJWT)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTitleAdminPost = (title = '') => {
    if (title.includes('#')) {
      const titleConvert = title.split('#')[0];

      return titleConvert;
    }

    return title;
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
                      <Tooltip title={handleTitleAdminPost(item?.title)} arrow>
                        <span className="cell_content">
                          {handleTitleAdminPost(item?.title)?.length > 30
                            ? `${handleTitleAdminPost(item?.title)?.slice(0, 30)}...`
                            : handleTitleAdminPost(item?.title)}
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
                      <Button onClick={() => handleOpenModalApproveReject(item)}>Approve ✅</Button>
                      <Button onClick={() => handleOpenModalApproveReject(item, true)}>Reject ❌</Button>
                      <Button onClick={() => setViewPost(item)}>
                        <GrView />
                      </Button>
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
      {isOpen && (
        <DialogCommon
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={isRejectAction ? () => handleRejectPost(post) : () => handleApprovePost(post)}
          content={isRejectAction ? REJECT_POST : APPROVE_POST}
        />
      )}
      {viewPost && <ViewPost open={viewPost !== null} onClose={() => setViewPost(null)} post={viewPost} />}
    </Box>
  );
});

export default ManagePost;
