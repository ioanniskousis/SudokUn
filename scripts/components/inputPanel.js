import {
  crel,
  doc,
} from '../utils/shortHands.js';

function createInputPanel() {
  const panel = crel('div');
  panel.id = 'inputPanel';
  panel.className = 'numbers-panel';
  panel.draggable = 'true';

  return panel;
}

export default createInputPanel;
