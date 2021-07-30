import {
  gel,
  gat,
  sat,
} from './utils/shortHands.js';
import Bounds from './utils/bounds.js';

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
    this.inputPanelVisible = false;

    gel('main').onclick = (e) => this.mainClick(e);
    window.addEventListener("keydown", (e) => this.wKeyDown(e)); 
  }

  updateView(store) {
    const puzzleNumbers = store.puzzle.split('');
    const gameNumbers = store.game.split('');
  
    this.cells.forEach((cell, i) => {
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
      // cell.innerHTML = gat(cell, 'row') + ' - ' + gat(cell, 'col');
    });
  }

  isGiven(cell) {
    return gat(cell, 'given') === '1';
  }

  clearFocus() {
    this.candidateContainers.forEach((container) =>
      container.className = 'cell-candidates-container'
    );
    this.focusedCellIndex = -1;
  }

  showInputPanel(cell) {
    const cellBounds = new Bounds();
    cellBounds.getRect(cell);
    const cellRow = parseInt(gat(cell, 'row'), 10);
    const cellCol = gat(cell, 'col'); // parseInt(gat(cell, 'col'), 10);
// alert(gat(cell, 'col'));

    const inputPanel = gel('inputPanel');
    const bounds = new Bounds();
    bounds.getRect(inputPanel);

    if (cellCol < 5) {
      bounds.left = cellBounds.left + (cellBounds.width * 3) + 10;
    } else {
      bounds.left = cellBounds.left - (cellBounds.width * 3) - 10 - bounds.width;
    }
    if (bounds.left + bounds.width + 10> window.innerWidth) {
      bounds.left = window.innerWidth - bounds.width - 10;
    }
    if (bounds.left < 10) {
      bounds.left = 10;
    }

    if (cellRow < 5) {
      bounds.top = cellBounds.top + (cellBounds.height * 3) + 10;
    } else {
      bounds.top = cellBounds.top - (cellBounds.height * 3) - 10 - bounds.width;
    }
    if (bounds.top + bounds.height + 10 > window.innerHeight) {
      bounds.top = window.innerHeight - bounds.height - 10;
    }
    if (bounds.top < 10) {
      bounds.top = 10;
    }
    bounds.bound(inputPanel);

    inputPanel.style.opacity = '1';
    this.inputPanelVisible = true;
  }

  hideInputPanel() {
    gel('inputPanel').style.opacity = '0';
    this.inputPanelVisible = false;
  }

  focusCell(index) {
    this.clearFocus();
    if (index > -1) {
      this.candidateContainers[index].className = 'cell-candidates-container focusedCell';
      this.focusedCellIndex = index;
    }
  }

  cellClick(e) {
    e.preventDefault;
    // alert('cellClick');
    const cell = e.target;
    this.focusCell(parseInt(gat(cell, 'index'), 10));
    this.showInputPanel(cell);
  }

  mainClick(e) {
    e.preventDefault;
    if (this.focusedCellIndex > -1) {
      // alert('mainClick');
      const bounds = new Bounds();
      bounds.getRect(gel('main-grid'));
      const inputbounds = new Bounds();
      inputbounds.getRect(gel('inputPanel'));
      if (!bounds.contains(e.pageX, e.pageY) && !inputbounds.contains(e.pageX, e.pageY)) {
        this.focusCell(-1);
        this.hideInputPanel();
      }
    }
  }

  wKeyDown(event) {
    const keyCode = event.keyCode;
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
    //   if (_gAttEl(selectedCell, "prevValue") == "") {
    //     return;
    //   }
    //   selectedCell.value = "";
    //   cellBlur(selectedCell);
    //   return ;
    // }
    // if ((keyCode > 48) && (keyCode < 58)) {  
    //   var chars = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    //   selectedCell.value = chars[keyCode - 49];
    //   cellBlur(selectedCell);
    //   return;     
    // }
    // if ((keyCode > 96) && (keyCode < 106)) {  
    //   var chars = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    //   selectedCell.value = chars[keyCode - 97];
    //   cellBlur(selectedCell);
    //   return;     
    // }

  }

}

export default Game;