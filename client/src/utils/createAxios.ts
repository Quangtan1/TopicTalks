import axios from 'axios';
import jwt_decode from 'jwt-decode';

const refreshToken = async () => {
  try {
    const res = await axios.post('/auth/refresh', {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const createAxios = (user, setAccount) => {
  const newInstance = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  newInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken: any = jwt_decode(user?.accessToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,
        };
        setAccount(refreshUser);
        config.headers['Authorization'] = 'Bearer ' + data.accessToken;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    },
  );
  return newInstance;
};
