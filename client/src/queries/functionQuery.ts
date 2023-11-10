import { useQuery } from 'react-query';
import { IUser } from 'src/types/account.types';
import { createAxios } from 'src/utils';
import { ICommentBody } from './types';

export const TOPIC_TALKS_DOMAIN = 'http://localhost:5000/api/v1';

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
      `${TOPIC_TALKS_DOMAIN}/topic-${isChildren ? 'children' : 'parent'}/all-tparent?isDisable=false${
        isChildren ? `topic-parent=${id}` : ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      },
    );

    return response?.data ?? [];
  } catch (error) {
    console.log('🚀 ~error:', error);
  }
};

export const useGetAllTopicParents = (account: IUser, setAccount: (account: IUser | null) => void) => {
  return useQuery('topicParents', () => fetchTopic(account, setAccount));
};

// ============================== Topic Children ==============================
export const fetchTopicChildren = async (topicParentId: number, axiosJWT, account: IUser) => {
  try {
    const response = await axiosJWT.get(`${TOPIC_TALKS_DOMAIN}/topic-children/topic-parent=${topicParentId}`, {
      headers: {
        Authorization: `Bearer ${account?.access_token}`,
      },
    });
    return response?.data?.data ?? [];
  } catch (error) {
    console.log('🚀 ~error:', error);
    return [];
  }
};

export const useGetAllTopicChildren = (account: IUser, setAccount: (account: IUser | null) => void, id: number) => {
  return useQuery('topicChildren', () => fetchTopic(account, setAccount, true, id));
};

// ============================== Create Post ==============================
export const createPost = async (postData, account) => {
  const bearerToken = account?.access_token;

  const response = await fetch(`${TOPIC_TALKS_DOMAIN}/post/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    console.log('🚀 ~error:', response);
    throw new Error('Failed to create post');
  }

  return response.json();
};

// ============================== Edit Post ==============================
export const editPost = async (postData, account: IUser) => {
  const bearerToken = account?.access_token;

  const response = await fetch(`${TOPIC_TALKS_DOMAIN}/post/update/${postData?.postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    console.log('🚀 ~error:', response);
    throw new Error('Failed to edit post');
  }

  return response.json();
};

// ================================= Get All Post ==============================
const fetchAllPost = async (account: IUser, setAccount: (account: IUser | null) => void, id?: number) => {
  const axiosJWT = createAxios(account, setAccount);
  const bearerToken = account?.access_token;

  try {
    const response = await axiosJWT.get(`${TOPIC_TALKS_DOMAIN}/post/all-posts/is-approved=true`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    return response?.data?.data ?? [];
  } catch (error) {
    console.log('🚀 ~error:', error);
  }
};

export const useGetAllPosts = (account: IUser, setAccount: (account: IUser | null) => void) => {
  return useQuery('post', () => fetchAllPost(account, setAccount));
};

// ================================= Get All Post By is approved ==============================
const fetchAllPostByIsApproved = async (
  account: IUser,
  setAccount: (account: IUser | null) => void,
  isApproved = false,
) => {
  const axiosJWT = createAxios(account, setAccount);
  const bearerToken = account?.access_token;

  try {
    const response = await axiosJWT.get(`${TOPIC_TALKS_DOMAIN}/post/all-posts/is-approved=false`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    return response?.data?.data ?? [];
  } catch (error) {
    console.log('🚀 ~error:', error);
  }
};

export const useGetAllPostsByIsApproved = (
  account: IUser,
  setAccount: (account: IUser | null) => void,
  isApproved = false,
) => {
  return useQuery('post-by-is-approved', () => fetchAllPostByIsApproved(account, setAccount, isApproved));
};
// ================================= Delete post ==============================
export const deletePost = async (id: number, account: IUser) => {
  const bearerToken = account?.access_token;

  const response = await fetch(`${TOPIC_TALKS_DOMAIN}/post/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  if (!response.ok) {
    console.log('🚀 ~error:', response);
    throw new Error('Failed to delete post');
  }

  return response.json();
};

// ============================== Get post by Author Id ==============================
export const getAllPostsByAuthorId = async (authorId: number, axiosJWT: any, account: IUser) => {
  try {
    const response = await axiosJWT.get(`${TOPIC_TALKS_DOMAIN}/post/all-posts/aid=${authorId}`, {
      headers: {
        Authorization: `Bearer ${account?.access_token}`,
      },
    });
    return response?.data?.data ?? [];
  } catch (error) {
    console.log('🚀 ~error:', error);
    return [];
  }
};

export const useGetAllPostsByAuthorId = (authorId: number, axiosJWT: any, account: IUser) => {
  return useQuery('post-by-author', () => getAllPostsByAuthorId(authorId, axiosJWT, account), {
    enabled: !!authorId,
  });
};

// ============================== Get post by ID ==============================
export const getPostById = async (postId: number, axiosJWT: any, account: IUser) => {
  try {
    const response = await axiosJWT.get(`${TOPIC_TALKS_DOMAIN}/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${account?.access_token}`,
      },
    });
    return response?.data?.data ?? [];
  } catch (error) {
    console.log('🚀 ~error:', error);
    return [];
  }
};

