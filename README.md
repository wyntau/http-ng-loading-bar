### http-ng-loading-bar

A automatic loading / progress bar for [`http-ng`](https://github.com/Treri/http-ng)

#### Install

```
npm install http-ng-loading-bar
```

#### Dependencies
- [`http-ng`](https://github.com/Treri/http-ng)

#### Usage

```js
import http from 'http-ng';
import loadingbar from 'http-ng-loading-bar';

http.interceptors.push(loadingBar);

http.get('/foo').then(function(res){console.log(res)});
```

#### Credit

This library is heavily inspired by [angular-loading-bar](https://github.com/chieffancypants/angular-loading-bar)

#### License
MIT
