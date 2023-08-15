import axios from 'axios';
import { stringify } from 'querystring-es3';
import { IExample } from 'src/queries/ExampleUseQuery';

type propertiesParams = {
  [key: string]: string | number | string[];
};

// const URL = 'https://example.com';
const URL = 'https://jsonplaceholder.typicode.com/users';

export const apiQueries = () => {
  // const getExample = (params: propertiesParams) => axios.get(`${URL}/topicTalks/v1/example?${stringify(params)}`);
  const getExample = (params: propertiesParams) => axios.get(`${URL}?${stringify(params)}`);

  const updateExample = (body: IExample) => axios.put(`${URL}/topicTalks/v1/example/${body.id}`, body);

  return {
    getExample,
    updateExample,
  };
};
