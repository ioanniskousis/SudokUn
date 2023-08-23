import {
  gel,
  gat,
  sat,
  crel,
  doc,
  swapCh,
  isCh,
  setCh,
  isEx,
} from '../utils/shortHands.js';
import { createCommandButton } from './controlElements.js';
import { hideCanvas } from '../viewController.js'

function createNumberButton(number) {
  const button = crel('button');
  button.className = 'number-button';
  button.id = `number-button-${number}`;
  button.style.border = 'none';
  button.innerHTML = number || '';
  button.style.padding = '0';
  sat(button, 'value', number);

  return button;
}

function createCandidateButton(number) {
  const button = crel('button');
  button.className = 'candidate-button';
  button.id = `candidate-button-${number}`;
  button.innerHTML = number;
  sat(button, 'value', number);

  return button;
}

function createExcludeButton(number) {
  const button = crel('button');
  button.className = 'exclude-button';
  button.id = `exclude-button-${number}`;
  button.style.border = 'none';
  button.innerHTML = number;
  button.style.padding = '0';
  sat(button, 'value', number);

  return button;
}

function createModeButtonContainer() {
  const panel = crel('div');
  panel.id = 'insertModeContainer';
  panel.style.zIndex = "12"
  panel.className = 'insert-panel';

  doc(panel, createCommandButton('insertModeButton', 'edit-white'));

  return panel;
}

function createExcludeButtonContainer() {
  const panel = crel('div');
  panel.id = 'excludeModeButtonContainer';
  panel.style.zIndex = "12"
  panel.className = 'insert-panel';

  doc(panel, createCommandButton('excludeModeButton', 'xmark-white'));

  return panel;
}

function createNumbersSelector() {
  const panel = crel('div');
  panel.id = 'numbersSelector';
  panel.className = 'insert-panel';
  panel.style.zIndex = "11"

  for (let i = 0; i < 10; i++) {
    doc(panel, createNumberButton(i));
  }

  return panel;
}

function createCandidatesSelector() {
  const panel = crel('div');
  panel.id = 'candidatesSelector';
  panel.className = 'insert-panel hidden';
  panel.style.zIndex = "11"

  for (let i = 1; i < 10; i++) {
    doc(panel, createCandidateButton(i));
  }

  return panel;
}

function createExcludesSelector() {
  const panel = crel('div');
  panel.id = 'excludesSelector';
  panel.className = 'insert-panel hidden';
  panel.style.zIndex = "11"

  for (let i = 1; i < 10; i++) {
    doc(panel, createExcludeButton(i));
  }

  return panel;
}

function createNumberButtonsEvents(game) {
  for (let i = 0; i < 10; i++) {
    const button = gel(`number-button-${i}`);
    button.onclick = (e) => {
      game.checkCell(parseInt(gat(button, 'value')));
      hideCanvas();
    }
  }
}

function setupCandidatesInput(cellIndex) {
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

function setupExcludesInput(cellIndex) {
  for (let i = 1; i < 10; i++) {
    const button = gel(`exclude-button-${i}`);
    if (cellIndex > -1) {
      const candidate = gel(`candidate-${cellIndex}-${i}`);
      button.className = isEx(candidate) ? 'exclude-button' : 'exclude-button halfOpac';
      setCh(button, isEx(candidate));
    } else {
      button.className = 'exclude-button halfOpac';
      setCh(button, false);
    }
  }
}

function createCandidateButtonsEvents(game) {
  for (let i = 1; i < 10; i++) {
    const candidateButton = gel(`candidate-button-${i}`);
    candidateButton.onclick = (e) => {
      if (game.checkCandidate(parseInt(gat(candidateButton, 'value')), !isCh(candidateButton))) {
        // swapCh(button);
        // button.className = isCh(button) ? 'candidate-button' : 'candidate-button halfOpac';
      }
    }

    const excludeButton = gel(`exclude-button-${i}`);
    excludeButton.onclick = (e) => {
      if (game.checkExclude(parseInt(gat(excludeButton, 'value')), !isCh(excludeButton))) {
        // swapCh(button);
        // button.className = isCh(button) ? 'exclude-button' : 'exclude-button halfOpac';
      }
    }
  }
}

function useNumbersSelector() {
  setCh(gel('insertModeButton'), false);
  setCh(gel('excludeModeButton'), false);

  gel('insertModeButton').style.opacity = 0.5;
  gel('insertModeButton').className = 'control-button edit-white';
  gel('excludeModeButton').style.opacity = 0.5;
  gel('excludeModeButton').className = 'control-button xmark-white';

  gel('numbersSelector').className = 'insert-panel';
  gel('candidatesSelector').className = 'hidden';
  gel('excludesSelector').className = 'hidden';
}

function useCandidatesSelector() {
  setCh(gel('insertModeButton'), true);
  setCh(gel('excludeModeButton'), false);

  gel('insertModeButton').style.opacity = 1;
  gel('insertModeButton').className = 'control-button edit-blue mode-checked';
  gel('excludeModeButton').style.opacity = 0.5;
  gel('excludeModeButton').className = 'control-button xmark-white';

  gel('numbersSelector').className = 'hidden';
  gel('candidatesSelector').className = 'insert-panel';
  gel('excludesSelector').className = 'hidden';
}

function useExcludesSelector() {
  setCh(gel('insertModeButton'), false);
  setCh(gel('excludeModeButton'), true);

  gel('insertModeButton').style.opacity = 0.5;
  gel('insertModeButton').className = 'control-button edit-white';
  gel('excludeModeButton').style.opacity = 1;
  gel('excludeModeButton').className = 'control-button xmark-blue mode-checked';

  gel('numbersSelector').className = 'hidden';
  gel('candidatesSelector').className = 'hidden';
  gel('excludesSelector').className = 'insert-panel';
}

function createModeButtonEvents() {
  const insertModeButton = gel('insertModeButton');
  const excludeModeButton = gel('excludeModeButton');

  insertModeButton.onclick = (e) => {
    swapCh(insertModeButton)
    if (isCh(insertModeButton)) {
      useCandidatesSelector();
    } else {
      useNumbersSelector();
    }
  };

  excludeModeButton.onclick = (e) => {
    swapCh(excludeModeButton)
    if (isCh(excludeModeButton)) {
      useExcludesSelector();
    } else {
      useNumbersSelector();
    }
  };
}

function createNumberSelectors(playGround) {
  doc(playGround, createNumbersSelector());
  doc(playGround, createCandidatesSelector());
  doc(playGround, createExcludesSelector());
  doc(playGround, createModeButtonContainer());
  doc(playGround, createExcludeButtonContainer());
}

export {
  createNumberSelectors,
  createNumberButtonsEvents,
  setupCandidatesInput,
  setupExcludesInput,
  createCandidateButtonsEvents,
  createModeButtonEvents,
};
