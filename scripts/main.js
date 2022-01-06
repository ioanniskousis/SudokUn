import {
  gel,
  doc,
} from './utils/shortHands.js';

import createPlayGround from './components/playGround.js';
import createFileSelectorContainer from './components/fileSelector.js';
import {
  createSettingsViewContainer,
  createInstructionsViewContainer,

} from './components/settingsView.js';

import Game from './game.js';
import Store from './store.js';

import createEvents from './events.js';
import { showPuzzInfo } from './viewController.js';

import PlayGroundClass from './components/playGroundClass.js';

function handleLoadResponse() {
  game.initPuzzle();
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
  const playGround = new PlayGroundClass();
  console.log(playGround)

  doc(gel('main'), createPlayGround());
  // doc(gel('main'), playGround.element);

  doc(gel('main'), createFileSelectorContainer());
  doc(gel('main'), createSettingsViewContainer());
  doc(gel('main'), createInstructionsViewContainer());
}

window.addEventListener('load', () => {
  render();
  initGame();
  createEvents(game, store, loadPuzzle);
});

let store = null;
let game = null;
