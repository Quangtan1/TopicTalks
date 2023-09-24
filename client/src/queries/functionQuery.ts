import { useQuery } from 'react-query';
import { IUser } from 'src/types/account.types';
import { createAxios } from 'src/utils';
import { ToastError } from 'src/utils/toastOptions';

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

export const useGetAllTopicChildren = (account: IUser, setAccount: (account: IUser | null) => void, id: number) => {
  return useQuery('topicChildren', () => fetchTopic(account, setAccount, true, id));
};

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
