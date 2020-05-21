import { BrowserWindow } from "electron";
import { filesOperationEvents } from "../events";
import { copyFilesToHere, moveFilesToHere } from "../lib/file_manager";

const { SELECT_FILES_FROM } = filesOperationEvents;

export const editMenuTemplate = {
  label: "Edit",
  submenu: [
    {
      label: "Copy files",
      accelerator: "Shift+CmdOrCtrl+C",
      click: () => {
        BrowserWindow.getFocusedWindow().webContents.send(SELECT_FILES_FROM);
      },
      selector: "copy:"
    },
    {
      label: "Paste files",
      accelerator: "Shift+CmdOrCtrl+P",
      click: () => copyFilesToHere(),
      selector: "paste:"
    },
    {
      label: "Move tab",
      accelerator: "Shift+CmdOrCtrl+M",
      click: () => moveFilesToHere()
    },
  ]
};
