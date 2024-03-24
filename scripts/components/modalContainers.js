import {
  crel,
  doc,
  gel,
  sat,
} from '../utils/shortHands.js';
import { hideSettings, hideInstructions, hideCanvas } from '../viewController.js';
import { clickOnGrid, clickOnPlayground } from '../layout.js';

function createSettingsView() {
  const view = crel('div');
  view.id = 'settingsView';
  view.className = 'popup';

  const allowMistakes = crel('div');
  allowMistakes.className = 'selectorItem';

  const allowMistakesLabel = crel('label');
  allowMistakesLabel.className = 'selectorItemLabel';
  allowMistakesLabel.innerHTML = 'Allow mistakes';
  sat(allowMistakesLabel, 'for', 'allowMistakesCheck');
  doc(allowMistakes, allowMistakesLabel);

  const allowMistakesCheck = crel('input');
  sat(allowMistakesCheck, 'type', 'checkbox');
  allowMistakesCheck.className = 'custom-checkbox';
  allowMistakesCheck.id = 'allowMistakesCheck';

  doc(allowMistakes, allowMistakesCheck);

  const showAllValidCandidates = crel('input');
  sat(showAllValidCandidates, 'type', 'button');
  showAllValidCandidates.className = 'selectorItem settingsCommand';
  showAllValidCandidates.id = 'showAllValideCandidates';
  showAllValidCandidates.value = 'Show All Valid Candidates';

  doc(view, allowMistakes);
  doc(view, showAllValidCandidates);

  return view;
}

function createSettingsViewContainer() {
  const container = crel('div');
  container.id = 'settingsViewContainer';
  container.className = 'backViewContainer';
  
  container.onclick = (e) => {
    if (!clickOnGrid(e)) {
      hideSettings();
    }
  };

  doc(container, createSettingsView());

  return container;
}

function createInstructionsView() {
  const view = crel('div');
  view.id = 'instructionsView';
  view.className = 'popup';


  return view;
}

function createInstructionsViewContainer() {
  const container = crel('div');
  container.id = 'instructionsViewContainer';
  container.className = 'backViewContainer';
  container.onclick = (e) => {
    if (!clickOnGrid(e)) {
      hideInstructions();
    }
  };

  doc(container, createInstructionsView());

  return container;
}

function createCanvasContainer() {
  const container = crel('div');
  container.id = 'canvasContainer';
  container.className = 'backViewContainer';
  // container.style.backgroundColor = 'rgba(51, 119, 153, 0.1)';
  container.onclick = (e) => {
    // if (!clickOnPlayground(e)) {
      hideCanvas();
    // }
  };

  doc(container, createCanvasView());

  return container;
}

function createCanvasView() {
  const view = crel('canvas');
  view.id = 'canvasView';
  // view.className = 'popup';
  // view.style.backgroundColor = 'transparent'
  // view.style.backgroundColor = 'rgba(200, 250, 200, 0.4)';


  return view;
}

function createTipCloud() {
  const container = crel('div');
  container.id = 'tipCloud';
  // container.style.backgroundColor = 'rgba(51, 119, 153, 0.1)';
  container.onclick = (e) => {
    hideCanvas();
  };

  // doc(container, createCanvasView());

  return container;
}

export {
  createSettingsViewContainer,
  createInstructionsViewContainer,
  createCanvasContainer,
  createTipCloud,
};
