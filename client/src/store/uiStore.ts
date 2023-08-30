import { observable, action, makeObservable } from 'mobx';

class UiStore {
  loading = true;
  collapse = true;

  constructor() {
    makeObservable(this, {
      loading: observable,
      collapse: observable,
      setLoading: action,
      setCollapse: action,
    });
  }

  setLoading(loading) {
    this.loading = loading;
  }
  setCollapse(collapse) {
    this.collapse = collapse;
  }
}

const uiStore = new UiStore();

export default uiStore;
