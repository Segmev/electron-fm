import { BrowserWindow } from "electron";
import { openNewWindow } from "../windows/file_manager_window"
import { tabEvents } from "../events";
const { NEW_TAB, CLOSE_TAB } = tabEvents;

export const fileMenuTemplate = {
  label: "File",
  submenu: [
    {
      label: "New tab",
      accelerator: "CmdOrCtrl+T",
      click: () => {
        BrowserWindow.getFocusedWindow().webContents.send(NEW_TAB);
      }
    },
    {
      label: "New window",
      accelerator: "CmdOrCtrl+N",
      click: () => openNewWindow()
    },
    {
      label: "Close tab",
      accelerator: "CmdOrCtrl+W",
      click: () => {
        BrowserWindow.getFocusedWindow().webContents.send(CLOSE_TAB);
      }
    },
  ]
};
