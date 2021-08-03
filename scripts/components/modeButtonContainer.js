import {
  gel,
  crel,
  doc,
  swapCh,
  isCh,
} from '../utils/shortHands.js';
import { createControlButton } from './controlElements.js';

function createModeButtonContainer() {
  const panel = crel('div');
  panel.id = 'insertModeContainer';
  panel.className = 'insert-panel';

  doc(panel, createControlButton('insertModeButton', 'edit-white'));

  return panel;
}

export function createModeButtonEvents() {
  const insertModeButton = gel('insertModeButton');
  insertModeButton.onclick = (e) => {
    swapCh(insertModeButton)
    if (isCh(insertModeButton)) {
      insertModeButton.style.opacity = 1;
      insertModeButton.className = 'control-button edit-blue mode-checked';
      gel('numbersSelector').className = 'hidden';
      gel('candidatesSelector').className = 'insert-panel';
    } else {
      insertModeButton.style.opacity = 0.5;
      insertModeButton.className = 'control-button edit-white';
      gel('numbersSelector').className = 'insert-panel';
      gel('candidatesSelector').className = 'hidden';
    }
  };
}

export default createModeButtonContainer;
