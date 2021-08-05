import {
  crel,
  doc,
  gel,
  sat,
} from '../utils/shortHands.js';
import { showSettings, hideSettings } from '../viewController.js';
import { clickOnGrid } from '../layout.js';

function createSettingsView() {
  const selector = crel('div');
  selector.id = 'settingsView';
  selector.className = 'popup';

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

  doc(selector, allowMistakes);

  return selector;
}

function createSettingsViewContainer() {
  const container = crel('div');
  container.id = 'settingsViewContainer';
  container.className = 'backViewContainer';

  doc(container, createSettingsView());

  return container;
}

export function createSettingsEvents(store) {
  gel('settingsButton').onclick = (e) => showSettings();

  gel('settingsViewContainer').onclick = (e) => {
    if (!clickOnGrid(e)) {
      hideSettings();
    }
  };

}

export default createSettingsViewContainer;