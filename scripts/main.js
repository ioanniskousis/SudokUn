import {
  gel,
  doc,
} from './utils/shortHands.js';

import createPlayGround from './components/playGround.js';
import Game from './game.js';
import Store from './store.js';

import createEvents from './events.js';

function handleLoadResponse() {
  gamePlay.updateView(gameStore);
}

function initGame() {
  gamePlay = new Game();
  gameStore.loadPuzzle(handleLoadResponse, null);
}

window.addEventListener('load', () => {
  doc(gel('main'), createPlayGround());
  initGame();
  createEvents(gamePlay);
});

const gameStore = new Store();
let gamePlay = null;
