import axios from 'axios';
import { stringify } from 'querystring-es3';
import { IExample } from 'src/queries/ExampleUseQuery';

const URL = 'https://jsonplaceholder.typicode.com/users';

export const apiQueries = () => {
  const getExample = (params: any) => axios.get(`${URL}?${stringify(params)}`);

  const updateExample = (body: IExample) => axios.put(`${URL}/${body.id}`, body);

  return {
    getExample,
    updateExample,
  };
};
