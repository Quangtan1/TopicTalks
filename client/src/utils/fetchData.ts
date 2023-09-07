export const getDataAPI = async (url: string, token: string, axiosJWT: any) => {
  const res = await axiosJWT.get(`api/${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const postDataAPI = async (url: string, post: any, token: string, axiosJWT: any) => {
  const res = await axiosJWT.post(`/api/${url}`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const putDataAPI = async (url: string, post: any, token: string, axiosJWT: any) => {
  const res = await axiosJWT.put(`/api/${url}`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const patchDataAPI = async (url: string, post: any, token: string, axiosJWT: any) => {
  const res = await axiosJWT.patch(`/api/${url}`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const deleteDataAPI = async (url: string, token: string, axiosJWT: any) => {
  const res = await axiosJWT.delete(`/api/${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};
