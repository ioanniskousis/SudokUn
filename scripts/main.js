import {
  gel,
  doc,
} from './utils/shortHands.js';

import createPlayGround from './components/playGround.js';
import Game from './game.js';
import Store from './store.js';

import createEvents from './events.js';
import { showPuzzleLevel } from './viewController.js';

function handleLoadResponse() {
  game.setupPuzzle(store);
  showPuzzleLevel(store);
}

function initGame() {
  store = new Store();
  game = new Game();
  store.loadPuzzle(handleLoadResponse, null);
}

window.addEventListener('load', () => {
  doc(gel('main'), createPlayGround());
  initGame();
  createEvents(game);
});

let store = null;
let game = null;
