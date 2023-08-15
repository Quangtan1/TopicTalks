export const toData = (data) => ({
  ...data,
});

// example data
export interface PaginationResponseType<T> {
  data: T[];
  payloadSize?: number;
  hasNext?: boolean;
  totalRecords?: number;
}

export interface ArrayResponseType<T> {
  data: T[];
}

export interface ApiPaginationResponseType<T> {
  data: PaginationResponseType<T>;
  success?: boolean;
  query?: Object;
}

type ApiCall = (...args: any[]) => Promise<any>;

export async function responseWrapper<T>(func: ApiCall, [...args]: any[] = []): Promise<T> {
  return new Promise(async (res, rej) => {
    try {
      const response = (await func(...args)) || {};
      if (response.ok) res(response.data);
      if (response?.originalError?.message === 'CONNECTION_TIMEOUT') {
        console.log('🚀 Connection timeout. Please check your network and try again.');
      }
      rej(response.data);
    } catch (err) {
      rej(err);
    }
  });
}
