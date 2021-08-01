import {
  gel,
  doc,
} from './utils/shortHands.js';

import createPlayGround from './components/playGround.js';
import { layout } from './layout.js';
import Store from './store.js';
import Game from './game.js';

import { createModeButtonEvents } from './components/modeButtonContainer.js';
import { createNumberButtonsEvents } from './components/numbersSelector.js';
import { createCandidateButtonsEvents } from './components/candidatesSelector.js';

function createEvents() {
  window.addEventListener('resize', () => layout(gamePlay));

  createModeButtonEvents();
  createNumberButtonsEvents(gamePlay);
  createCandidateButtonsEvents(gamePlay);

}

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
  createEvents();
  layout(gamePlay);
});

const gameStore = new Store();
let gamePlay = null;
