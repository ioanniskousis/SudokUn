import {
  crel,
  doc,
} from '../utils/shortHands.js';
import createGrid from './grid.js';
import createInputController from './inputController.js';
import createTipsController from './tipsController.js';

function createPlayGround() {
  const playGround = crel('div');
  playGround.id = 'play-ground';

  doc(playGround, createGrid());
  doc(playGround, createInputController());
  doc(playGround, createTipsController());

  return playGround;
}

export default createPlayGround;
