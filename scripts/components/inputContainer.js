import { crel, doc, gel } from '../utils/shortHands.js';
import Bounds from '../utils/bounds.js';
import createInputPanel from './inputPanel.js';

function createInputContainer() {
  const container = crel('div');
  container.id = 'inputContainer';
  container.className = 'control-container';
  
  const inputPanel = createInputPanel();
  doc(container, inputPanel);

  setupDrag(container, inputPanel);

  return container;
}

function setupDrag(container, inputPanel) {
  container.onmousedown = (e) => {
    const p = { x: e.clientX, y: e.clientY};
    const bounds = new Bounds();
    bounds.getRect(inputPanel);
    if (!bounds.contains(p.x, p.y)) {
      container.style.visibility = 'hidden';
      container.style.display = 'none';
    }
  }

  container.ondragover = (e) => {
    e.preventDefault();
  }

  container.ondrop = (e) => {
    e.preventDefault();
    const element = gel(e.dataTransfer.getData("element"));
    if (element) {
      const leftShift = parseInt(e.dataTransfer.getData("leftShift"), 10);
      const topShift = parseInt(e.dataTransfer.getData("topShift"), 10);
      element.style.top = (e.clientY - topShift).toString() + "px";
      element.style.left = (e.clientX - leftShift).toString() + "px";
    }
  }

  inputPanel.ondragstart = (e) => {
    const calendar_rect = e.target.getBoundingClientRect();
    e.dataTransfer.setData("element", e.target.id);
    e.dataTransfer.setData("leftShift", e.clientX - calendar_rect.x);
    e.dataTransfer.setData("topShift", e.clientY - calendar_rect.y);
  }
}

export default createInputContainer;
