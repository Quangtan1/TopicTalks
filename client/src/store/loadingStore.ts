import { observable, action, makeObservable } from 'mobx';

class LoadingStore {
  loading = false;

  constructor() {
    makeObservable(this, {
      loading: observable,
      setLoading: action,
    });
  }

  setLoading(loading) {
    this.loading = loading;
  }
}

const loadingStore = new LoadingStore();

export default loadingStore;
