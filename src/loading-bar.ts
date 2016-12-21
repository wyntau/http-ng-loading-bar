export let defaults = {
  includeBar: true,
  includeSpinner: true,
  loadingBarTemplate: '<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>',
  spinnerTemplate: '<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>',
  parentSelector: 'body',
  autoIncrement: true,
  startSize: 0.02
};

class LoadingBar {
  private _mounted: boolean;
  private _shown: boolean;
  private _autoIncrement: boolean;
  private _status: number;
  private _barElem: HTMLElement;
  private _spinnerElem: HTMLElement;

  private _incTimeoutId: number;
  private _endTimeoutId: number;

  constructor(){
    this._mounted = false;
    this._shown = false;
    this._autoIncrement = true;
    this._status = 0;
  }
  start() {
    if(!this._mounted){
      this.mount();
    }

    if(this._shown){
      return;
    }

    if(this._endTimeoutId){
      clearTimeout(this._endTimeoutId);
    }

    this._shown = true;
    this.set(defaults.startSize);

    if (defaults.includeBar) {
      addClass(this._barElem, 'shown');
    }

    if (defaults.includeSpinner) {
      addClass(this._spinnerElem, 'shown');
    }
  }

  complete() {
    if(!this._shown){
      return;
    }

    this.set(1);
    this._shown = false;

    clearTimeout(this._endTimeoutId);
    this._endTimeoutId = setTimeout(() => {
      removeClass(this._barElem, 'shown');
      removeClass(this._spinnerElem, 'shown');
    }, 300);
  }

  set(n: number) {
    if (!this._shown) {
      return;
    }
    var pct = (n * 100) + '%';

    (<HTMLElement>this._barElem.querySelector('.bar')).style.width = pct;

    this._status = n;

    // increment loadingbar to give the illusion that there is always
    // progress but make sure to cancel the previous timeouts so we don't
    // have multiple incs running at the same time.
    if (this._autoIncrement) {
      clearTimeout(this._incTimeoutId);
      this._incTimeoutId = setTimeout(() => {
        this.inc();
      }, 250);
    }
  }

  private mount() {
    if (!this._barElem) {
      let barWrap = document.createElement('div');
      barWrap.innerHTML = defaults.loadingBarTemplate;
      this._barElem = <HTMLElement>barWrap.querySelector('#loading-bar');
    }
    document.querySelector(defaults.parentSelector).appendChild(this._barElem);

    if (!this._spinnerElem) {
      let spinnerWrap = document.createElement('div');
      spinnerWrap.innerHTML = defaults.spinnerTemplate;
      this._spinnerElem = <HTMLElement>spinnerWrap.querySelector('#loading-bar-spinner');
    }
    document.querySelector(defaults.parentSelector).appendChild(this._spinnerElem);

    this._mounted = true;
  }

  private inc(){
    if (this._status >= 1) {
      return;
    }

    var rnd = 0;

    // TODO: do this mathmatically instead of through conditions

    var stat = this._status;
    if (stat >= 0 && stat < 0.25) {
      // Start out between 3 - 6% increments
      rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
    } else if (stat >= 0.25 && stat < 0.65) {
      // increment between 0 - 3%
      rnd = (Math.random() * 3) / 100;
    } else if (stat >= 0.65 && stat < 0.9) {
      // increment between 0 - 2%
      rnd = (Math.random() * 2) / 100;
    } else if (stat >= 0.9 && stat < 0.99) {
      // finally, increment it .5 %
      rnd = 0.005;
    } else {
      // after 99%, don't increment:
      rnd = 0;
    }

    var pct = this._status + rnd;
    this.set(pct);
  }
}

export default new LoadingBar();

function addClass(elem: HTMLElement, cls: string){
  let className = elem.className || '';
  let klass = className.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/);

  klass.push(cls);

  elem.className = klass.join(' ');
}

function removeClass(elem: HTMLElement, cls: string){
  let className = elem.className || '';
  let klass = className.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/);

  klass = klass.filter(function(item){
    return item !== cls;
  });

  elem.className = klass.join(' ');
}
