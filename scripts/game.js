import {
  gel,
  gat,
  sat,
  setCh,
  isCh,
} from './utils/shortHands.js';
import { setupCandidatesInput } from './components/candidatesSelector.js';
import { showAlertNoSelections, hideAlertNoSelections } from './viewController.js';

class Game {
  constructor() {
    this.cells = new Array(81);
    this.candidateContainers = new Array(81);
    this.candidates = new Array(81, 9);
    for (let i = 0; i < 81; i++) {
      this.cells[i] = gel(`cell-${i}`);
      this.candidateContainers[i] = gel(`cell-candidates-container-${i}`);
      for (let c = 0; c < 9; c++) {
        this.candidates[i, c] = gel(`candidate-${i}-${c + 1}`)
      }
    }
    
    this.focusedCellIndex = -1;
  }

  setupPuzzle(store) {
    const puzzleNumbers = store.puzzle.split('');
    const gameNumbers = store.game.split('');
  
    this.cells.forEach((cell, i) => {
      sat(cell, 'value', gameNumbers[i].toString());
      if (puzzleNumbers[i] > 0) {
        cell.innerHTML = puzzleNumbers[i];
        cell.className = 'grid-cell grid-cell-given';
        sat(cell, 'given', '1');
      } else {
        if (gameNumbers[i] > 0) {
          cell.innerHTML = gameNumbers[i];
          cell.className = 'grid-cell';
        }
        sat(cell, 'given', '0');
      }
    });
  }

  checkCell(val) {
    if (this.focusedCellIndex === -1) {
      showAlertNoSelections();
      return;
    }
    const cell = gel(`cell-${this.focusedCellIndex}`);
    sat(cell, 'value', val);
    cell.innerHTML = val || '';
    if (val) {
      this.hideCandidates();
    } else {
      this.showCandidates();
    }
  }

  cellIsEmpty(index) {
    return gat(gel(`cell-${index}`), 'value') === '0';
  }

  hideCandidates() {
    for (let i = 1; i < 10; i++) {
      const candidate = gel(`candidate-${this.focusedCellIndex}-${i}`);
      candidate.style.visibility = 'hidden';
    }
  }

  showCandidates() {
    for (let i = 1; i < 10; i++) {
      const candidate = gel(`candidate-${this.focusedCellIndex}-${i}`);
      candidate.style.visibility = isCh(candidate) ? 'visible' : 'hidden';
    }
  }

  checkCandidate(candidateNumber, check) {
    if (this.focusedCellIndex === -1) {
      showAlertNoSelections();
      return false;
    }
    const candidate = gel(`candidate-${this.focusedCellIndex}-${candidateNumber}`);
    const visible = this.cellIsEmpty(this.focusedCellIndex) ? 'visible' : 'hidden';
    candidate.style.visibility = check ? visible : 'hidden';
    setCh(candidate, check);
    return true;
  }

  isGiven(cell) {
    return gat(cell, 'given') === '1';
  }

  clearFocus() {
    this.candidateContainers.forEach((container) =>
      container.className = 'cell-candidates-container'
    );
    this.focusedCellIndex = -1;
    setupCandidatesInput(-1);
  }

  focusCell(index) {
    hideAlertNoSelections();
    this.clearFocus();
    if (index > -1) {
      this.candidateContainers[index].className = 'cell-candidates-container focusedCell';
      this.focusedCellIndex = index;
      setupCandidatesInput(index);
    }
  }

  cellClick(e) {
    const cell = e.target;
    if (gat(cell, 'given') === '1') return;

    this.focusCell(parseInt(gat(cell, 'index'), 10));
  }

  escape() {
    if (this.focusedCellIndex > -1) {
      this.focusCell(-1);
    }
  }
}

export default Game;
