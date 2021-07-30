import {
  gel,
  doc,
} from '../utils/shortHands.js';
import createPlayGround from './playGround.js';
import createInputPanel from './inputPanel.js';
import createInputController from './inputController.js';
import Bounds from '../utils/bounds.js';

function createComponents() {
  doc(gel('main'), createPlayGround());
  doc(gel('main'), createInputPanel());

  setupDrag(gel('main'), gel('inputPanel'));
}


function setupDrag(container, inputPanel) {
  container.ondragover = (e) => {
    e.preventDefault();
  }

  container.ondrop = (e) => {
    e.preventDefault();
    const element = gel(e.dataTransfer.getData("element"));
    if (element) {
      const bounds = new Bounds();
      bounds.getRect(element);
      const leftShift = parseInt(e.dataTransfer.getData("leftShift"), 10);
      const topShift = parseInt(e.dataTransfer.getData("topShift"), 10);
      let top = e.clientY - topShift;
      if (top < 10) top = 10;
      if (top + bounds.height > window.innerHeight - 10) top = window.innerHeight - 10 - bounds.height;
      let left = e.clientX - leftShift;
      if (left < 10) left = 10;
      if (left + bounds.width > window.innerWidth - 10) left = window.innerWidth - 10 - bounds.width;
      element.style.top = `${top}px`;
      element.style.left = `${left}px`;
    }
  }

  inputPanel.ondragstart = (e) => {
    const inputRect = e.target.getBoundingClientRect();
    e.dataTransfer.setData("element", e.target.id);
    e.dataTransfer.setData("leftShift", e.clientX - inputRect.x);
    e.dataTransfer.setData("topShift", e.clientY - inputRect.y);
  }
}

export {
  createComponents,
};
