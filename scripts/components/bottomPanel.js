import {
  crel,
  doc,
} from '../utils/shortHands.js';

function createBottomPanel() {
  const panel = crel('div');
  panel.id = 'bottomPanel';
  panel.className = 'buttons-panel';

  return panel;
}

export default createBottomPanel;
