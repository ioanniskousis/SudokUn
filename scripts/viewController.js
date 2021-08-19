import {
  gel,
} from './utils/shortHands.js';

function showAlertNoSelection() {
  gel('alertNoSelection').style.visibility = 'visible';
}

function hideAlertNoSelection() {
  gel('alertNoSelection').style.visibility = 'hidden';
}

function showInvalidSelection(message) {
  gel('alertInvalidMessage').innerHTML = message;
  gel('alertInvalid').style.visibility = 'visible';
}

function hideInvalidSelection() {
  gel('alertInvalid').style.visibility = 'hidden';
}

function showPuzzInfo(store) {
  const pLevel = store.levelCaptions[store.selectedLevel];
  const pIndex = store.selectedIndex;
  gel('puzzleLevelLabel').innerHTML = pLevel;
  gel('puzzleIndexLabel').innerHTML = pIndex;
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

function showSettings() {
  gel('settingsViewContainer').style.visibility = 'visible';
  gel('settingsView').style.opacity = 1.0;
}

function hideSettings() {
  gel('settingsView').style.opacity = 0.0;
  setTimeout(() => {
    gel('settingsViewContainer').style.visibility = 'hidden';
  }, 300);
}

function showInstructions() {
  gel('instructionsViewContainer').style.visibility = 'visible';
  gel('instructionsView').style.opacity = 1.0;
}

function hideInstructions() {
  gel('instructionsView').style.opacity = 0.0;
  setTimeout(() => {
    gel('instructionsViewContainer').style.visibility = 'hidden';
  }, 300);
}

export {
  showAlertNoSelection,
  hideAlertNoSelection,
  showPuzzInfo,
  showFileSelector,
  hideFileSelector,
  showInvalidSelection,
  hideInvalidSelection,
  showSettings,
  hideSettings,
  showInstructions,
  hideInstructions,
}