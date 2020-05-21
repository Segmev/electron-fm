import { el, list } from "redom";
import { ipcRenderer, remote } from "electron";
import { sideMenuTemplate } from "../context_menu/bookmarks_menu_templates";
import { bookmarksEvents, fileListEvents } from "../events";

const { UPDATE_BOOKMARK } = bookmarksEvents;
const { CLICK_FILE } = fileListEvents;
const { Menu } = remote;

class SideMenuItem {
  constructor() {
    this.anch = el('a');
    this.el = el('li', el('span', this.anch));
  }

  update({ title, path }) {
    this.anch.textContent = title;
    this.anch.onclick = () => {
      ipcRenderer.send(CLICK_FILE, path);
    };
    this.anch.oncontextmenu = () => {
      const menu = Menu.buildFromTemplate(sideMenuTemplate(title));
      menu.popup();
    };
  }
}

const SideMenu = list.extend('ul.menu-list', SideMenuItem);
let bookmarksMenu = new SideMenu();

const sideMenu = el('aside#side-menu.menu.column.is-2', el('p.menu-label', 'General'), bookmarksMenu);

ipcRenderer.on(UPDATE_BOOKMARK, (_ev, bookmarks) => {
  bookmarksMenu.update(bookmarks);
})

export default sideMenu;
