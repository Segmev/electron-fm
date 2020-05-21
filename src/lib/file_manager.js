import fs from "fs";
import jetpack from "fs-jetpack";
import { app, shell, BrowserWindow } from "electron";
import { tabEvents, pathEvents, fileListEvents, progressEvents, alertModalEvents } from '../events';

const { RENAME_TAB } = tabEvents;
const { PATH_REFRESH } = pathEvents;
const { UPDATE_FILE_LIST } = fileListEvents;
const { SHOW_PROGRESS_BAR, SET_PROGRESS_VALUE, HIDE_PROGRESS_BAR } = progressEvents;
const { SHOW_MODAL } = alertModalEvents;

let appDirs = [];
let copiedPaths = [];

export const initialiseAppDir = (path, id) => {
  appDirs[id] = jetpack.cwd(app.getPath(path));
  return appDirs[id].cwd();
}

export const handleFilename = async (event, filename) => {
  const { sender: { id } } = event;
  if (typeof filename === 'undefined') {
    filename = appDirs[id].cwd();
  }
  if (appDirs[id].exists(filename) === 'dir') {
    appDirs[id] = appDirs[id].cwd(filename);
  } else {
    shell.openItem(appDirs[id].cwd() + '/' + filename);
  }
  const filenames = appDirs[id].list();
  const fileInfoList = filenames.map((filename) => appDirs[id].inspect(filename, {
    times: true,
    mode: true
  }));
  const appDirCwd = appDirs[id].cwd();
  event.sender.webContents.send(RENAME_TAB, appDirCwd);
  event.sender.webContents.send(UPDATE_FILE_LIST, [{ name: '..' }, ...fileInfoList]);
  event.sender.webContents.send(PATH_REFRESH, appDirCwd);
}

export const storeFilePaths = async ({ sender: { id } }, copiedFilenames) => {
  copiedPaths = copiedFilenames.map((elem) => appDirs[id].cwd() + '/' + elem);
}

export const copyFilesToHere = async (event) => {
  const focusdWindow = BrowserWindow.getFocusedWindow();
  const { id } = focusdWindow;
  focusdWindow.webContents.send(SHOW_PROGRESS_BAR);
  const fileCount = copiedPaths.length;
  let fileTraited = 0;
  copiedPaths.forEach((fromPath) => {
    try {
      const toPath = appDirs[id].cwd() + '/' + fromPath.split('/').pop();
      appDirs[id].copyAsync(fromPath, toPath, { overwrite: true })
        .then(() => {
          fileTraited += 1;
          focusdWindow.webContents.send(SET_PROGRESS_VALUE, Math.ceil((fileTraited) / fileCount * 100));
          if (fileTraited === fileCount) {
            handleFilename(event);
          }
        })
        .catch(e => focusdWindow.webContents.send(SHOW_MODAL, e.message));
    } catch (e) {
      focusdWindow.webContents.send(SHOW_MODAL, e.message);
    }
  });
  handleFilename(event);
}

export const moveFilesToHere = async () => {
  const focusdWindow = BrowserWindow.getFocusedWindow();
  const { id } = focusdWindow;
  focusdWindow.webContents.send(SHOW_PROGRESS_BAR);
  const fileCount = copiedPaths.length;
  let fileTraited = 0;
  copiedPaths.forEach((fromPath) => {
    try {
      const toPath = appDirs[id].cwd() + '/' + fromPath.split('/').pop();
      appDirs[id].moveAsync(fromPath, toPath)
        .then(() => {
          fileTraited += 1;
          focusdWindow.webContents.send(SET_PROGRESS_VALUE, Math.ceil((fileTraited) / fileCount * 100));
          if (fileTraited === fileCount) {
            handleFilename(event);
          }
        })
        .catch(e => focusdWindow.webContents.send(SHOW_MODAL, e.message));
    } catch (e) {
      focusdWindow.webContents.send(SHOW_MODAL, e.message);
    }
  });
}
