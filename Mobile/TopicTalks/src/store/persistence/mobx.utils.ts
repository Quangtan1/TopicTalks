import { PersistenceStore } from 'mobx-persist-store/lib/types';
import { persistence, StorageAdapter } from 'mobx-persist-store';

export const persistStore = <T extends Record<string, any>, P extends keyof T>(
   target: T,
   properties: P[],
   persistName: string
): T | PersistenceStore<T> => {
   const isServer = typeof window === 'undefined';

   if (isServer) {
      return target;
   }

   return persistence({
      name: persistName,
      properties: properties as string[],
      adapter: new StorageAdapter({
         read: async name => {
            const cookie = document.cookie.split('; ').find(row => row.startsWith(name + '='));

            if (cookie) {
               const value = cookie.split('=')[1];
               return JSON.parse(decodeURIComponent(value));
            }

            return undefined;
         },
         write: async (name, content) => {
            const encodedContent = encodeURIComponent(JSON.stringify(content));
            const cookieOptions = {
               expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
               path: '/',
            };
            document.cookie = `${name}=${encodedContent}; ${Object.entries(cookieOptions)
               .map(([key, value]) => `${key}=${value}`)
               .join('; ')}`;
         },
      }),
      reactionOptions: {
         delay: 200,
      },
   })(target);
};
