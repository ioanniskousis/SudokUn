import {
  crel,
  doc,
  gel,
} from '../utils/shortHands.js';
import { createControlButton } from './controlElements.js';

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

function createUndosEvents(game) {
  gel('undoButton').onclick = (e) => game.undo();
  gel('redoButton').onclick = (e) => game.redo();
  gel('restartButton').onclick = (e) => game.restart();
  
}

export {
  createUndosController,
  createRestartController,
  createUndosEvents,
};
