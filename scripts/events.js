import {
  gel,
} from './utils/shortHands.js';

import {
  layout,
  clickOnGame,
  clickOnAllowMistakes,
  clickOnSelectors
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
} from './viewController.js';

import { createFileSelectorEvents } from './components/fileSelector.js';
import { createUndosEvents } from './components/controllers.js';
import { createSettingsEvents } from './components/settingsView.js';

function mainClick(e, game) {
  if ((game.focusedCellIndex > -1) && (!clickOnGame(e))) {
    game.focusCell(-1);
  }
}

function createCellsClick(game) {
  for (let i = 0; i < 81; i++) {
    const cell = gel(`cell-${i}`);
    cell.onclick = (e) => game.cellClick(e);
  }
}

function wKeyDown(event, game) {
  const fileSelectorIsVisible = gel('fileSelectorContainer').style.visibility === 'visible';
  if (fileSelectorIsVisible) return;

  hideAlertNoSelection();
  hideInvalidSelection();

  const keyCode = event.keyCode;
  if (keyCode === 27) {
    game.focusCell(-1);
    return;
  }
  if (keyCode == 9) {
    return;
  }
  if ((keyCode >= 37) && (keyCode <= 40) && (game.focusedCellIndex > -1)) {
    event.preventDefault();
    let selectedCellIndex = game.focusedCellIndex;
    if (keyCode == 37) {
      if (selectedCellIndex > 0){
        selectedCellIndex -= 1;
        let cell = gel(`cell-${selectedCellIndex}`);
        while ((selectedCellIndex > 0) && (game.isGiven(cell))) {
          selectedCellIndex -= 1;
          cell = gel(`cell-${selectedCellIndex}`);
        }
      }
    } else if (keyCode == 38) {
      if (selectedCellIndex > 8) {
        selectedCellIndex -= 9;
        let cell = gel(`cell-${selectedCellIndex}`);
        while ((selectedCellIndex > 8) && (game.isGiven(cell))) {
          selectedCellIndex -= 9;
          cell = gel(`cell-${selectedCellIndex}`);
        }
      }
    } else if (keyCode == 39) {
      if (selectedCellIndex < 80) {
        selectedCellIndex += 1;
        let cell = gel(`cell-${selectedCellIndex}`);
        while ((selectedCellIndex < 80) && (game.isGiven(cell))) {
          selectedCellIndex += 1;
          cell = gel(`cell-${selectedCellIndex}`);
        }
      }
    } else if (keyCode == 40) {
      if (selectedCellIndex < 72) {
        selectedCellIndex += 9;
        let cell = gel(`cell-${selectedCellIndex}`);
        while ((selectedCellIndex < 72) && (game.isGiven(cell))) {
          selectedCellIndex += 9;
          cell = gel(`cell-${selectedCellIndex}`);
        }
      }
    }
    const cell = gel(`cell-${selectedCellIndex}`);
    if (!game.isGiven(cell)) game.focusCell(selectedCellIndex);
    return ;
  }

  if ((keyCode === 8) || (keyCode === 46)) game.checkCell(0);

  let inputNumber = -1;
  if ((keyCode > 47) && (keyCode < 58)) inputNumber = keyCode - 48;
  if ((keyCode > 95) && (keyCode < 106)) inputNumber = keyCode - 96;

  if (inputNumber > -1) {
    if (game.focusedCellIndex > -1) {
      game.checkCell(inputNumber);
    } else {
      showAlertNoSelection();
    }
    return;
  }


}

function createEvents(game, store, loadPuzzle) {
  window.addEventListener('resize', () => layout());
  window.addEventListener('keydown', (e) => wKeyDown(e, game));
  gel('main').onclick = (e) => mainClick(e, game);
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

  createModeButtonEvents();
  createNumberButtonsEvents(game);
  createCandidateButtonsEvents(game);
  createCellsClick(game);
  createFileSelectorEvents(store, loadPuzzle);
  createUndosEvents(game);
  createSettingsEvents(store);

  layout();
}

export default createEvents;
