import { gel, sat } from './utils/shortHands.js';

function updateView(store) {
  const puzzleNumbers = store.puzzle.split('');
  const gameNumbers = store.game.split('');

  for (let i = 0; i < 81; i++) {
    const cell = gel(`cell-${i}`);
    if (puzzleNumbers[i] > 0) {
      cell.innerHTML = puzzleNumbers[i];
      cell.className = 'grid-cell grid-cell-given';
      sat(cell, 'given', '1');
      cell.onclick = '';
    } else {
      if (gameNumbers[i] > 0) {
        cell.innerHTML = gameNumbers[i];
        cell.className = 'grid-cell';
      }
      sat(cell, 'given', '0');
      cell.onclick = (e) => cellClick(e);
    }
    
  }
}

function clearFocus() {
  for (let i = 0; )
}

function focusCell(index) {

}

function cellClick(e) {
  const cell = e.target;
  alert(cell.id);
}

export {
  updateView,
}