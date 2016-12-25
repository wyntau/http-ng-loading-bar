import {IHttpInterceptor} from 'http-ng';

export declare interface defaults {
  includeBar: boolean;
  includeSpinner: boolean;
  loadingBarTemplate: string;
  spinnerTemplate: string;
  parentSelector: string;
  autoIncrement: boolean;
  startSize: number;
}

declare let loadingBar: IHttpInterceptor;

export default loadingBar;
