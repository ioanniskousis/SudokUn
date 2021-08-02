import {
  gel,
} from './utils/shortHands.js';

function showAlertNoSelections() {
  gel('alertNoSelection').style.visibility = 'visible';
}

function hideAlertNoSelections() {
  gel('alertNoSelection').style.visibility = 'hidden';
}

function showPuzzleLevel(store) {
  const pLevel = store.levelCaptions[store.selectedLevel];
  const pIndex = store.selectedIndex;
  gel('puzzleLevelLabel').innerHTML = `${pLevel} ${pIndex}`;
}

export {
  showAlertNoSelections,
  hideAlertNoSelections,
  showPuzzleLevel,
}