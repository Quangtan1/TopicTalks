import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { IUser } from 'src/types/account.types';

export const API_KEY = 'http://localhost:5000/api/v1';

const refreshToken = async (resToken) => {
  try {
    const resfreshtoke = {
      refreshToken: resToken,
    };
    const res = await axios.post(`${API_KEY}/auth/refresh-token`, resfreshtoke);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const createAxios = (user: IUser, setAccount: any) => {
  const newInstance = axios.create({
    baseURL: API_KEY,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  newInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken: any = jwt_decode(user?.access_token);
      if (decodedToken.exp < date.getDate() / 1000) {
        const data = await refreshToken(user?.refresh_token);
        const refreshUser = {
          ...user,
          access_token: data?.access_token,
        };
        setAccount(refreshUser);
        config.headers['Authorization'] = 'Bearer ' + data?.access_token;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    },
  );
  return newInstance;
};
