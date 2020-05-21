import path from "path";
import url from "url";
import { ipcMain } from "electron";
import createWindow from "../helpers/window";
import { initialiseAppDir, handleFilename, storeFilePaths } from "../lib/file_manager";
import { restoreBookmaks, addBookmark, removeBookmark } from '../helpers/bookmarks';
import { tabEvents, pathEvents, bookmarksEvents, fileListEvents, filesOperationEvents } from '../events';

const { NEW_TAB } = tabEvents;
const { PATH_REFRESH, ENTER_PATH } = pathEvents;
const { UPDATE_BOOKMARK, REMOVE_BOOKMARK, ADD_BOOKMARK } = bookmarksEvents;
const { CLICK_FILE } = fileListEvents;
const { STORE_SELECTED_FILES } = filesOperationEvents;

let index = 0;

export const openNewWindow = () => {
  index += 1;
  const newWindow = createWindow(`fm-win-${index}`, {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  newWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app.html"),
      protocol: "file:",
      slashes: true
    })
  );

  newWindow.webContents.on('did-finish-load', () => {
    const appDirCwd = initialiseAppDir('home', newWindow.id);
    newWindow.webContents.send(NEW_TAB, appDirCwd);
    newWindow.webContents.send(PATH_REFRESH, appDirCwd)
    newWindow.webContents.send(UPDATE_BOOKMARK, restoreBookmaks().bookmarks);
  })
}

ipcMain.on(CLICK_FILE, handleFilename);

ipcMain.on(ENTER_PATH, async (event, filename) => {
  handleFilename(event, filename);
});

ipcMain.on(REMOVE_BOOKMARK, async (event, bookmarkTitle) => {
  let bookmarks = removeBookmark(bookmarkTitle);
  event.sender.webContents.send(UPDATE_BOOKMARK, bookmarks);
});

ipcMain.on(ADD_BOOKMARK, async (event, bookmark) => {
  let bookmarks = addBookmark(bookmark);
  event.sender.webContents.send(UPDATE_BOOKMARK, bookmarks);
});

ipcMain.on(STORE_SELECTED_FILES, async (event, copiedFilenames) => {
  storeFilePaths(event, [...copiedFilenames]);
});
