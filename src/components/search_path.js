import { ipcRenderer } from "electron";
import { el } from "redom";
import { bookmarksEvents, pathEvents } from "../events";

const { ADD_BOOKMARK } = bookmarksEvents;
const { ENTER_PATH, PATH_REFRESH } = pathEvents;

let enteredPath = "";

class SavePathIcon {
  constructor() {
    this.el = el('a.button.is-outlined', 'Add bookmark');
    this.el.onclick = () => {
      ipcRenderer.send(ADD_BOOKMARK, { title: enteredPath.split('/').pop(), path: enteredPath })
    };
  }
}

class PathInput {
  constructor() {
    this.el = el('input.input');
    this.el.onchange = ({ target: { value } }) => {
      if (value) {
        enteredPath = value;
        validatePath(value);
      }
    }
  }

  update(path) {
    this.el.value = path;
  }
}

let pathInput = new PathInput();
let pathSaveIcon = new SavePathIcon();

const inputField = el('#search-path.field.has-addons',
  el('.control', pathSaveIcon), el('.control.is-expanded', pathInput)
);

const validatePath = (path) => {
  ipcRenderer.send(ENTER_PATH, path);
}

ipcRenderer.on(PATH_REFRESH, (_ev, path) => {
  enteredPath = path;
  pathInput.update(path);
});

export default inputField;
