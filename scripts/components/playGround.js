import {
  crel,
  doc,
} from '../utils/shortHands.js';
import createGrid from './grid.js';
import createFileController from './fileController.js';
import createTipsController from './tipsController.js';
import createSearchController from './searchController.js';
import createNumbersSelector from './numbersSelector.js';
import createCandidatesSelector from './candidatesSelector.js';
import createModeButtonContainer from './modeButtonContainer.js';
import createAlertNoSelection from './alertNoSelection.js';
import { createUndosController, createRestartController } from './undosController.js';

function createPlayGround() {
  const playGround = crel('div');
  playGround.id = 'play-ground';

  doc(playGround, createGrid());
  doc(playGround, createNumbersSelector());
  doc(playGround, createCandidatesSelector());

  doc(playGround, createFileController());
  doc(playGround, createTipsController());
  doc(playGround, createUndosController());
  doc(playGround, createRestartController());
  
  doc(playGround, createModeButtonContainer());

  doc(playGround, createAlertNoSelection());
  
  doc(playGround, createDebugBox());

  return playGround;
}

function createDebugBox() {
  const box = crel('textarea');
  box.id = 'debugBox';
  box.style.position = 'absolute';
  box.style.visibility = 'hidden';
  
  return box;
}

export default createPlayGround;
