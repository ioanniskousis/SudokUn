import {
  gel,
  crel,
  doc,
} from '../utils/shortHands.js';
import createControlButton from './controlButton.js';

function createTipsController() {
  const panel = crel('div');
  panel.id = 'tipsController';
  panel.className = 'buttons-panel';

  doc(panel, createControlButton('advancedButton', 'bulb-white.png'));
  doc(panel, createControlButton('searchButton', 'search-white.png'));

  return panel;
}

export default createTipsController;
