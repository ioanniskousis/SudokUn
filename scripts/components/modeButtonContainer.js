import {
  gel,
  crel,
  doc,
  swapCh,
  isCh,
} from '../utils/shortHands.js';
import createControlButton from './controlButton.js';

function createModeButtonContainer() {
  const panel = crel('div');
  panel.id = 'insertModeContainer';
  panel.className = 'insert-panel';

  doc(panel, createControlButton('insertModeButton', 'edit-white.png'));

  return panel;
}

export function createModeButtonEvents() {
  const insertModeButton = gel('insertModeButton');
  insertModeButton.onclick = (e) => {
    swapCh(insertModeButton)
    if (isCh(insertModeButton)) {
      insertModeButton.style.opacity = 1;
      insertModeButton.style.backgroundImage = "url('../../images/edit-blue.png')";
      insertModeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      gel('numbersSelector').className = 'hidden';
      gel('candidatesSelector').className = 'insert-panel';
    } else {
      insertModeButton.style.opacity = 0.5;
      insertModeButton.style.backgroundImage = "url('../../images/edit-white.png')";
      insertModeButton.style.backgroundColor = 'rgba(47, 111, 143, 0.5)';
      gel('numbersSelector').className = 'insert-panel';
      gel('candidatesSelector').className = 'hidden';
    }
  };
}

export default createModeButtonContainer;
