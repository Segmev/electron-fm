import { app } from "electron";
import jetpack from "fs-jetpack";

let sessionBookmarks = [];

const userDataDir = jetpack.cwd(app.getPath('userData'));
const stateStoreFile = 'bookmark-state.json';

export const removeBookmark = (title) => {
  sessionBookmarks = sessionBookmarks.filter((elem => elem.title != title));
  saveBookmarks(sessionBookmarks);
  return sessionBookmarks;
}

export const addBookmark = (bookmark) => {
  if (!sessionBookmarks.some((elem) => elem.title === bookmark.title)) {
    sessionBookmarks.push(bookmark);
  }
  saveBookmarks(sessionBookmarks);
  return sessionBookmarks;
}

export const saveBookmarks = (bookmarks) => {
  sessionBookmarks = [...new Set(bookmarks)];
  userDataDir.write(stateStoreFile, { bookmarks: sessionBookmarks }, { atomic: true });
}

export const restoreBookmaks = () => {
  let defaultBookmarkState = { bookmarks: sessionBookmarks }
  let restoredState = {};
  try {
    restoredState = userDataDir.read(stateStoreFile, 'json');
    sessionBookmarks = restoredState.bookmarks;
  } catch (err) { }
  return Object.assign({}, defaultBookmarkState, restoredState);
}
