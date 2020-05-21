import { ipcRenderer } from "electron";
import { bookmarksEvents } from "../events";
const { REMOVE_BOOKMARK, ADD_BOOKMARK } = bookmarksEvents;

export const sideMenuTemplate = (title) => [
  {
    id: 1,
    label: "Remove this bookmark",
    click: () => {
      ipcRenderer.send(REMOVE_BOOKMARK, title);
    }
  }
]

export const tabMenuTemplate = (bookmark) => [{
  id: 1,
  label: "Bookmark this folder",
  click: () => {
    ipcRenderer.send(ADD_BOOKMARK, bookmark);
  }
}];
