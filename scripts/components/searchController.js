import {
  gel,
  crel,
  doc,
} from '../utils/shortHands.js';
import { createControlButton } from './controlElements.js';

function createSearchController() {
  const panel = crel('div');
  panel.id = 'searchController';
  panel.className = 'buttons-panel';

  doc(panel, createControlButton('searchButton', 'search-white'));

  return panel;
}

export default createSearchController;
