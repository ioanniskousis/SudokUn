import {
  gel,
} from './utils/shortHands.js';
import { layoutCanvas } from './layout.js'
import { removeTemporaryCandidates } from './advancedTools/advanced.js'

function showAlertNoSelection() {
  gel('alertNoSelection').style.visibility = 'visible';
}

function hideAlertNoSelection() {
  gel('alertNoSelection').style.visibility = 'hidden';
}

function showInvalidSelection(message) {
  gel('alertInvalidMessage').innerHTML = message;
  gel('alertInvalid').style.display = 'block';
  gel('alertInvalidCheckContainer').style.visibility = 'visible';
}

function showNoToolFound() {
  gel('alertInvalidMessage').innerHTML = 'No tool found';
  gel('alertInvalid').style.display = 'block';
  gel('alertInvalidCheckContainer').style.visibility = 'hidden';
}

function hideInvalidSelection() {
  gel('alertInvalid').style.display = 'none';
}

function showPuzzleInfo(store) {
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

function showCanvas() {
  gel('canvasContainer').style.visibility = 'visible';
  gel('canvasView').style.opacity = 1.0;
}

function hideCanvas() {
  gel('canvasView').style.opacity = 0.0;
  setTimeout(() => {
    gel('canvasContainer').style.visibility = 'hidden';
  }, 300);

  layoutCanvas();
  removeTemporaryCandidates();
}


export {
  showAlertNoSelection,
  hideAlertNoSelection,
  showPuzzleInfo,
  showFileSelector,
  hideFileSelector,
  showInvalidSelection,
  hideInvalidSelection,
  showSettings,
  hideSettings,
  showInstructions,
  hideInstructions,
  showCanvas,
  hideCanvas,
  showNoToolFound,
}