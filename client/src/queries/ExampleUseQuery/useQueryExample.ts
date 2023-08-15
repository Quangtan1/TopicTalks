import { useState } from 'react';
import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from 'src/services';
import { API_QUERIES } from '../keys';
import { PaginationResponseType, responseWrapper, toData } from './helpers';
import { IExample } from './types';

export function useGetAllExample(options?: UseQueryOptions<PaginationResponseType<IExample>, Error>) {
  const [params, setParams] = useState({});

  const {
    data,
    error,
    isError,
    isFetching,
    refetch: onGetAllData,
  } = useQuery<PaginationResponseType<IExample>, Error>([API_QUERIES.EXAMPLE, params], {
    queryFn: (query) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...params] = query.queryKey;
      return responseWrapper<PaginationResponseType<IExample>>(apiClient.getExample, params);
    },
    notifyOnChangeProps: ['data', 'isFetching'],
    keepPreviousData: true,
    select: (data) => toData(data),
    ...options,
  });

  const queryClient = useQueryClient();

  const handleInvalidateAllApiExample = () => queryClient.invalidateQueries(API_QUERIES.EXAMPLE);

  const { data: example, hasNext, payloadSize, totalRecords } = data || {};
  console.log('🚀 ~ file: useQueryExample.ts:34 ~ useGetAllExample ~ example:', example);

  return {
    example,
    hasNext,
    payloadSize,
    totalRecords,
    error,
    isError,
    isFetching,
    onGetAllData,
    setParams,
    handleInvalidateAllApiExample,
  };
}
