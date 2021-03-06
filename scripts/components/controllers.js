import {
  gel,
  crel,
  doc,
} from '../utils/shortHands.js';
import { createControlButton, createFileInfo } from './controlElements.js';

function createUndosController() {
  const panel = crel('div');
  panel.id = 'undosController';
  panel.className = 'buttons-panel';

  doc(panel, createControlButton('undoButton', 'undo'));
  doc(panel, createControlButton('redoButton', 'redo'));

  return panel;
}

function createRestartController() {
  const panel = crel('div');
  panel.id = 'restartController';
  panel.className = 'buttons-panel';

  doc(panel, createControlButton('restartButton', 'restart'));

  return panel;
}

function createTipsController() {
  const panel = crel('div');
  panel.id = 'tipsController';
  panel.className = 'buttons-panel';

  doc(panel, createControlButton('advancedButton', 'bulb-white'));
  doc(panel, createControlButton('searchButton', 'search-white'));

  return panel;
}

function createSettingsController() {
  const panel = crel('div');
  panel.id = 'settingsController';
  panel.className = 'buttons-panel';

  doc(panel, createControlButton('settingsButton', 'settings-white'));
  doc(panel, createControlButton('helpButton', 'help-white'));

  return panel;
}

function createFileController() {
  const panel = crel('div');
  panel.id = 'fileController';
  panel.className = 'buttons-panel';

  doc(panel, createControlButton('fileSelectorButton', 'grid-white'));
  doc(panel, createFileInfo('puzzleLevelLabel'));
  doc(panel, createFileInfo('puzzleIndexLabel'));

  return panel;
}

function createUndosEvents(game) {
  gel('undoButton').onclick = (e) => game.undo();
  gel('redoButton').onclick = (e) => game.redo();
  gel('restartButton').onclick = (e) => game.restart();
  
}

function createTipEvents() {
  gel('advancedButton').onclick = (e) => {
    alert('Advanced Features - Under Construction');
  };

  gel('searchButton').onclick = (e) => {
    alert('Search Feature - Under Construction');
  };
}

function createControllers(playGround) {
  doc(playGround, createFileController());
  doc(playGround, createTipsController());
  doc(playGround, createUndosController());
  doc(playGround, createRestartController());
  doc(playGround, createSettingsController());
}

export {
  createControllers,
  createUndosEvents,
  createTipEvents,
}