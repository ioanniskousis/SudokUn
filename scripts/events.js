import {
  gel, isCh,
} from './utils/shortHands.js';

import {
  layout,
  clickOnGame,
  clickOnAllowMistakes,
  clickOnGrid,
  clickOnSelectors,
  clickOnSearchPanel,
  clickOnAdvancedButton,
} from './layout.js';

import {
  createModeButtonEvents,
  createNumberButtonsEvents,
  createCandidateButtonsEvents,
} from './components/numberSelectors.js';

import {
  showAlertNoSelection,
  hideAlertNoSelection,
  hideInvalidSelection,
  showSettings,
  hideSettings,
  showInstructions,
  hideInstructions,
} from './viewController.js';

import { createFileSelectorEvents } from './components/fileSelector.js';
import { createUndosEvents, createTipsPanelEvents } from './components/commandPanels.js';
// import { hideCanvas } from './viewController.js';

const MAX_INDEX = 80
const KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40;
const KEY_BACK = 8, KEY_TAB = 9, KEY_ESC = 27, KEY_DELETE = 46, KEY_ZERO = 48, KEY_NINE = 57;
const LAST_ROW_FIRST_CELL = 72;
const FIRST_ROW_LAST_CELL = 8;
const ONE_COLUMN = 1, ROW_SIZE = 9, NO_CELL = -1, NO_NUMBER = -1;
const XNUM_KEYBOARD_START = 96, XNUM_KEYBOARD_END = 105;

function mainClick(e, game) {
  if ((game.focusedCellIndex > NO_CELL) && (!clickOnGame(e))) {
    game.focusCell(NO_CELL);
  }
  if (isCh(gel('searchButton'))) {
    if (!clickOnSearchPanel(e)) {
      game.hideSearch()
    }
  }
  // if (clickOnAdvancedButton(e)) {
  //   setTimeout(() => {
  //     game.searchAdvancedTip(e);
  //   }, 500);
  // }
}

function createCellsClick(game) {
  for (let i = 0; i <= MAX_INDEX; i++) {
    const cell = game.cells[i];
    cell.onclick = (e) => game.cellClick(cell);
  }
}

function wKeyDown(event, game) {
  const fileSelectorIsVisible = gel('fileSelectorContainer').style.visibility === 'visible';
  if (fileSelectorIsVisible) return;

  hideAlertNoSelection();
  hideInvalidSelection();

  const keyCode = event.keyCode;
  if (keyCode === KEY_ESC) {
    game.focusCell(NO_CELL);
    return;
  }
  if (keyCode == KEY_TAB) {
    return;
  }
  if ((keyCode >= KEY_LEFT) && (keyCode <= KEY_DOWN) && (game.focusedCellIndex > -1)) {
    event.preventDefault();
    let selectedCellIndex = game.focusedCellIndex;
    if (keyCode == KEY_LEFT) {
      if (selectedCellIndex > 0){
        selectedCellIndex -= ONE_COLUMN;
        let cell = game.cells[selectedCellIndex];
        while ((selectedCellIndex > 0) && (game.isGiven(cell))) {
          selectedCellIndex -= ONE_COLUMN;
          cell = game.cells[selectedCellIndex];
        }
      }
    } else if (keyCode == KEY_UP) {
      if (selectedCellIndex > FIRST_ROW_LAST_CELL) {
        selectedCellIndex -= ROW_SIZE;
        let cell = game.cells[selectedCellIndex];
        while ((selectedCellIndex > FIRST_ROW_LAST_CELL) && (game.isGiven(cell))) {
          selectedCellIndex -= ROW_SIZE;
          cell = gel(`cell-${selectedCellIndex}`);
        }
      }
    } else if (keyCode == KEY_RIGHT) {
      if (selectedCellIndex < MAX_INDEX) {
        selectedCellIndex += ONE_COLUMN;
        let cell = gel(`cell-${selectedCellIndex}`);
        while ((selectedCellIndex < MAX_INDEX) && (game.isGiven(cell))) {
          selectedCellIndex += ONE_COLUMN;
          cell = gel(`cell-${selectedCellIndex}`);
        }
      }
    } else if (keyCode == KEY_DOWN) {
      if (selectedCellIndex < LAST_ROW_FIRST_CELL) {
        selectedCellIndex += ROW_SIZE;
        let cell = gel(`cell-${selectedCellIndex}`);
        while ((selectedCellIndex < LAST_ROW_FIRST_CELL) && (game.isGiven(cell))) {
          selectedCellIndex += ROW_SIZE;
          cell = gel(`cell-${selectedCellIndex}`);
        }
      }
    }
    const cell = gel(`cell-${selectedCellIndex}`);
    if (!game.isGiven(cell)) game.focusCell(selectedCellIndex);
    return ;
  }

  if ((keyCode === KEY_BACK) || (keyCode === KEY_DELETE)) game.checkCell(0);

  let inputNumber = NO_NUMBER;
  if ((keyCode >= KEY_ZERO) && (keyCode <= KEY_NINE)) inputNumber = keyCode - KEY_ZERO;
  if ((keyCode >= XNUM_KEYBOARD_START) && (keyCode <= XNUM_KEYBOARD_END)) inputNumber = keyCode - XNUM_KEYBOARD_START;

  if (inputNumber > NO_NUMBER) {
    if (game.focusedCellIndex > NO_CELL) {
      game.checkCell(inputNumber);
    } else {
      showAlertNoSelection();
    }
    return;
  }

}

function createSettingsEvents(store) {
  gel('settingsButton').onclick = (e) => showSettings();



  gel('helpButton').onclick = (e) => {
    showInstructions();
  }

}

function createEvents(game, store, loadPuzzle) {
  window.addEventListener('resize', () => layout());
  window.addEventListener('keydown', (e) => wKeyDown(e, game));
  
  gel('alertNoSelection').onclick = (e) => hideAlertNoSelection();
  gel('alertInvalid').onclick = (e) => {
    if (!clickOnAllowMistakes(e)) hideInvalidSelection();
  };
  gel('alertInvalidCheckBox').onclick = (e) => {
    store.allowMistakes = e.target.checked;
    store.storeValue('allowMistakes', e.target.checked ? '1' : '0');
    gel('allowMistakesCheck').checked = store.allowMistakes;
  };
  gel('allowMistakesCheck').onclick = (e) => {
    store.allowMistakes = e.target.checked;
    store.storeValue('allowMistakes', e.target.checked ? '1' : '0');
    gel('alertInvalidCheckBox').checked = store.allowMistakes;
  };
  gel('showAllValideCandidates').onclick = (e) => {
    game.showAllValideCandidates();
    hideSettings();
  };

  createModeButtonEvents();
  createNumberButtonsEvents(game);
  createCandidateButtonsEvents(game);
  createCellsClick(game);
  createFileSelectorEvents(store, loadPuzzle);
  createUndosEvents(game);
  createSettingsEvents(store);
  createTipsPanelEvents(game);

  layout();
}

export {
  createEvents,
  mainClick,
}
