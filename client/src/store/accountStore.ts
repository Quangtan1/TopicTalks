import { observable, action, makeObservable } from 'mobx';
import { IUser } from 'src/types/account.types';
import { persistStore } from './persistence/mobx.utils';
import { clearPersist, stopPersist, startPersist } from 'mobx-persist-store';

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
