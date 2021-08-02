import {
  gel,
  gat,
  crel,
  doc,
} from '../utils/shortHands.js';
import createNumberButton from './numberButton.js';

function createNumbersSelector() {
  const panel = crel('div');
  panel.id = 'numbersSelector';
  panel.className = 'insert-panel';

  for (let i = 0; i < 10; i++) {
    doc(panel, createNumberButton(i));
  }

  return panel;
}

export function createNumberButtonsEvents(game) {
  for (let i = 0; i < 10; i++) {
    const button = gel(`number-button-${i}`);
    button.onclick = (e) => {
      game.checkCell(parseInt(gat(button, 'value')));
    }
  }
}

export default createNumbersSelector;
