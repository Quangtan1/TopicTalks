import { observable, action, makeObservable } from 'mobx';

class UiStore {
  loading: boolean = false;
  collapse: boolean = true;
  location: string = '';

  constructor() {
    makeObservable(this, {
      loading: observable,
      collapse: observable,
      location: observable,
      setLoading: action,
      setCollapse: action,
      setLocation: action,
    });
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }
  setCollapse(collapse: boolean) {
    this.collapse = collapse;
  }
  setLocation(location: string) {
    this.location = location;
  }
}

const uiStore = new UiStore();

export default uiStore;
