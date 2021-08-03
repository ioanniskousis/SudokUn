import {
  gel,
} from './utils/shortHands.js';

function showAlertNoSelections() {
  gel('alertNoSelection').style.visibility = 'visible';
}

function hideAlertNoSelections() {
  gel('alertNoSelection').style.visibility = 'hidden';
}

function showPuzzInfo(store) {
  const pLevel = store.levelCaptions[store.selectedLevel];
  const pIndex = store.selectedIndex;
  gel('puzzlelevelLabel').innerHTML = `${pLevel} ${pIndex}`;
}

function showFileSelector() {
  gel('fileSelectorContainer').style.visibility = 'visible';
  gel('fileSelector').style.opacity = 1.0;
}

function hideFileSelector() {
  gel('fileSelector').style.opacity = 0.0;
  setTimeout(() => {
    gel('fileSelectorContainer').style.visibility = 'hidden';
  }, 300);
}

export {
  showAlertNoSelections,
  hideAlertNoSelections,
  showPuzzInfo,
  showFileSelector,
  hideFileSelector,
}