import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from 'src/services';
import { responseWrapper } from './helpers';
import { IExample } from './types';

export function useUpdateExample(options?: UseMutationOptions<any, Error, IExample>) {
  const {
    mutate: onUpdateExample,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useMutation<any, Error, IExample>({
    mutationFn: (payload: IExample) => responseWrapper(apiClient.updateExample, [payload]),
    onError: ({ message }) => console.log(message),
    ...options,
  });

  return {
    onUpdateExample,
    isLoading,
    isSuccess,
    isError,
    error,
  };
}
