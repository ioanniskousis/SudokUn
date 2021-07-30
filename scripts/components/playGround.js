import {
  crel,
  doc,
} from '../utils/shortHands.js';
import createGrid from './grid.js';

function createPlayGround() {
  const playGround = crel('div');
  playGround.id = 'play-ground';

  doc(playGround, createGrid());

  return playGround;
}

export default createPlayGround;
