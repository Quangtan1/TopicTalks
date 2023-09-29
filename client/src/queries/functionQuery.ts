import { useQuery } from 'react-query';
import { IUser } from 'src/types/account.types';
import { createAxios } from 'src/utils';
import { ToastError } from 'src/utils/toastOptions';
import { IPost } from './types';

// ============================== Topic Parent ==============================
const fetchTopic = async (
  account: IUser,
  setAccount: (account: IUser | null) => void,
  isChildren = false,
  id?: number,
) => {
  const axiosJWT = createAxios(account, setAccount);
  const bearerToken = account?.access_token;

  try {
    const response = await axiosJWT.get(
      `http://localhost:5000/api/v1/topic-${isChildren ? 'children' : 'parent'}/all${
        isChildren ? `topic-parent=${id}` : ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      },
    );

    return response?.data;
  } catch (error) {
    ToastError(`Error fetching data: ${error}`);
  }
};

export const useGetAllTopicParents = (account: IUser, setAccount: (account: IUser | null) => void) => {
  return useQuery('topicParents', () => fetchTopic(account, setAccount));
};

// ============================== Topic Children ==============================
export const fetchTopicChildren = async (topicParentId: number, axiosJWT, account: IUser) => {
  try {
    const response = await axiosJWT.get(`http://localhost:5000/api/v1/topic-children/topic-parent=${topicParentId}`, {
      headers: {
        Authorization: `Bearer ${account?.access_token}`,
      },
    });
    return response?.data?.data;
  } catch (error) {
    ToastError('Get Topic Children Failed');
    return [];
  }
};

export const useGetAllTopicChildren = (account: IUser, setAccount: (account: IUser | null) => void, id: number) => {
  return useQuery('topicChildren', () => fetchTopic(account, setAccount, true, id));
};

// ============================== Post ==============================
export const createPost = async (postData, account) => {
  const bearerToken = account?.access_token;

  const response = await fetch('http://localhost:5000/api/v1/post/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  return response.json();
};

export const editPost = async (postData, account: IUser) => {
  const bearerToken = account?.access_token;

  const response = await fetch(`http://localhost:5000/api/v1/post/update/${postData?.postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  return response.json();
};

const fetchAllPost = async (account: IUser, setAccount: (account: IUser | null) => void, id?: number) => {
  const axiosJWT = createAxios(account, setAccount);
  const bearerToken = account?.access_token;

  try {
    const response = await axiosJWT.get(`http://localhost:5000/api/v1/post/all`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    return response?.data;
  } catch (error) {
    ToastError(`Error fetching data: ${error}`);
  }
};

export const useGetAllPosts = (account: IUser, setAccount: (account: IUser | null) => void) => {
  return useQuery('post', () => fetchAllPost(account, setAccount));
};

export const deletePost = async (id: number, account: IUser) => {
  const bearerToken = account?.access_token;

  const response = await fetch(`http://localhost:5000/api/v1/post/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete post');
  }

  return response.json();
};
