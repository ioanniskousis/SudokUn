import {
  gel,
  crel,
  doc,
} from '../utils/shortHands.js';
import createControlButton from './controlButton.js';

function createInputController() {
  const panel = crel('div');
  panel.id = 'inputController';
  panel.className = 'buttons-panel';

  doc(panel, createControlButton('numbersInputButton', 'grid-white.png'));
  doc(panel, createControlButton('candidatesSelectButton', 'edit-white.png'));
  doc(panel, createControlButton('candidatesExcludeButton', 'delete-white.png'));

  return panel;
}

export default createInputController;
