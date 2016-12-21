import loadingBar from './loading-bar';
export {defaults} from './loading-bar';

// The total number of requests made
let reqsTotal = 0;

// The number of requests completed (either successfully or not)
let reqsCompleted = 0;

// complete LoadingBar and cleanup
function completeLoadingBar(){
  loadingBar.complete();
  reqsCompleted = 0;
  reqsTotal = 0;
}

export default {
  request: function(config){
    if(config.ignoreLoadingBar){
      return config;
    }
    if(reqsTotal === 0){
      loadingBar.start();
    }
    reqsTotal++;
    loadingBar.set(reqsCompleted / reqsTotal);

    return config;
  },
  response: function(response){
    if(!response || !response.config){
      return response;
    }

    if(response.config.ignoreLoadingBar){
      return response;
    }

    reqsCompleted++;

    if(reqsCompleted >= reqsTotal){
      completeLoadingBar();
    }else{
      loadingBar.set(reqsCompleted / reqsTotal);
    }

    return response;
  },
  responseError: function(rejection){
    if(!rejection || !rejection.config){
      return Promise.reject(rejection);
    }

    if(rejection.config.ignoreLoadingBar){
      return Promise.reject(rejection);
    }

    reqsCompleted++;
    if(reqsCompleted >= reqsTotal){
      completeLoadingBar();
    }else{
      loadingBar.set(reqsCompleted / reqsTotal);
    }

    return Promise.reject(rejection);
  }
};
