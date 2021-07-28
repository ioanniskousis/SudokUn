import {
  crel,
  doc,
} from '../utils/shortHands.js';

function createExcludePanel() {
  const panel = crel('div');
  panel.id = 'excludesPanel';
  panel.className = 'buttons-panel';

  return panel;
}

export default createExcludePanel;
