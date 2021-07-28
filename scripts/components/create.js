import {
  gel,
  doc,
} from '../utils/shortHands.js';
import createPlayGround from './playGround.js';

function createComponents() {
  doc(gel('main'), createPlayGround());
}

export {
  createComponents,
};
