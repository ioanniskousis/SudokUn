import {
  crel,
  doc,
} from '../utils/shortHands.js';
import {
  createGrid,
 } from './grid.js';

import { createNumberSelectors } from './numberSelectors.js';
import { createAlertNoSelection, createAlertInvalid } from './alerts.js';

import { createCommandPanels } from './commandPanels.js';

function createPlayGround() {
  const playGround = crel('div');
  playGround.id = 'play-ground';

  doc(playGround, createGrid());
  createNumberSelectors(playGround);
  createCommandPanels(playGround);

  doc(playGround, createAlertNoSelection());
  doc(playGround, createAlertInvalid());
  
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
