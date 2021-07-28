import {
  crel,
  doc,
} from '../utils/shortHands.js';

function createCandidatesPanel() {
  const panel = crel('div');
  panel.id = 'candidatesPanel';
  panel.className = 'buttons-panel';

  return panel;
}

export default createCandidatesPanel;
