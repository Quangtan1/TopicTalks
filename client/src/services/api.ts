import axios from 'axios';
import { stringify } from 'querystring-es3';
import { IExample } from 'src/queries/ExampleUseQuery';

const URL = 'https://jsonplaceholder.typicode.com/users';

 export const getExample = (params: any) => axios.get(`${URL}?${stringify(params)}`);

 export const updateExample = (body: IExample) => axios.put(`${URL}/${body.id}`, body);

 export const handleCallApi = (params: any) => {
   const { queryKey } = params || {};
   const multipleParams = queryKey.slice(1, queryKey.length).join('&');
   const param = queryKey[1]; // queryKey[0] is the query key name
   return axios.get(`https://jsonplaceholder.typicode.com/posts?${multipleParams}`);
 };
