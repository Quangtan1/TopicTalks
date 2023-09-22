export const getDataAPI = async (url: string, token: string, axiosJWT: any) => {
  const res = await axiosJWT.get(`/api/v1/${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const postDataAPI = async (url: string, post: any, token: string, axiosJWT: any) => {
  const res = await axiosJWT.post(`/api/v1/${url}`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const putDataAPI = async (url: string, post: any, token: string, axiosJWT: any) => {
  const res = await axiosJWT.put(`/api/v1/${url}`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const patchDataAPI = async (url: string, post: any, token: string, axiosJWT: any) => {
  const res = await axiosJWT.patch(`/api/v1/${url}`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const deleteDataAPI = async (url: string, token: string, axiosJWT: any) => {
  const res = await axiosJWT.delete(`/api/v1/${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};
