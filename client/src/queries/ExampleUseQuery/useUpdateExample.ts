import { useMutation, UseMutationOptions } from 'react-query';
import { IExample } from '../types';
import { updateExample } from 'src/services/api';

export function useUpdateExample(options?: UseMutationOptions<any, Error, IExample>) {
  const {
    mutate: onUpdateExample,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useMutation<any, Error, IExample>({
    mutationFn: (payload: IExample) => updateExample(payload),
    onError: ({ message }) => console.log('🚀 Error mutation: ', message),
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
