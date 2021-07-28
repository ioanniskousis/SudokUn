import {
  crel,
  doc,
} from '../utils/shortHands.js';

function createInputPanel() {
  const panel = crel('div');
  panel.id = 'inputPanel';
  panel.className = 'buttons-panel';

  return panel;
}

export default createInputPanel;
