// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Menu } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { fileMenuTemplate } from "./menu/file_menu_template";
import { editMenuTemplate } from './menu/edit_menu_template';
import { openNewWindow } from "./windows/file_manager_window";

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";

const setApplicationMenu = () => {
  const menus = [fileMenuTemplate, editMenuTemplate];
  if (env.name !== 'production') {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

if (env.name !== 'production') {
  const userDataPath = app.getPath('userData');
  app.setPath('userData', `${userDataPath} (${env.name})`);
}

app.on('ready', () => {
  setApplicationMenu();

  openNewWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});
