import { createComponents } from './components/create.js';
import { layout } from './layout.js';
import Store from './store.js';
import Game from './game.js';

function createEvents() {
  window.addEventListener('resize', () => layout(gamePlay));

}

function render() {
  createComponents();
  createEvents()
}

function loadDefaults() {

}

function handleLoadResponse() {
  gamePlay.updateView(gameStore);
}

function init() {
  gamePlay = new Game();
  gameStore.loadPuzzle(handleLoadResponse, null);
}

window.addEventListener('load', () => {
  render();
  init();
  layout(gamePlay);
});

const gameStore = new Store();
let gamePlay = null;
