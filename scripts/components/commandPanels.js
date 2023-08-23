import {
  gel,
  crel,
  doc,
} from '../utils/shortHands.js';
import { createCommandButton, createFileInfo } from './controlElements.js';
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
    alert('Search Feature - Under Construction');
  };
}

function createCommandPanels(playGround) {
  doc(playGround, createFilesPanel());
  doc(playGround, createTipsPanel());
  doc(playGround, createUndosPanel());
  doc(playGround, createRestartPanel());
  doc(playGround, createSettingsPanel());
}

export {
  createCommandPanels,
  createUndosEvents,
  createTipsPanelEvents,
}