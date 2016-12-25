export declare interface defaults {
  includeBar: boolean;
  includeSpinner: boolean;
  loadingBarTemplate: string;
  spinnerTemplate: string;
  parentSelector: string;
  autoIncrement: boolean;
  startSize: number;
}

declare interface loadingBar {
  request: Function;
  response: Function;
  responseError: Function;
}

export default loadingBar;
