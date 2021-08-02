import {
  gel,
} from './utils/shortHands.js';

import { layout, clickOnGame, clickOnSelectors } from './layout.js';
import { createModeButtonEvents } from './components/modeButtonContainer.js';
import { createNumberButtonsEvents } from './components/numbersSelector.js';
import { createCandidateButtonsEvents } from './components/candidatesSelector.js';
import { showAlertNoSelections, hideAlertNoSelections } from './viewController.js';

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
  hideAlertNoSelections();

  const keyCode = event.keyCode;
  // alert(keyCode);
  if (keyCode === 27) {
    event.preventDefault();
    game.escape();
    return;
  }
  if (keyCode == 9) {
    event.preventDefault();
    return;
  }
  if ((keyCode == 32) || (keyCode == 33) || (keyCode == 34)) {
    event.preventDefault();
  }
  if ((keyCode >= 37) && (keyCode <= 40)) {
    event.preventDefault();
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

  // if ((keyCode == 46) || (keyCode == 32) || (keyCode == 48) || (keyCode == 96)) {
  //   event.preventDefault();
  //   if (_gAttEl(selectedCell, 'prevValue') == '') {
  //     return;
  //   }
  //   selectedCell.value = '';
  //   cellBlur(selectedCell);
  //   return ;
  // }
  if ((keyCode === 8) || (keyCode === 46)) game.checkCell(0);

  let inputNumber = -1;
  if ((keyCode > 47) && (keyCode < 58)) inputNumber = keyCode - 48;
  if ((keyCode > 95) && (keyCode < 106)) inputNumber = keyCode - 96;

  if (inputNumber > -1) {
    if (game.focusedCellIndex > -1) {
      var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      game.checkCell(parseInt(chars[inputNumber], 10));
    } else {
      showAlertNoSelections();
    }
    return;
  }


}

function createEvents(game) {
  window.addEventListener('resize', () => layout());
  window.addEventListener('keydown', (e) => wKeyDown(e, game));
  gel('main').onclick = (e) => mainClick(e, game);
  gel('alertNoSelection').onclick = (e) => hideAlertNoSelections();
  
  createModeButtonEvents();
  createNumberButtonsEvents(game);
  createCandidateButtonsEvents(game);
  createCellsClick(game);

  layout();
}

export default createEvents;
