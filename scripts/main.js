import { createComponents } from './create.js';
import { layout } from './layout.js';
import Store from './store.js';
import { updateView } from './game.js';

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

function init() {
  gameStore.loadPuzzle(updateView, null);
}

window.addEventListener('load', () => {
  render();
  init();
});

const gameStore = new Store();
