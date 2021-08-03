import {
  gel,
  crel,
  doc,
} from '../utils/shortHands.js';
import { createControlButton } from './controlElements.js';

function createTipsController() {
  const panel = crel('div');
  panel.id = 'tipsController';
  panel.className = 'buttons-panel';

  doc(panel, createControlButton('advancedButton', 'bulb-white'));
  doc(panel, createControlButton('searchButton', 'search-white'));

  return panel;
}

export default createTipsController;
