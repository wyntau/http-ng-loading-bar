(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.loadingBar = global.loadingBar || {})));
}(this, (function (exports) { 'use strict';

var defaults = {
    latencyThreshold: 50,
    includeBar: true,
    includeSpinner: true,
    loadingBarTemplate: '<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>',
    spinnerTemplate: '<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>',
    parentSelector: 'body',
    autoIncrement: true,
    startSize: 0.02
};
var LoadingBar = (function () {
    function LoadingBar() {
        this._mounted = false;
        this._shown = false;
        this._autoIncrement = true;
        this._status = 0;
    }
    LoadingBar.prototype.start = function () {
        var _this = this;
        if (!this._mounted) {
            this.mount();
        }
        if (this._shown) {
            return;
        }
        if (this._showTimeoutId) {
            return;
        }
        this._shown = true;
        this._showTimeoutId = setTimeout(function () {
            _this.set(defaults.startSize);
            if (defaults.includeBar) {
                addClass(_this._barElem, 'shown');
            }
            if (defaults.includeSpinner) {
                addClass(_this._spinnerElem, 'shown');
            }
        }, defaults.latencyThreshold);
    };
    LoadingBar.prototype.complete = function () {
        if (!this._shown) {
            return;
        }
        clearTimeout(this._showTimeoutId);
        this._showTimeoutId = null;
        this.set(1);
        removeClass(this._barElem, 'shown');
        removeClass(this._spinnerElem, 'shown');
        this._shown = false;
    };
    LoadingBar.prototype.set = function (n) {
        var _this = this;
        if (!this._shown) {
            return;
        }
        var pct = (n * 100) + '%';
        this._barElem.style.width = pct;
        this._status = n;
        // increment loadingbar to give the illusion that there is always
        // progress but make sure to cancel the previous timeouts so we don't
        // have multiple incs running at the same time.
        if (this._autoIncrement) {
            clearTimeout(this._incTimeoutId);
            this._incTimeoutId = setTimeout(function () {
                _this.inc();
            }, 250);
        }
    };
    LoadingBar.prototype.mount = function () {
        if (!this._barElem) {
            var barWrap = document.createElement('div');
            barWrap.innerHTML = defaults.loadingBarTemplate;
            this._barElem = barWrap.querySelector('#loading-bar');
        }
        document.querySelector(defaults.parentSelector).appendChild(this._barElem);
        if (!this._spinnerElem) {
            var spinnerWrap = document.createElement('div');
            spinnerWrap.innerHTML = defaults.spinnerTemplate;
            this._spinnerElem = spinnerWrap.querySelector('#loading-bar-spinner');
        }
        document.querySelector(defaults.parentSelector).appendChild(this._spinnerElem);
        this._mounted = true;
    };
    LoadingBar.prototype.inc = function () {
        if (this._status >= 1) {
            return;
        }
        var rnd = 0;
        // TODO: do this mathmatically instead of through conditions
        var stat = this._status;
        if (stat >= 0 && stat < 0.25) {
            // Start out between 3 - 6% increments
            rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
        }
        else if (stat >= 0.25 && stat < 0.65) {
            // increment between 0 - 3%
            rnd = (Math.random() * 3) / 100;
        }
        else if (stat >= 0.65 && stat < 0.9) {
            // increment between 0 - 2%
            rnd = (Math.random() * 2) / 100;
        }
        else if (stat >= 0.9 && stat < 0.99) {
            // finally, increment it .5 %
            rnd = 0.005;
        }
        else {
            // after 99%, don't increment:
            rnd = 0;
        }
        var pct = this._status + rnd;
        this.set(pct);
    };
    return LoadingBar;
}());
var loadingBar = new LoadingBar();
function addClass(elem, cls) {
    var className = elem.className || '';
    var klass = className.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/);
    klass.push(cls);
    elem.className = klass.join(' ');
}
function removeClass(elem, cls) {
    var className = elem.className || '';
    var klass = className.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/);
    klass = klass.filter(function (item) {
        return item !== cls;
    });
    elem.className = klass.join(' ');
}

// The total number of requests made
var reqsTotal = 0;
// The number of requests completed (either successfully or not)
var reqsCompleted = 0;
// complete LoadingBar and cleanup
function completeLoadingBar() {
    loadingBar.complete();
    reqsCompleted = 0;
    reqsTotal = 0;
}
var interceptor = {
    request: function (config) {
        if (config.ignoreLoadingBar) {
            return config;
        }
        if (reqsTotal === 0) {
            loadingBar.start();
        }
        reqsTotal++;
        loadingBar.set(reqsCompleted / reqsTotal);
        return config;
    },
    response: function (response) {
        if (!response || !response.config) {
            return response;
        }
        if (response.config.ignoreLoadingBar) {
            return response;
        }
        reqsCompleted++;
        if (reqsCompleted >= reqsTotal) {
            completeLoadingBar();
        }
        else {
            loadingBar.set(reqsCompleted / reqsTotal);
        }
        return response;
    },
    responseError: function (rejection) {
        if (!rejection || !rejection.config) {
            return Promise.reject(rejection);
        }
        if (rejection.config.ignoreLoadingBar) {
            return Promise.reject(rejection);
        }
        reqsCompleted++;
        if (reqsCompleted >= reqsTotal) {
            completeLoadingBar();
        }
        else {
            loadingBar.set(reqsCompleted / reqsTotal);
        }
        return Promise.reject(rejection);
    }
};

exports['default'] = interceptor;
exports.defaults = defaults;

Object.defineProperty(exports, '__esModule', { value: true });

})));
