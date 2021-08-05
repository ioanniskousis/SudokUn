import {
  crel,
  sat,
} from '../utils/shortHands.js';

function createControlButton(buttonId, imageClass) {
  const button = crel('button');
  button.className = `control-button ${imageClass}`;
  button.id = buttonId;
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

  return button;
}

function createIndexInput(level) {
  const input = crel('input');
  input.type = 'number';
  input.min = 1;
  input.className = 'indexInput';
  input.id = `indexInput-${level}`;
  sat(input, 'level', level);

  return input;
}

function createPlayButton(level) {
  const button = crel('button');
  button.className = 'playButton';
  button.id = `playButton-${level}`;
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
