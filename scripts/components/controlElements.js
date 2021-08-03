import {
  crel,
  sat,
} from '../utils/shortHands.js';

function createControlButton(buttonId, imageClass) {
  const button = crel('button');
  button.className = `control-button ${imageClass}`;
  button.id = buttonId;
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

function createShiftButton(buttonId, classname) {
  const button = crel('button');
  button.className = classname;
  button.id = buttonId;
  button.style.border = 'none';

  return button;
}

function createIndexInput(level) {
  const input = crel('input');
  input.type = 'number';
  input.min = 1;
  input.className = 'indexInput';
  input.id = `indexInput-${level}`;
  input.style.border = 'none';
  sat(input, 'level', level);

  return input;
}

function createPlayButton(level) {
  const button = crel('button');
  button.className = 'playButton';
  button.id = `playButton-${level}`;
  button.style.border = 'none';
  button.innerHTML = 'Play';

  return button;
}

export {
  createControlButton,
  createFileInfo,
  createShiftButton,
  createIndexInput,
  createPlayButton,
}
