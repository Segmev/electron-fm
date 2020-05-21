
import { ipcRenderer, remote } from "electron";
import { el, list, setAttr } from "redom";
import { tabMenuTemplate } from "../context_menu/bookmarks_menu_templates";
import { fileListEvents, tabEvents } from "../events";

const { NEW_TAB, CLOSE_TAB, RENAME_TAB } = tabEvents;
const { CLICK_FILE } = fileListEvents;

const { Menu } = remote;

class Anch {
  constructor() {
    this.el = el('a');
  }
  update({ name: path, index }) {
    const title =  path.split('/').pop()
    this.el.textContent = title;
    this.el.onclick = () => {
      tabs.activeTabIndex = index;
      ipcRenderer.send(CLICK_FILE, path);
    }
    this.el.oncontextmenu = () => {
      const menu = Menu.buildFromTemplate(tabMenuTemplate({ title, path }));
      menu.popup();
    }
  }
}

class Li {
  constructor() {
    this.anchor = el(Anch);
    this.el = el('li', this.anchor);
  }
  update({ name, index, isActive }) {
    setAttr(this.el, {
      id: `tab-${index}`,
      className: isActive ? 'is-active' : ''
    })
    this.anchor.update({ name, index });
  }
}

class Tabs {
  constructor() {
    this._tabNames = [];
    this._activeTabIndex = 0;
    this.tabsEl = list('ul#tab-bar', Li);
    this.el = el('.tabs.is-boxed', this.tabsEl);
  }

  updateTabs() {
    if (this._tabNames.length < 2) {
      setAttr(this.el, {
        className: 'is-invisible'
      });
    } else {
      setAttr(this.el, {
        className: 'tabs is-boxed'
      });
      let hasMain = false;
      const tabsList = this._tabNames.map((name, index) => {
        if (this._activeTabIndex === index) {
          hasMain = true;
        }
        return {
          name,
          index,
          isActive: this._activeTabIndex === index
        }
      });
      if (!hasMain) {
        tabsList[0].isActive = true;
      }
      this.tabsEl.update(tabsList);
    }
  }

  removeActiveTab() {
    if (this._tabNames.length > 1) {
      this._tabNames.splice(this._activeTabIndex, 1);
    } else {
      let win = remote.getCurrentWindow()
      win.close();
    }
    this._activeTabIndex += (this._activeTabIndex > 0) ? -1 : 0;
    this.updateTabs();
  }

  addNewActiveTab(name) {
    if (!name) {
      name = this.activeTabName;
    }
    this._activeTabIndex = this._tabNames.length;
    this._tabNames.push(name);
    this.updateTabs();
  }

  set activeTabIndex(index) {
    this._activeTabIndex = index;
    this.updateTabs();
  }

  set activeTabName(name) {
    this._tabNames[this._activeTabIndex] = name;
    this.updateTabs();
  }

  set tabNames(tabsName) {
    this._tabNames = tabsName;
    this.updateTabs();
  }

  get activeTabName() {
    return this._tabNames[this._activeTabIndex];
  }
}

ipcRenderer.on(NEW_TAB, (_ev, activeTabName) => {
  tabs.addNewActiveTab(activeTabName);
  ipcRenderer.send(CLICK_FILE, tabs.activeTabName);
});

ipcRenderer.on(CLOSE_TAB, (_ev) => {
  tabs.removeActiveTab();
});

ipcRenderer.on(RENAME_TAB, (_ev, newTabName) => {
  tabs.activeTabName = newTabName;
});

const tabs = new Tabs();

export default tabs;
