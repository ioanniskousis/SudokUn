import {
  crel,
  doc,
  gel,
} from '../utils/shortHands.js';
import { showFileSelector, hideFileSelector } from '../viewController.js';
import { clickOnGrid } from '../layout.js';
import { createShiftButton, createIndexInput, createPlayButton } from './controlElements.js';

function createLevelSelector(level) {
  const levelSelector = crel('div');
  levelSelector.id = `levelSelector-${level}`;
  levelSelector.className = 'levelSelector';

  const levelLabel = crel('div');
  levelLabel.id = `levelLabel-${level}`;
  levelLabel.className = 'levelLabel';
  doc(levelSelector, levelLabel);

  const shiftLeft = createShiftButton(`levelShiftLeft-${level}`, 'shift-left');
  doc(levelSelector, shiftLeft);

  const indexInput = createIndexInput(level);
  doc(levelSelector, indexInput);

  const shiftRight = createShiftButton(`levelShiftRight-${level}`, 'shift-right');
  doc(levelSelector, shiftRight);

  const playButton = createPlayButton(level);
  doc(levelSelector, playButton);

  return levelSelector;
}

function createFileSelector() {
  const selector = crel('div');
  selector.id = 'fileSelector';

  for (let i = 0; i < 5; i++) {
    doc(selector, createLevelSelector(i));
  }
  return selector;
}

function createFileSelectorContainer() {
  const container = crel('div');
  container.id = 'fileSelectorContainer';

  doc(container, createFileSelector());

  return container;
}

export function createFileSelectorEvents(store, loadPuzzle) {
  gel('fileSelectorButton').onclick = (e) => showFileSelector();

  gel('fileSelectorContainer').onclick = (e) => {
    if (!clickOnGrid(e)) {
      hideFileSelector();
    }
  };

  for (let i = 0; i < 5; i++) {
    gel(`levelShiftLeft-${i}`).onclick = (e) => {
      const index = parseInt(gel(`indexInput-${i}`).value, 10);
      if (index > 1) {
        gel(`indexInput-${i}`).value = index - 1;
      }
    }

    gel(`levelShiftRight-${i}`).onclick = (e) => {
      const index = parseInt(gel(`indexInput-${i}`).value, 10);
      if (index < store.levelLimits[i]) {
        gel(`indexInput-${i}`).value = index + 1;
      }
    }
    
    gel(`indexInput-${i}`).onblur = (e) => {
      const index = parseInt(gel(`indexInput-${i}`).value, 10);
      if (Number.isNaN(index)) {
        gel(`indexInput-${i}`).value = 1;
      }
      if (index > store.levelLimits[i]) {
        gel(`indexInput-${i}`).value = store.levelLimits[i];
      }
    }

    gel(`playButton-${i}`).onclick = (e) => {
      const index = parseInt(gel(`indexInput-${i}`).value, 10);
      store.selectedLevel = i;
      store.selectedIndex = index;
      loadPuzzle(true);
      hideFileSelector();
    }
  }
}

export default createFileSelectorContainer;
