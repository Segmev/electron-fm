import { setAttr } from "redom";
import { el } from 'redom';
import { ipcRenderer } from "electron";
import { progressEvents } from '../events';
import { wait } from "../lib/utils";

const { HIDE_PROGRESS_BAR, SHOW_PROGRESS_BAR, SET_PROGRESS_VALUE } = progressEvents;

class ProgressBar {
  constructor() {
    this._value = 0;
    this.default_classnames = 'progress-bar progress is-info';
    this.success_classnames = 'progress-bar progress is-success';
    this.el = el('progress#progress-bar');
    setAttr(this.el, {
      class: `${this.default_classnames} is-invisible`,
      max: 100
    })
  }

  removeValue() {
    this.el._value = 0;
    this.el.removeAttribute("value");
  }

  set hidden(hidden) {
    if (hidden) {
      setAttr(this.el, {
        class: `${this.default_classnames} is-invisible`
      })
      this._hidden = true;
      this.removeValue();
    } else if (!hidden) {
      setAttr(this.el, {
        class: this.default_classnames,
        value: null
      })
      this.removeValue();
    }
  }

  async progressiveProgress(from, to) {
    while (this._value === to && from < to) {
      from += 1;
      await wait(10);
      setAttr(this.el, {
        value: from
      })
    }
  }

  set value(value) {
    let start = this._value;
    this._value = value;
    this.hidden = false;
    this.progressiveProgress(start, value).then(async () => {
      setAttr(this.el, {
        class: this.success_classnames
      })
      await wait(1000);
      this.hidden = true;
    });
  }
}

ipcRenderer.on(SET_PROGRESS_VALUE, (_ev, value) => {
  progressBar.value = value;
})

ipcRenderer.on(SHOW_PROGRESS_BAR, () => {
  progressBar.hidden = false;
})

ipcRenderer.on(HIDE_PROGRESS_BAR, () => {
  progressBar.hidden = true;
})

const progressBar = new ProgressBar();

export default progressBar;