export const useGetPostById = (postId: number, axiosJWT: any, account: IUser) => {
  return useQuery('post-detail', () => getPostById(postId, axiosJWT, account), {
    enabled: !!postId,
  });
};

// ================================= Approved post ==============================
export const approvedPost = async (id: number, account: IUser) => {
  const bearerToken = account?.access_token;

  const response = await fetch(`${TOPIC_TALKS_DOMAIN}/post/approve/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  if (!response.ok) {
    console.log('🚀 ~error:', response);
    throw new Error('Failed to approve post');
  }

  return response.json();
};

// ============================== Get USER by ID ==============================
export const getUserById = async (userId: number, axiosJWT: any, account: IUser) => {
  try {
    const response = await axiosJWT.get(`${TOPIC_TALKS_DOMAIN}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${account?.access_token}`,
      },
    });
    return response?.data?.data ?? [];
  } catch (error) {
    console.log('Get User Detail Failed', error);
    return [];
  }
};

export const useGetUserById = (userId: number, axiosJWT: any, account: IUser) => {
  return useQuery('user-detail', () => getUserById(userId, axiosJWT, account), {
    enabled: !!userId,
  });
};

export const editUser = async (userData, account: IUser) => {
  const bearerToken = account?.access_token;

  const response = await fetch(`${TOPIC_TALKS_DOMAIN}/user/${account.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    console.log('🚀 ~error:', response);
    throw new Error('Failed to Edit User Profile');
  }

  return response.json();
};

// ============================== Create comment ==============================
export const createComment = async (commentBody: ICommentBody, account: IUser) => {
  const bearerToken = account?.access_token;

  const response = await fetch(`${TOPIC_TALKS_DOMAIN}/comment/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(commentBody),
  });

  if (!response.ok) {
    console.log('🚀 ~error:', response);
    throw new Error('Failed to create comment');
  }

  return response.json();
};

// ============================== get Comment By Post Id ==============================

export const getCommentByPostId = async (postId: number, axiosJWT: any, account: IUser) => {
  try {
    const response = await axiosJWT.get(`${TOPIC_TALKS_DOMAIN}/comment/${postId}`, {
      headers: {
        Authorization: `Bearer ${account?.access_token}`,
      },
    });
    return response?.data?.data ?? [];
  } catch (error) {
    console.log('🚀 ~error:', error);
    return [];
  }
};

export const useGetCommentByPostId = (postId: number, axiosJWT: any, account: IUser) => {
  return useQuery('comment-by-postId', () => getCommentByPostId(postId, axiosJWT, account), {
    enabled: !!postId,
  });
};

// ============================== get All Comment ==============================
export const getAllComment = async (axiosJWT: any, account: IUser) => {
  try {
    const response = await axiosJWT.get(`${TOPIC_TALKS_DOMAIN}/comment/all`, {
      headers: {
        Authorization: `Bearer ${account?.access_token}`,
      },
    });

    return response?.data?.data ?? [];
  } catch (error) {
    console.log('🚀 ~error:', error);
    return [];
  }
};

export const useGetAllComment = (axiosJWT: any, account: IUser) => {
  return useQuery('all-comments', () => getAllComment(axiosJWT, account));
};

// ============================== delete Comment ==============================
export const deleteComment = async (commentId: number, account: IUser) => {
  const bearerToken = account?.access_token;

  const response = await fetch(`${TOPIC_TALKS_DOMAIN}/comment/${account.id}/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  if (!response.ok) {
    console.log('🚀 ~error:', response);
    throw new Error('Failed to delete comment');
  }

  return response.json();
};

// ===============================edit comment ==============================
export const editComment = async (commentData, account: IUser) => {
  const bearerToken = account?.access_token;

  const response = await fetch(`${TOPIC_TALKS_DOMAIN}/comment/update/${commentData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(commentData),
  });

  if (!response.ok) {
    console.log('🚀 ~error:', response);
    throw new Error('Failed to Edit comment Profile');
  }

  return response.json();
};

// ===============================create like ==============================
export const createLike = async (postId: number, account: IUser) => {
  const bearerToken = account?.access_token;
  const likeBody = {
    postId,
    userId: account.id,
  };

  const response = await fetch(`${TOPIC_TALKS_DOMAIN}/like/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(likeBody),
  });

  if (!response.ok) {
    console.log('🚀 ~error:', response);
    throw new Error('Failed to like post');
  }

  return response.json();
};

// ===============================remove like ==============================
export const removeLike = async (postId: number, account: IUser) => {
  const bearerToken = account?.access_token;

  const response = await fetch(`${TOPIC_TALKS_DOMAIN}/like/remove/uid=${account.id}&&pid=${postId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  if (!response.ok) {
    console.log('🚀 ~error:', response);
    throw new Error('Failed to unlike post');
  }

  return response.json();
};
