import { createComponents } from './components/create.js';
import { layout } from './layout.js';
import Store from './store.js';
import Game from './game.js';

function createEvents() {
  window.addEventListener('resize', layout);

}

function render() {
  createComponents();
  createEvents()

  layout();
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
});

const gameStore = new Store();
let gamePlay = null;
