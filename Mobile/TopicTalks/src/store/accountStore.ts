import { observable, action, makeObservable, configure } from 'mobx';
import { persistStore } from './persistence/mobx.utils';
import { clearPersist, stopPersist, startPersist } from 'mobx-persist-store';
import { IUser } from '../types/account.types';

class AccountStore {
   account: IUser | null = null;

   constructor() {
      makeObservable(this, {
         account: observable,
         setAccount: action,
      });
      persistStore(this, ['account'], 'topic-talks');
   }

   setAccount(account: IUser | null) {
      this.account = account;
      console.log('account', account);
   }

   async clearStore() {
      await clearPersist(this);
   }

   stopPersist() {
      stopPersist(this);
   }

   startPersist() {
      startPersist(this);
   }
}

const accountStore = new AccountStore();

export default accountStore;
