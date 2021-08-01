import {
  gel,
  gat,
  sat,
  setCh,
  isCh,
} from './utils/shortHands.js';
import Bounds from './utils/bounds.js';
import { setupCandidatesInput } from './components/candidatesSelector.js';

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

    gel('main').onclick = (e) => this.mainClick(e);
    window.addEventListener('keydown', (e) => this.wKeyDown(e));

    this.inputMode = null;
  }

  updateView(store) {
    const puzzleNumbers = store.puzzle.split('');
    const gameNumbers = store.game.split('');
  
    this.cells.forEach((cell, i) => {
      sat(cell, 'value', gameNumbers[i].toString());
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
        cell.onclick = (e) => this.cellClick(e);
      }
    });
  }

  checkCell(val) {
    if (this.focusedCellIndex === -1) {
      alert('select a cell');
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
      alert('select a cell');
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

  setInputMode(mode) {
    this.inputMode = mode;
    if (mode === 'SEARCH')  {
      this.focusCell(-1);
    }
  }

  focusCell(index) {
    this.clearFocus();
    if (index > -1) {
      this.candidateContainers[index].className = 'cell-candidates-container focusedCell';
      this.focusedCellIndex = index;
      setupCandidatesInput(index);
    }
  }

  cellClick(e) {
    const cell = e.target;
    this.focusCell(parseInt(gat(cell, 'index'), 10));
  }

  mainClick(e) {
    if (this.focusedCellIndex > -1) {
      const bounds = new Bounds();
      bounds.getRect(gel('main-grid'));
      const insertPanelbounds = new Bounds();
      insertPanelbounds.getRect(gel('numbersSelector'));
      const candidatesSelectorbounds = new Bounds();
      candidatesSelectorbounds.getRect(gel('candidatesSelector'));
      if (
        !bounds.contains(e.pageX, e.pageY) &&
        !insertPanelbounds.contains(e.pageX, e.pageY) &&
        !candidatesSelectorbounds.contains(e.pageX, e.pageY)
        ) {
        this.focusCell(-1);
      }
    }
  }

  escape() {
    if (this.focusedCellIndex > -1) {
      this.focusCell(-1);
    }
  }

  wKeyDown(event) {
    const keyCode = event.keyCode;
    // alert(keyCode);
    if (keyCode === 27) {
      event.preventDefault();
      this.escape();
      return;
    }
    if (keyCode == 9) {
      event.preventDefault();
      return;
    }
    if ((keyCode == 32) || (keyCode == 33) || (keyCode == 34)) {
      event.preventDefault();
    }
    if ((keyCode >= 37) && (keyCode <= 40)) {
      event.preventDefault();
    }
    if (this.focusedCellIndex === -1) {
      return;
    }
    if ((keyCode >= 37) && (keyCode <= 40)) {
      event.preventDefault();
      let selectedCellIndex = this.focusedCellIndex;
      if (keyCode == 37) {
        if (selectedCellIndex > 0){
          selectedCellIndex -= 1;
          let cell = gel(`cell-${selectedCellIndex}`);
          while ((selectedCellIndex > 0) && (this.isGiven(cell))) {
            selectedCellIndex -= 1;
            cell = gel(`cell-${selectedCellIndex}`);
          }
        }
      } else if (keyCode == 38) {
        if (selectedCellIndex > 8) {
          selectedCellIndex -= 9;
          let cell = gel(`cell-${selectedCellIndex}`);
          while ((selectedCellIndex > 8) && (this.isGiven(cell))) {
            selectedCellIndex -= 9;
            cell = gel(`cell-${selectedCellIndex}`);
          }
        }
      } else if (keyCode == 39) {
        if (selectedCellIndex < 80) {
          selectedCellIndex += 1;
          let cell = gel(`cell-${selectedCellIndex}`);
          while ((selectedCellIndex < 80) && (this.isGiven(cell))) {
            selectedCellIndex += 1;
            cell = gel(`cell-${selectedCellIndex}`);
          }
        }
      } else if (keyCode == 40) {
        if (selectedCellIndex < 72) {
          selectedCellIndex += 9;
          let cell = gel(`cell-${selectedCellIndex}`);
          while ((selectedCellIndex < 72) && (this.isGiven(cell))) {
            selectedCellIndex += 9;
            cell = gel(`cell-${selectedCellIndex}`);
          }
        }
      }
      const cell = gel(`cell-${selectedCellIndex}`);
      if (!this.isGiven(cell)) this.focusCell(selectedCellIndex);
      return ;
    }

    // if ((keyCode == 46) || (keyCode == 32) || (keyCode == 48) || (keyCode == 96)) {
    //   event.preventDefault();
    //   if (_gAttEl(selectedCell, 'prevValue') == '') {
    //     return;
    //   }
    //   selectedCell.value = '';
    //   cellBlur(selectedCell);
    //   return ;
    // }
    if ((keyCode === 8) || (keyCode === 46)) this.checkCell(0);

    if (this.focusedCellIndex > -1) {
      let inputNumber = -1;
      if ((keyCode > 47) && (keyCode < 58)) inputNumber = keyCode - 48;
      if ((keyCode > 95) && (keyCode < 106)) inputNumber = keyCode - 96;

      if (inputNumber > -1) {
        var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        this.checkCell(parseInt(chars[inputNumber], 10));
        return;     
      }
    }

  }

}

export default Game;
