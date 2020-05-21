import { ipcRenderer, remote } from "electron";
import { el, list, setAttr, setStyle } from "redom";
import { fileListEvents, filesOperationEvents } from "../events";

const { UPDATE_FILE_LIST, CLICK_FILE } = fileListEvents;
const { SELECT_FILES_FROM, STORE_SELECTED_FILES } = filesOperationEvents;

let actualFilesInfo = [];
let selectedNames = new Set();

class Tr {
  constructor() {
    this.name = el('th');
    this.type = el('td');
    this.size = el('td');
    this.accessTime = el('td');

    this.el = el('tr',
      this.name, this.type, this.size, this.accessTime
    );
    this.el.onclick = ({ ctrlKey }) => {

      if (!ctrlKey) {
        selectedNames.clear();
      }
      selectedNames.add(this.name.textContent);
      updateList();
    };
  }

  set selected(isSelected) {
    setAttr(this.el, {
      class: isSelected ? 'is-selected' : ''
    })
  }

  update({ name, type = '', size = '', accessTime = '' }) {
    this.name.textContent = name;
    this.type.textContent = type;
    this.size.textContent = size;
    this.accessTime.textContent = accessTime;
    this.selected = !!selectedNames.has(name);

    this.el.ondblclick = () => sendClick(name);
  }
}

const resizeTable = () => {
  setStyle(filetable, {
    maxHeight: `${Math.floor(remote.getCurrentWindow().getSize()[1] * (3 / 78))}em`
  });
}

const thead = el('thead',
  el('th', 'Name'), el('th', 'Type'), el('th', 'Size'), el('th', 'Last access')
);
const tbody = list('tbody', Tr);
const filetable = el('.table-container.is-fullwidth', el('table#file-table.table.is-block',
  thead, tbody
));

const sendClick = (filename) => {
  ipcRenderer.send(CLICK_FILE, filename);
}

const updateList = () => {
  tbody.update(actualFilesInfo);
}

ipcRenderer.on(UPDATE_FILE_LIST, (_ev, filesinfo) => {
  actualFilesInfo = filesinfo;
  selectedNames.clear();
  updateList();
})

ipcRenderer.on(SELECT_FILES_FROM, (_ev) => {
  ipcRenderer.send(STORE_SELECTED_FILES, selectedNames);
});

remote.getCurrentWindow().on('resize', () => {
  resizeTable();
});

resizeTable();

export default filetable;
