import {
  crel,
  sat,
} from '../utils/shortHands.js';

function createControlButton(buttonId, image) {
  const button = crel('button');
  button.className = 'control-button';
  button.id = buttonId;
  button.style.backgroundImage = `url('../../images/${image}')`;
  button.style.border = 'none';
  sat(button, 'checked', '0');

  return button;
}

function createFileInfo(id) {
  const div = crel('div');
  div.id = id;
  div.className = 'file-info';

  return div;
}

export {
  createControlButton,
  createFileInfo,
}
