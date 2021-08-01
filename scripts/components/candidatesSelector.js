import {
  gel,
  gat,
  crel,
  doc,
  isCh,
  setCh,
  swapCh,
} from '../utils/shortHands.js';
import createCandidateButton from './candidateButton.js';

function createCandidatesSelector() {
  const panel = crel('div');
  panel.id = 'candidatesSelector';
  panel.className = 'insert-panel hidden';
  
  for (let i = 1; i < 10; i++) {
    doc(panel, createCandidateButton(i));
  }

  return panel;
}

export function setupCandidatesInput(cellIndex) {
  for (let i = 1; i < 10; i++) {
    const button = gel(`candidate-button-${i}`);
    if (cellIndex > -1) {
      const candidate = gel(`candidate-${cellIndex}-${i}`);
      button.className = isCh(candidate) ? 'candidate-button' : 'candidate-button halfOpac';
      setCh(button, isCh(candidate));
    } else {
      button.className = 'candidate-button halfOpac';
      setCh(button, false);
    }
  }
}

export function createCandidateButtonsEvents(gamePlay) {
  for (let i = 1; i < 10; i++) {
    const button = gel(`candidate-button-${i}`);
    button.onclick = (e) => {
      if (gamePlay.checkCandidate(parseInt(gat(button, 'value')), !isCh(button))) {
        swapCh(button);
        button.className = isCh(button) ? 'candidate-button' : 'candidate-button halfOpac';
      }
    }
  }
}

export default createCandidatesSelector;
