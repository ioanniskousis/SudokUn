import {
  gel,
  gat,
  sat,
  setCh,
  isCh,
  setEx,
  isEx,
} from './utils/shortHands.js';
import { setupCandidatesInput } from './components/candidatesSelector.js';
import { showAlertNoSelections, hideAlertNoSelections } from './viewController.js';
import { Undo } from './store.js';

class Game {
  constructor(store) {
    this.cells = new Array(81);
    this.candidateContainers = new Array(81);
    this.cellCandidates = new Array(81);
    for (let i = 0; i < 81; i++) {
      this.cells[i] = gel(`cell-${i}`);
      this.candidateContainers[i] = gel(`cell-candidates-container-${i}`);
      this.cellCandidates[i] = new Array(9);
      for (let c = 0; c < 9; c++) {
        this.cellCandidates[i][c] = gel(`candidate-${i}-${c + 1}`);
      }
    }
    
    this.focusedCellIndex = -1;
    this.store = store;
  }

  drawPuzzle() {
    const puzzleNumbers = this.store.puzzle.split('');
    const gameNumbers = this.store.game.split('');
  
    this.cells.forEach((cell, i) => {
      sat(cell, 'value', gameNumbers[i].toString());
      if (puzzleNumbers[i] > 0) {
        cell.innerHTML = puzzleNumbers[i];
        cell.className = 'grid-cell grid-cell-given';
        sat(cell, 'given', '1');
      } else {
        if (gameNumbers[i] > 0) {
          cell.innerHTML = gameNumbers[i];
        } else {
          cell.innerHTML = '';
        }
        cell.className = 'grid-cell';
        sat(cell, 'given', '0');
      }
    });

    this.showUndoButtons();
    this.drawCandidates();
  }

  drawCandidates() {
    const actions = this.store.candidatesSet.split(',');
    actions.forEach((action) => {
      const credentials = action.split(':');
      const cellIndex = credentials[0];
      const candidate = credentials[1];
      const excluded = credentials[2] === '1';
      if (cellIndex.length > 0) {
        this.updateCandidate(cellIndex, candidate, true)
        setEx(this.cellCandidates[cellIndex][candidate - 1], excluded);
      }
    });
  }

  showUndoButtons() {
    gel('undoButton').style.visibility = this.store.undosIndex > -1 ? 'visible' : 'hidden';
    gel('redoButton').style.visibility = this.store.undosIndex < this.store.undo.length - 1 ? 'visible' : 'hidden';
    gel('restartButton').style.visibility = this.store.undo.length > 0 ? 'visible' : 'hidden';
  }

  resetCandidates() {
    for (let i = 0; i < 81; i++) {
      for (let c = 0; c < 9; c++) {
        const candidate = this.cellCandidates[i][c];
        setCh(candidate, false);
        setEx(candidate, false);
        candidate.style.visibility = 'hidden';
      }
    }
  }

  checkCell(newValue) {
    if (this.focusedCellIndex === -1) {
      showAlertNoSelections();
      return;
    }
    const prevValue = gat(gel(`cell-${this.focusedCellIndex}`), 'value');
    this.updateCell(this.focusedCellIndex, newValue);
  
    const newUndo = new Undo('n', this.focusedCellIndex, 0, prevValue, newValue);
    this.store.addUndo(newUndo);
    this.store.game = this.gameString();
    this.store.storeGame();

    this.showUndoButtons();
  }

  updateCell(cellIndex, newValue) {
    const cell = gel(`cell-${cellIndex}`);
    sat(cell, 'value', newValue);
    cell.innerHTML = newValue || '';
    if (newValue) {
      this.hideCellCandidates(cellIndex);
    } else {
      this.showCellCandidates(cellIndex);
    }
  }

  checkCandidate(candidateNumber, check) {
    if (this.focusedCellIndex === -1) {
      showAlertNoSelections();
      return false;
    }
    this.updateCandidate(this.focusedCellIndex, candidateNumber, check);

    const newUndo = new Undo('c', this.focusedCellIndex, candidateNumber, check ? '0' : '1', check ? '1' : '0');
    this.store.addUndo(newUndo);
    this.store.candidatesSet = this.candidatesToString();
    this.store.storeGame();

    this.showUndoButtons();

    return true;
  }

  updateCandidate(cellIndex, candidateNumber, check) {
    const candidate = this.cellCandidates[cellIndex][candidateNumber - 1];
    const visible = this.cellIsEmpty(cellIndex) ? 'visible' : 'hidden';
    candidate.style.visibility = check ? visible : 'hidden';
    setCh(candidate, check);
    setEx(candidate, false);

    setupCandidatesInput(cellIndex);
  }

  gameString() { 
    var str = '';
    this.cells.forEach((cell) => {
      str = str.concat(gat(cell, 'value'));
    });

    return str;
  }
  
  candidatesToString() {
    let s = '';
    for (let i = 0; i < 81; i++) {
      for (let c = 0; c < 9; c++) {
        const candidate = this.cellCandidates[i][c];
        if (isCh(candidate)) {
          s = s.concat(
            i.toString(), ':',
            (c + 1).toString(), ':',
            isEx(candidate) ? '1' : '0', ','
          );
        }
        
      }
    }

    return s.substring(0, s.length - 1);
  }

  cellIsEmpty(index) {
    return gat(gel(`cell-${index}`), 'value') === '0';
  }

  hideCellCandidates(cellIndex) {
    for (let i = 1; i < 10; i++) {
      const candidate = gel(`candidate-${cellIndex}-${i}`);
      candidate.style.visibility = 'hidden';
    }
  }

  showCellCandidates(cellIndex) {
    for (let i = 1; i < 10; i++) {
      const candidate = gel(`candidate-${cellIndex}-${i}`);
      candidate.style.visibility = isCh(candidate) ? 'visible' : 'hidden';
    }
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

  undo() {
    const undo = this.store.undo[this.store.undosIndex];
    
    if (undo.type === 'n') {
      this.updateCell(undo.cellIndex, parseInt(undo.oldValue, 10));
      this.store.game = this.gameString();

      const insertModeButton = gel('insertModeButton');
      if (isCh(insertModeButton)) insertModeButton.click();
    } else {
      this.updateCandidate(undo.cellIndex, undo.candidate, undo.oldValue === '1')
      this.store.candidatesSet = this.candidatesToString();

      const insertModeButton = gel('insertModeButton');
      if (!isCh(insertModeButton)) insertModeButton.click();
    }

    this.store.undosIndex -= 1;
    this.store.storeGame();

    this.focusCell(undo.cellIndex);
    this.showUndoButtons();
  }

  redo() {
    const undo = this.store.undo[this.store.undosIndex + 1];

    if (undo.type === 'n') {
      this.updateCell(undo.cellIndex, parseInt(undo.newValue, 10));
      this.store.game = this.gameString();

      const insertModeButton = gel('insertModeButton');
      if (isCh(insertModeButton)) insertModeButton.click();
    } else {
      this.updateCandidate(undo.cellIndex, undo.candidate, undo.newValue === '1')
      this.store.candidatesSet = this.candidatesToString();

      const insertModeButton = gel('insertModeButton');
      if (!isCh(insertModeButton)) insertModeButton.click();
    }

    this.store.undosIndex += 1;
    this.store.storeGame();

    this.focusCell(undo.cellIndex);
    this.showUndoButtons();
  }

  restart() {
    this.resetCandidates();
    this.store.restart();
    this.drawPuzzle();
  }
}

export default Game;
