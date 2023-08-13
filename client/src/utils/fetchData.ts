import http from './http';

export const getDataAPI = async (url: string, token: string) => {
  const res = await http.get(`api/${url}`, {
    headers: { Authorization: token }
  });
  return res;
};

export const postDataAPI = async (url: string, post: any, token: string) => {
  const res = await http.post(`/api/${url}`, post, {
    headers: { Authorization: token }
  });
  return res;
};

export const putDataAPI = async (url: string, post: any, token: string) => {
  const res = await http.put(`/api/${url}`, post, {
    headers: { Authorization: token }
  });
  return res;
};

export const patchDataAPI = async (url: string, post: any, token: string) => {
  const res = await http.patch(`/api/${url}`, post, {
    headers: { Authorization: token }
  });
  return res;
};

export const deleteDataAPI = async (url: string, token: string) => {
  const res = await http.delete(`/api/${url}`, {
    headers: { Authorization: token }
  });
  return res;
};
