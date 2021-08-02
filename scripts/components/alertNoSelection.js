import {
  crel,
} from '../utils/shortHands.js';
function createAlertNoSelection() {
  const panel = crel('div');
  panel.id = 'alertNoSelection';
  panel.className = 'alertNoSelection'
  panel.innerHTML = 'Select a Cell';
  return panel;
}

export default createAlertNoSelection;
