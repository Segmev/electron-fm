import "../stylesheets/bulma.css";
import "../stylesheets/main.css";

import fileTable from '../components/file_list';
import searchPath from '../components/search_path';
import sideMenu from '../components/side_menu';
import tabs from '../components/tabs';
import progressBar from '../components/progress_bar';
import alertModal from '../components/alert_modal';
import { el, mount } from "redom";

class MainPanel {
  constructor() {
    this.el = el('.column',
      tabs, fileTable
    );
  }
}

class WinContainer {
  constructor() {
    this.el = el('section.section',
      alertModal,
      el('.container',
        searchPath,
        progressBar,
        el('.columns',
          sideMenu,
          new MainPanel(),
        ))
    );
  }
}

const mainWindow = new WinContainer();

mount(document.body, mainWindow);
