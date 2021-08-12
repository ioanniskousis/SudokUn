import {
  gel,
  doc,
} from './utils/shortHands.js';

import createPlayGround from './components/playGround.js';
import createFileSelectorContainer from './components/fileSelector.js';
import createSettingsViewContainer from './components/settingsView.js';

import Game from './game.js';
import Store from './store.js';

import createEvents from './events.js';
import { showPuzzInfo } from './viewController.js';

function handleLoadResponse() {
  game.drawPuzzle();
  showPuzzInfo(store);
}

function loadPuzzle(clearGame) {
  store.loadPuzzle(handleLoadResponse, clearGame);
}

function initGame() {
  store = new Store();
  game = new Game(store);
  loadPuzzle(false);
}

function render() {
  doc(gel('main'), createPlayGround());
  doc(gel('main'), createFileSelectorContainer());
  doc(gel('main'), createSettingsViewContainer());
}

window.addEventListener('load', () => {
  render();
  initGame();
  createEvents(game, store, loadPuzzle);
});

let store = null;
let game = null;
