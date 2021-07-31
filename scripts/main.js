import { createComponents } from './components/create.js';
import { layout } from './layout.js';
import Store from './store.js';
import Game from './game.js';
import {
  gel,
  gat,
  sat,
} from './utils/shortHands.js';

function createEvents() {
  window.addEventListener('resize', () => layout(gamePlay));

  gel('numbersInputButton').onclick = (e) => inputModeChanged(e, 'INPUT');
  gel('candidatesSelectButton').onclick = (e) => inputModeChanged(e, 'CANDIDATE');
  gel('candidatesExcludeButton').onclick = (e) => inputModeChanged(e, 'EXCLUDE');
  gel('searchButton').onclick = (e) => inputModeChanged(e, 'SEARCH');
}

function inputModeChanged(event, mode) {
  const clickedBbutton = event.target;
  const clickedButtonChecked = gat(clickedBbutton, 'checked') === '1';

  const modes = [
    'numbersInputButton',
    'candidatesSelectButton',
    'candidatesExcludeButton',
    'searchButton',
  ];
  for (let i = 0; i < modes.length; i++) {
    const button = gel(modes[i]);
    button.style.opacity = 0.5;
    button.style.backgroundColor = 'rgba(47, 111, 143, 0.5)';
    sat(button, 'checked', '0');
  }
  if (clickedButtonChecked) {
    gamePlay.setInputMode(null);
  } else {
    sat(clickedBbutton, 'checked', '1');
    clickedBbutton.style.opacity = 1;
    clickedBbutton.style.backgroundColor = 'rgba(47, 111, 143, 1)';
    gamePlay.setInputMode(mode);
  }
}

function handleLoadResponse() {
  gamePlay.updateView(gameStore);
}

function initGame() {
  gamePlay = new Game();
  gameStore.loadPuzzle(handleLoadResponse, null);
}

window.addEventListener('load', () => {
  createComponents();
  createEvents();
  initGame();
  layout(gamePlay);
});

const gameStore = new Store();
let gamePlay = null;
