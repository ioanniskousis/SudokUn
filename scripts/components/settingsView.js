import {
  crel,
  doc,
  gel,
  sat,
} from '../utils/shortHands.js';
import {
  showSettings,
  hideSettings,
  showInstructions,
  hideInstructions,
} from '../viewController.js';
import { clickOnGrid } from '../layout.js';

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

  doc(container, createInstructionsView());

  return container;
}

export function createSettingsEvents(store) {
  gel('settingsButton').onclick = (e) => showSettings();

  gel('settingsViewContainer').onclick = (e) => {
    if (!clickOnGrid(e)) {
      hideSettings();
    }
  };

  gel('helpButton').onclick = (e) => {
    showInstructions();
  }

  gel('instructionsViewContainer').onclick = (e) => {
    if (!clickOnGrid(e)) {
      hideInstructions();
    }
  };

}

export {
  createSettingsViewContainer,
  createInstructionsViewContainer,
};