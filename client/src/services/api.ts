import axios from 'axios';
import { stringify } from 'querystring-es3';
import { IPost } from 'src/components/layouts/home/post/PostItem';
import { IExample } from 'src/queries/ExampleUseQuery';
import { ApiResponse, Owner } from 'src/types';

const URL = 'https://jsonplaceholder.typicode.com/users';

export const baseURL = 'https://dummyapi.io/data/v1';

export const appId = '64ecafee3f6a06578f5e998a';

export const headers = {
  'app-id': appId,
};

export const getExample = (params: any) => axios.get(`${URL}?${stringify(params)}`);

export const updateExample = (body: IExample) => axios.put(`${URL}/${body.id}`, body);

export const handleCallApiPost = (params: any): Promise<ApiResponse> => {
  if (params.queryKey) {
    const { queryKey } = params || {};
    const multipleParams = queryKey.slice(1, queryKey.length).join('&');
    const param = queryKey[1]; // queryKey[0] is the query key name
    return axios.get(`https://dummyapi.io/data/v1/post?limit=10&page=1`, { headers });
  }
};

export const handleCallApiUser = (): Promise<Owner> => {
  return axios.get(`https://dummyapi.io/data/v1/user/60d0fe4f5311236168a109ca`, { headers });
};
