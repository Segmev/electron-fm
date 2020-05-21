import { setAttr } from "redom";
import { el } from 'redom';
import { ipcRenderer } from "electron";
import { alertModalEvents } from '../events';

const { SHOW_MODAL } = alertModalEvents;

let messages = [];

class AlertModal {
  constructor() {
    this.closeBtn = el("button.delete.is-large");
    this.closeBtn.onclick = () => this.closeModal();
    this.content = el("", "test");
    this.el = el("#alert-modal.modal",
      el("#alert-content.modal-content",
        el(".notification.is-danger",
          this.closeBtn,
          this.content
        )
      )
    );
  }

  displayModal() {
    this.content.textContent = messages.pop();
    setAttr(this.el, {
      class: "modal is-active"
    });
  }

  closeModal() {
    if (messages.length > 0) {
      this.content.textContent = messages.pop();
    } else {
      setAttr(this.el, {
        class: "modal"
      });
    }
  }
}

const alertModal = new AlertModal();

ipcRenderer.on(SHOW_MODAL, (_ev, message) => {
  alertModal.hidden = false;
  messages.push(message);
  alertModal.displayModal();
})

export default alertModal;
