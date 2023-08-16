import { useState } from 'react';
import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import apiClient from 'src/services';
import { API_QUERIES } from '../keys';
import { PaginationResponseType, toData } from './helpers';
import { GetPropertiesParams, IExample } from '../types';

export function useGetAllExample(options?: UseQueryOptions<PaginationResponseType<IExample>, Error>) {
  const [params, setParams] = useState<GetPropertiesParams>({});

  const {
    data,
    error,
    isError,
    isFetching,
    refetch: onGetAllData,
  } = useQuery<PaginationResponseType<IExample>, Error>([API_QUERIES.EXAMPLE, params], {
    queryFn: () => apiClient.getExample(params),
    notifyOnChangeProps: ['data', 'isFetching'],
    keepPreviousData: true,
    select: (data) => toData(data),
    ...options,
  });

  const queryClient = useQueryClient();

  const handleInvalidateAllApiExample = () => queryClient.invalidateQueries(API_QUERIES.EXAMPLE);

  const { data: example, hasNext, payloadSize, totalRecords } = data || {};

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
