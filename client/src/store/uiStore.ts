import { observable, action, makeObservable } from 'mobx';

class UiStore {
  loading: boolean = false;
  collapse: boolean = true;
  location: string = '';
  isSuggest: boolean = true;

  constructor() {
    makeObservable(this, {
      loading: observable,
      collapse: observable,
      location: observable,
      isSuggest: observable,
      setLoading: action,
      setCollapse: action,
      setLocation: action,
      setIsSuggest: action,
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
  setIsSuggest(isSuggest: boolean) {
    this.isSuggest = isSuggest;
  }
}

const uiStore = new UiStore();

export default uiStore;
