import {
  gel,
  gat,
  sat,
  setCh,
  isCh,
  setEx,
  isEx,
  cempt,
} from './utils/shortHands.js';

import { setupCandidatesInput, setupExcludesInput } from './components/numberSelectors.js';
import {
  showAlertNoSelection,
  hideAlertNoSelection,
  showInvalidSelection,
  hideInvalidSelection,
  showNoToolFound,
  showCanvas,
} from './viewController.js';
import { Undo } from './store.js';
import { clearDrawDivision, locateTipCloud } from './advancedTools/advanced.js'
import {
  searchNakedSingle,
  nakedSingleFound,
} from './advancedTools/nakedSingle.js';
import {
  searchHiddenSingle,
  hiddenSingleFound,
} from './advancedTools/hiddenSingle.js';
import {
  searchBlockInteraction,
  blockInteractionFound
} from './advancedTools/blockInteraction.js';
import {
  searchSubset,
  subsetFound,
} from './advancedTools/subset.js'
import {
  searchXyChain,
  xyChainFound,
} from './advancedTools/xychain.js'
import {
  searchBlockToBlockInteraction,
  blockToBlockInteractionFound,
} from './advancedTools/blockToBlockInteraction.js'

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

    this.rows = new Array(9);
    this.columns = new Array(9);
    this.blocks = new Array(9);
    this.setupAreas();
  }

  setupAreas() {
    for (let i = 0; i < 9; i++) {
      this.rows[i] = [];
      this.columns[i] = [];
      this.blocks[i] = [];
    }

    this.cells.forEach((cell) => {
      const row = parseInt(gat(cell, 'row'), 10);
      const column = parseInt(gat(cell, 'column'), 10);
      const block = parseInt(gat(cell, 'block'), 10);
      
      this.rows[row].push(cell);
      this.columns[column].push(cell);
      this.blocks[block].push(cell);
      
    });
  }

  initPuzzle() {
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
    this.initCandidates();
  }

  initCandidates() {
    this.resetCandidates();
  
    const actions = this.store.candidatesSet.split(',');

    actions.forEach((action) => {
      const credentials = action.split(':');
      const cellIndex = credentials[0];
      const candidate = credentials[1];
      const excluded = credentials[2] === '1';
      if (cellIndex.length > 0) {
        this.updateCandidate(cellIndex, candidate, true, excluded)
        // setEx(this.cellCandidates[cellIndex][candidate - 1], excluded);
      }
    });
  }

  showUndoButtons() {
    gel('undoButton').style.visibility = this.store.undosIndex > -1 ? 'visible' : 'hidden';
    gel('redoButton').style.visibility = this.store.undosIndex < this.store.undo.length - 1 ? 'visible' : 'hidden';
    gel('restartButton').style.visibility = this.store.undo.length > 0 ? 'visible' : 'hidden';
    this.showReminders()
  }

  resetCandidates() {
    for (let i = 0; i < 81; i++) {
      for (let c = 0; c < 9; c++) {
        const candidate = this.cellCandidates[i][c];
        setCh(candidate, false);
        setEx(candidate, false);
        candidate.className = 'cell-candidate hidden';
      }
    }
  }

  invalidEntry(newValue, exclude) {
    if (newValue === 0) return null;
    if (this.store.allowMistakes) return null;

    const cell = this.cells[this.focusedCellIndex];
    const row = parseInt(gat(cell, 'row'), 10);
    const column = parseInt(gat(cell, 'column'), 10);
    const block = parseInt(gat(cell, 'block'), 10);

    const rowCells = this.rows[row];
    for (let i = 0; i < rowCells.length; i++) {
      const rowCell = rowCells[i];
      const rowCellIndex = parseInt(gat(rowCell, 'index'), 10);
      if (rowCellIndex != this.focusedCellIndex) {
        const rowCellValue = parseInt(gat(rowCell, 'value'), 10);
        if (rowCellValue === newValue) {
          if (exclude) {
            return `No need for exclusion. Number ${newValue} is self-excluded from cell R${row + 1}C${i + 1}`;
          }
          return `Invalid selection for the Row. Number ${newValue} exists in cell at position R${row + 1}C${i + 1}`;
        }
      }
    }

    const columnCells = this.columns[column];
    for (let i = 0; i < columnCells.length; i++) {
      const columnCell = columnCells[i];
      const columnCellIndex = parseInt(gat(columnCell, 'index'), 10);
      if (columnCellIndex != this.focusedCellIndex) {
        const columnCellValue = parseInt(gat(columnCell, 'value'), 10);
        if (columnCellValue === newValue) {
          return `Invalid selection for the Column. Number ${newValue} exists in cell at position R${i + 1}C${column + 1}`;
        }
      }
    }

    const blockCells = this.blocks[block];
    for (let i = 0; i < blockCells.length; i++) {
      const blockCell = blockCells[i];
      const blockCellRow = parseInt(gat(blockCell, 'row'), 10) + 1;
      const blockCellColumn = parseInt(gat(blockCell, 'column'), 10) + 1;
      const blockCellIndex = parseInt(gat(blockCell, 'index'), 10);
      if (blockCellIndex != this.focusedCellIndex) {
        const blockCellValue = parseInt(gat(blockCell, 'value'), 10);
        if (blockCellValue === newValue) {
          return `Invalid selection for the Block. Number ${newValue} exists in cell at position R${blockCellRow}C${blockCellColumn}`;
        }
      }
    }

    return null;
  }

  checkCell(newValue) {
    if (this.focusedCellIndex === -1) {
      showAlertNoSelection();
      return;
    }

    const constrain = this.invalidEntry(newValue);
    if (constrain) {
      showInvalidSelection(constrain);
      return;
    }

    const prevValue = gat(gel(`cell-${this.focusedCellIndex}`), 'value');
    this.updateCell(this.focusedCellIndex, newValue);

    this.wipeNeighbourCandidates(this.cells[this.focusedCellIndex], newValue, true);
  
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

  showReminders() {
    let filledCells = 0;
    for (let i = 0; i < 81; i++) {
      if (!cempt(gel('cell-' + i.toString()))) {
        filledCells += 1;
      }
    }
    gel('remainters').innerHTML = filledCells.toString() + '<br/>' + (81 - filledCells).toString();
  }

  checkCandidate(candidateNumber, check) {
    if (this.focusedCellIndex === -1) {
      showAlertNoSelection();
      return false;
    }

    if (check) {
      const constrain = this.invalidEntry(parseInt(candidateNumber, 10));
      if (constrain) {
        showInvalidSelection(constrain);
        return false;
      }
    }

    this.updateCandidate(this.focusedCellIndex, candidateNumber, check, false);
    setupCandidatesInput(this.focusedCellIndex);

    const newUndo = new Undo('c', this.focusedCellIndex, candidateNumber, check ? '0' : '1', check ? '1' : '0');
    this.store.addUndo(newUndo);
    this.store.candidatesSet = this.candidatesToString();
    this.store.storeGame();

    this.showUndoButtons();

    return true;
  }

  checkExclude(candidateNumber, check) {
    if (this.focusedCellIndex === -1) {
      showAlertNoSelection();
      return false;
    }

    // alert('exlude not implemented');
    // return true;

    if (check) {
      const constrain = this.invalidEntry(parseInt(candidateNumber, 10), true);
      if (constrain) {
        showInvalidSelection(constrain);
        return false;
      }
    }

    this.updateCandidate(this.focusedCellIndex, candidateNumber, check, check);
    setupExcludesInput(this.focusedCellIndex);

    const newUndo = new Undo('x', this.focusedCellIndex, candidateNumber, check ? '0' : '1', check ? '1' : '0');
    this.store.addUndo(newUndo);
    this.store.candidatesSet = this.candidatesToString();
    this.store.storeGame();

    this.showUndoButtons();

    return true;
  }

  updateCandidate(cellIndex, candidateNumber, check, excluded) {
    const candidate = this.cellCandidates[cellIndex][candidateNumber - 1];

    const visibilityClass = (this.cellIsEmpty(cellIndex) && check) ? '' : ' hidden';
    const excludedClass = excluded ? ' red' : '';

    candidate.className = 'cell-candidate ' + visibilityClass + excludedClass;
    candidate.innerHTML = excluded ? '-' : candidateNumber;
    setCh(candidate, check);
    setEx(candidate, excluded);
  }

  wipeAreaCandidates(areaCells, newValue, storeState) {
    areaCells.forEach((cell, i) => {
      const cellIndex = parseInt(gat(cell, 'index'), 10);
      // if (this.cellIsEmpty(cellIndex)) {
        const candidate = this.cellCandidates[cellIndex][newValue - 1];
        if (isCh(candidate)) {
          const excluded = isEx(candidate);
          this.updateCandidate(cellIndex, newValue, false, excluded);
          if (storeState) {
            const newUndo = new Undo('c', cellIndex, newValue, '1', '0');
            this.store.addUndo(newUndo);
          }
        }
      // }
    })
  }

  wipeNeighbourCandidates(cell, newValue, storeState) {
    if (parseInt(newValue, 10) === 0) return;
    // const focusedCell = this.cells[this.focusedCellIndex];

    this.wipeAreaCandidates(this.rows[parseInt(gat(cell, 'row'))], newValue, storeState);
    this.wipeAreaCandidates(this.columns[parseInt(gat(cell, 'column'))], newValue, storeState);
    this.wipeAreaCandidates(this.blocks[parseInt(gat(cell, 'block'))], newValue, storeState);
  }

  isCellCandidateValid(candidate) {
    const candidateNumber = parseInt(gat(candidate, 'candidateNumber'), 10);
    const cellIndex = parseInt(gat(candidate, 'cellIndex'), 10);

    const cell = this.cells[cellIndex];
    const row = parseInt(gat(cell, 'row'), 10);
    const column = parseInt(gat(cell, 'column'), 10);
    const block = parseInt(gat(cell, 'block'), 10);

    const rowCells = this.rows[row];
    for (let i = 0; i < rowCells.length; i++) {
      const rowCell = rowCells[i];
      const cellValue = parseInt(gat(rowCell, 'value'), 10)
      if (cellValue === candidateNumber) {
        return false
      }
    }

    const columnCells = this.columns[column];
    for (let i = 0; i < columnCells.length; i++) {
      const columnCell = columnCells[i];
      const cellValue = parseInt(gat(columnCell, 'value'), 10)
      if (cellValue === candidateNumber) {
        return false
      }
    }

    const blockCells = this.blocks[block];
    for (let i = 0; i < blockCells.length; i++) {
      const blockCell = blockCells[i];
      const cellValue = parseInt(gat(blockCell, 'value'), 10)
      if (cellValue === candidateNumber) {
        return false
      }
    }

    return true
  }

  showAllValideCandidates() {
    for (let cellIndex = 0; cellIndex < 81; cellIndex++) {
      const cell = this.cells[cellIndex];
      const cellValue = parseInt(gat(cell, 'value'), 10)
      if (cellValue === 0) {
        for (let candidateIndex = 0; candidateIndex < 9; candidateIndex++) {
          const candidate = this.cellCandidates[cellIndex][candidateIndex];
          const isX = isEx(candidate);
          const check = this.isCellCandidateValid(candidate);
          const visibilityClass = check ? '' : ' hidden';
          candidate.className = 'cell-candidate ' + visibilityClass + (isX ? ' red' : '');
          candidate.innerHTML = isX ? '-' : (candidateIndex + 1).toString();
          if (!check) {
            // alert(`cellIndex = ${cellIndex} : candidateIndex = ${candidateIndex}`);
          }
          setCh(candidate, check);
          // setEx(candidate, false);
        }
      }
    }
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

    return s; 
    //.substring(0, s.length - 1);
  }

  cellIsEmpty(index) {
    return gat(gel(`cell-${index}`), 'value') === '0';
  }

  hideCellCandidates(cellIndex) {
    for (let i = 1; i < 10; i++) {
      const candidate = gel(`candidate-${cellIndex}-${i}`);
      candidate.className = 'cell-candidate hidden';
    }
  }

  showCellCandidates(cellIndex) {
    for (let i = 1; i < 10; i++) {
      const candidate = gel(`candidate-${cellIndex}-${i}`);
      candidate.className = 'cell-candidate' + (isCh(candidate) ? '' : ' hidden');
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
    setupExcludesInput(-1);
  }

  focusCell(index) {
    hideAlertNoSelection();
    hideInvalidSelection();
    this.clearFocus();
    if (index > -1) {
      this.candidateContainers[index].className = 'cell-candidates-container focusedCell';
      this.focusedCellIndex = index;
      setupCandidatesInput(index);
      setupExcludesInput(index);
    }
  }

  cellClick(cell) {
    // const cell = e.target;
    if (gat(cell, 'given') === '1') return;

    this.focusCell(parseInt(gat(cell, 'index'), 10));
  }

  undo() {
    const undo = this.store.undo[this.store.undosIndex];
    if (undo.type === 'n') {
      // alert(JSON.stringify(undo));
      this.updateCell(undo.cellIndex, parseInt(undo.oldValue, 10));
      this.store.game = this.gameString();

      const insertModeButton = gel('insertModeButton');
      if (isCh(insertModeButton)) insertModeButton.click();

      const excludeModeButton = gel('excludeModeButton');
      if (isCh(excludeModeButton)) excludeModeButton.click();

      this.wipeNeighbourCandidates(this.cells[undo.cellIndex], undo.oldValue, false);
    } else if (undo.type === 'c')  {
      this.updateCandidate(undo.cellIndex, undo.candidate, undo.oldValue === '1', false);
      setupCandidatesInput(undo.cellIndex);
      this.store.candidatesSet = this.candidatesToString();

      const insertModeButton = gel('insertModeButton');
      if (!isCh(insertModeButton)) insertModeButton.click();
    } else if (undo.type === 'x') {
      this.updateCandidate(undo.cellIndex, undo.candidate, true, undo.oldValue === '1')
      setupExcludesInput(undo.cellIndex);
      this.store.candidatesSet = this.candidatesToString();

      const excludeModeButton = gel('excludeModeButton');
      if (!isEx(excludeModeButton)) excludeModeButton.click();

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

      const excludeModeButton = gel('excludeModeButton');
      if (isCh(excludeModeButton)) excludeModeButton.click();

      this.wipeNeighbourCandidates(this.cells[undo.cellIndex], undo.newValue, false);
    } else if (undo.type === 'c') {
      this.updateCandidate(undo.cellIndex, undo.candidate, undo.newValue === '1', false)
      setupCandidatesInput(undo.cellIndex);
      this.store.candidatesSet = this.candidatesToString();

      const insertModeButton = gel('insertModeButton');
      if (!isCh(insertModeButton)) insertModeButton.click();
    } else if (undo.type === 'x') {
      this.updateCandidate(undo.cellIndex, undo.candidate, true, undo.newValue === '1')
      setupExcludesInput(undo.cellIndex);
      this.store.candidatesSet = this.candidatesToString();

      const excludeModeButton = gel('excludeModeButton');
      if (!isCh(excludeModeButton)) excludeModeButton.click();

    }

    this.store.undosIndex += 1;
    this.store.storeGame();

    this.focusCell(undo.cellIndex);
    this.showUndoButtons();
  }

  restart() {
    this.resetCandidates();
    this.store.restart();
    this.initPuzzle();
  }

  prepareTipForCell(cell, drawController, tool) {
    showCanvas();
    this.cellClick(cell);
    locateTipCloud(cell);
    drawController(tool);

  }
  prepareTipForBlock(block, drawController, tool) {
    showCanvas();
    // this.cellClick(cell);
    const cell = gel('cell-0')
    locateTipCloud(cell);
    drawController(tool);

  }
  prepareTipForSubset(subset, drawController) {
    showCanvas();
    // this.cellClick(gel("cell-57"));
    if (subset.unit = 'row') {
      const row = (parseInt(gat(subset.subsetCells[0], "row"), 10) * 9) + 1;
      locateTipCloud(gel("cell-" + row.toString()));
    } else {
      locateTipCloud(gel("cell-35"));

    }
    drawController(subset);
  }
  prepareTipForXyChain(drawController, xyChain) {
    showCanvas();
    // this.cellClick(cell);
    const cell = gel('cell-50')
    locateTipCloud(cell);
    drawController(xyChain);

  }
  prepareTipForBlockToBlockInteraction(drawController, blockToBlockInteractionFound) {
    showCanvas();
    // this.cellClick(cell);
    const cell = gel('cell-50')
    locateTipCloud(cell);
    drawController(blockToBlockInteractionFound);

  }
  searchAdvancedTip(e) {
    clearDrawDivision();
    this.calcTemporaryOptions();
    // searchXyChain,
    // xyChainFound,

    const nakedSingle = searchNakedSingle();
    if (nakedSingle) {
      const cell = nakedSingle.firstCell;
      this.prepareTipForCell(cell, nakedSingleFound, nakedSingle)
    } else {
      const hiddenSingle = searchHiddenSingle();
      if (hiddenSingle) {
        const cell = hiddenSingle.firstCell;
        this.prepareTipForCell(cell, hiddenSingleFound, hiddenSingle)
      } else {
        const subset = searchSubset();
        if (subset) {
          this.prepareTipForSubset(subset, subsetFound)
        } else {
          const blockInteraction = searchBlockInteraction();
          if (blockInteraction) {
            const block = blockInteraction.block;
            this.prepareTipForBlock(block, blockInteractionFound, blockInteraction)
          } else {
            const xyChain = searchXyChain();
            if (xyChain) {
              this.prepareTipForXyChain(xyChainFound, xyChain)
            } else {
              const blockToBlockInteraction = searchBlockToBlockInteraction();
              if (blockToBlockInteraction) {
                this.prepareTipForBlockToBlockInteraction(blockToBlockInteractionFound, blockToBlockInteraction)
              } else {
                showNoToolFound();
              }
            }
          }
        }
      }
    }

  }
  calcTemporaryOptions() { 
    for (let cellIndex = 0; cellIndex < 81; cellIndex++) {
      const cell = gel("cell-" + cellIndex.toString());
      const cellIsFilled = gat(cell, 'value') != '0';
      
      let candidatesCount = 0;
      for (let option = 1; option < 10; option++) {
        const candidate = gel("candidate-" + cellIndex.toString() + "-" + option.toString());
        const checked = isCh(candidate);
        const excluded = isEx(candidate);
        const excludedClass = excluded ? ' red' : '';
        if (cellIsFilled) {
          sat(candidate, "checked", "0");
          candidate.className = 'cell-candidate hidden ' + excludedClass;
        } else {
          var canCheckIt = this.allowOptionInNeighborhood(cell, option.toString() );
          const visibilityClass = canCheckIt === '1' ? '' : ' hidden';
          sat(candidate, "checked", canCheckIt);
          candidate.className = 'cell-candidate' + visibilityClass + excludedClass;
          candidate.innerHTML = excluded ? '-' : option.toString();
          if (!excluded) {
            candidatesCount = candidatesCount + parseInt(canCheckIt);
            sat(candidate, "checked", canCheckIt);
            if (!checked) sat(candidate, 'tempMark', canCheckIt ? "1" : null)
          }
        }
      }

      sat(cell, "candidatesCount", candidatesCount.toString() );
    }
  }
  calcOptions() { 
    for (let cellIndex = 0; cellIndex < 81; cellIndex++) {
      const cell = gel("cell-" + cellIndex.toString());
      const cellIsFilled = gat(cell, 'value') != '0';
      
      let candidatesCount = 0;
      for (let option = 1; option < 10; option++) {
        const candidate = gel("candidate-" + cellIndex.toString() + "-" + option.toString());
        if (cellIsFilled) {
          sat(candidate, "checked", "0");
        } else {
          var checked = this.allowOptionInNeighborhood(cell, option.toString() );
          sat(candidate, "checked", checked);
          if (!isEx(candidate)) {
            candidatesCount = candidatesCount + parseInt(checked);
          }
        }
      }

      sat(cell, "candidatesCount", candidatesCount.toString() );
    }
  }
  allowOptionInNeighborhood(destCell, option) { 
    var block  = gat(destCell, "block");
    var row    = gat(destCell, "row");
    var column = gat(destCell, "column");
    var destCellIndex = gat(destCell, "index");

    for (let i = 0; i < 81; i++) {
      var cell = gel("cell-" + i.toString());
      if (gat(cell, 'index') != destCellIndex) {

        if (gat(cell, "block") == block) {
          if (gat(cell, 'value') === option) {
            return "0";
          }
        }
        if (gat(cell, "row") == row) {
          if (gat(cell, 'value') === option) {
            return "0";
          }
        }
        if (gat(cell, "column") == column) {
          if (gat(cell, 'value') === option) {
            return "0";
          }
        }

      }
    }
    return "1";
  }

}

export default Game;
