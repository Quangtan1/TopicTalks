import { observable, action, makeObservable } from 'mobx';

class UiStore {
  loading: boolean = false;
  collapse: boolean = true;

  constructor() {
    makeObservable(this, {
      loading: observable,
      collapse: observable,
      setLoading: action,
      setCollapse: action,
    });
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }
  setCollapse(collapse: boolean) {
    this.collapse = collapse;
  }
}

const uiStore = new UiStore();

export default uiStore;
