import {
  crel,
  doc,
} from '../utils/shortHands.js';

function createSearchPanel() {
  const panel = crel('div');
  panel.id = 'searchPanel';
  panel.className = 'buttons-panel';

  return panel;
}

export default createSearchPanel;
