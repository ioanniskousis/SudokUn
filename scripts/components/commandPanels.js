import {
  gel,
  crel,
  doc,
} from '../utils/shortHands.js';
import { createCommandButton, createFileInfo } from './controlElements.js';
import {
  createSearchNumberButton,
} from './numberSelectors.js'

// import {
//   showAlertNoSelection,
//   hideAlertNoSelection,
//   hideInvalidSelection,
//   showSettings,
//   hideSettings,
//   showInstructions,
//   hideInstructions,
// } from '../viewController.js';

function createUndosPanel(game) {
  const panel = crel('div');
  panel.id = 'undosController';
  panel.className = 'buttons-panel';

  doc(panel, createCommandButton('undoButton', 'undo'));
  doc(panel, createCommandButton('redoButton', 'redo'));

  return panel;
}

function createRestartPanel(game) {
  const panel = crel('div');
  panel.id = 'restartController';
  panel.className = 'buttons-panel';

  doc(panel, createCommandButton('restartButton', 'restart'));

  return panel;
}

function createTipsPanel() {
  const panel = crel('div');
  panel.id = 'tipsController';
  panel.className = 'buttons-panel';

  doc(panel, createCommandButton('advancedButton', 'bulb-white'));
  doc(panel, createCommandButton('searchButton', 'search-white'));

  return panel;
}

function createSearchPanel() {
  const panel = crel('div');
  panel.id = 'searchPanel';
  panel.className = 'insert-panel';

  for (let number = 1; number < 10; number++) {
    doc(panel, createSearchNumberButton(number));
  }

  return panel;
}

function createSettingsPanel() {
  const panel = crel('div');
  panel.id = 'settingsController';
  panel.className = 'buttons-panel';

  doc(panel, createCommandButton('settingsButton', 'settings-white'));
  doc(panel, createCommandButton('helpButton', 'help-white'));

  return panel;
}

function createFilesPanel() {
  const panel = crel('div');
  panel.id = 'fileController';
  panel.className = 'buttons-panel';

  doc(panel, createCommandButton('fileSelectorButton', 'grid-white'));
  doc(panel, createFileInfo('puzzleLevelLabel'));
  doc(panel, createFileInfo('puzzleIndexLabel'));

  return panel;
}

function createGameStatus() {
  const panel = crel('div');
  panel.id = 'gameStatus';
  panel.className = 'buttons-panel red';

  doc(panel, createFileInfo('remainters'));

  const equator = crel('div');
  equator.className = 'equator';
  doc(panel, equator);

  return panel;
}

function createUndosEvents(game) {
  gel('undoButton').onclick = (e) => game.undo();
  gel('redoButton').onclick = (e) => game.redo();

  gel('restartButton').onclick = (e) => game.restart();
  
  
}

function createTipsPanelEvents(game) {

  gel('advancedButton').onclick = (e) => {
    game.searchAdvancedTip(e)
  };

  gel('searchButton').onclick = (e) => {
    game.showSearch();
  };

  for (let i = 1; i < 10; i++) {
    gel(`search-button-${i}`).onclick = (e) => {
      game.searchNumber(i)
    }
  }
}

function createCommandPanels(playGround) {
  doc(playGround, createFilesPanel());
  doc(playGround, createTipsPanel());
  doc(playGround, createSearchPanel());
  doc(playGround, createUndosPanel());
  doc(playGround, createRestartPanel());
  doc(playGround, createSettingsPanel());
  doc(playGround, createGameStatus());
}

export {
  createCommandPanels,
  createUndosEvents,
  createTipsPanelEvents,
}