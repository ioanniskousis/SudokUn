import {
  crel,
  doc,
} from '../utils/shortHands.js';

function createInputController() {
  const panel = crel('div');
  panel.id = 'inputController';
  panel.className = 'buttons-panel';

  return panel;
}

export default createInputController;
