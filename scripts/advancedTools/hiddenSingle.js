import {
  optionIsExcludable,
  joinParagraphWithElement,
  setUpCanvas,
  frameCandidate,
  shadeRow,
  shadeColumn,
  shadeBlock,
  emptyCells,
  getNeighborhood,
  cellAcceptsCandidate,
  getRowCells,
  getColumnCells,
  getBlockCells,
  markElement,
  updateCandidateTemporary,
  joinElements,
} from './advanced.js';
import { gel, gat, sat, isCh, optionValue, crel, doc, delay } from '../utils/shortHands.js';

function searchHiddenSingle() {
  const cells = emptyCells();
  for (var i = 0; i < cells.length; i++) {
    const hiddenSingle = searchHiddenSingleInCell(cells[i])
    if (hiddenSingle) return hiddenSingle;
  }
   
  return null;
}

function searchHiddenSingleInCell(cell) {
  const cellIndex = gat(cell, 'index');

  const rowCells = getRowCells(gat(cell, 'row'));
  const columnCells = getColumnCells(gat(cell, 'column'));
  const blockCells = getBlockCells(gat(cell, 'block'));

  for (var option = 1; option < 10; option++) {
    let acceptanses = cellsCandidateAcceptanses(rowCells, option.toString());
    let accepted = acceptanses.filter((i) => i != -1);
    if ((accepted.length === 1) && (accepted[0] === cellIndex)) {
      const candidate = gel('candidate-' + gat(cell, 'index') + '-' + option);
      return {firstCell:cell, option:candidate, group:"row"}
    }

    acceptanses = cellsCandidateAcceptanses(columnCells, option.toString());
    accepted = acceptanses.filter((i) => i != -1);
    if ((accepted.length === 1) && (accepted[0] === cellIndex)) {
      const candidate = gel('candidate-' + gat(cell, 'index') + '-' + option);
      return {firstCell:cell, option:candidate, group:"column"}
    }

    acceptanses = cellsCandidateAcceptanses(blockCells, option.toString());
    accepted = acceptanses.filter((i) => i != -1);
    if ((accepted.length === 1) && (accepted[0] === cellIndex)) {
      const candidate = gel('candidate-' + gat(cell, 'index') + '-' + option);
      return {firstCell:cell, option:candidate, group:"block"}
    }
  }
  return null
}
function cellsCandidateAcceptanses(cells, option) {
  let acceptanses = new Array(9);
  for (let i = 0; i < cells.length; i++) {
    acceptanses[i] = cellAcceptsCandidate(cells[i], option) ? gat(cells[i], 'index') : -1;
  }
  return acceptanses;
}

function hiddenSingleFound(hiddenSingle) {
  explaneHiddenSingle(hiddenSingle);
  delay(500).then(
    () => drawHiddenSingle(hiddenSingle)
  );
}
function drawHiddenSingle(hiddenSingle) {
  let ctx = setUpCanvas()

  // frameCandidate(ctx, hiddenSingle.option, "red")
  markElement(ctx, hiddenSingle.option, "#fc0022", null)
  updateCandidateTemporary(gat(hiddenSingle.firstCell, 'index'), gat(hiddenSingle.option, 'candidatenumber'), true)

  if (hiddenSingle.group == "row") {
    shadeRow(ctx, parseInt(gat(hiddenSingle.firstCell, "row")));
  } else if (hiddenSingle.group == "column") {
    shadeColumn(ctx, parseInt(gat(hiddenSingle.firstCell, "column")));
  } else {
    shadeBlock(ctx, parseInt(gat(hiddenSingle.firstCell, "block")));
  }
  markBlockings(ctx, hiddenSingle)

  ctx.lineWidth   = "0.5";
  joinParagraphWithElement(ctx, gel("thiscell"), hiddenSingle.option, "#004c66", 1);


}
function markBlockings(ctx, hiddenSingle) {
  let areaCell = [];
  if (hiddenSingle.group == "row") {
    areaCell = getRowCells(gat(hiddenSingle.firstCell, 'row'));
  } else if (hiddenSingle.group == "column") {
    areaCell = getColumnCells(gat(hiddenSingle.firstCell, 'column'));
  } else {
    areaCell = getBlockCells(gat(hiddenSingle.firstCell, 'block'));
  }
  for (let i = 0; i < 9; i++) {
    if (gat(areaCell[i], 'value') === '0') {
      const blockingCell = findBlockingCellForCandidate(areaCell[i], gat(hiddenSingle.option, 'candidateNumber'))
      if (blockingCell) {
        markElement(ctx, blockingCell, "rgba(0, 0, 0, 0.3)", null)
        joinElements(ctx, areaCell[i], blockingCell, "rgba(0, 0, 0, 0.3)")
      }
    }
  }
}

function findBlockingCellForCandidate(cell, number) {
  const neighbors = getNeighborhood(cell);
  for (let i = 0; i < neighbors.length; i++) {
    if (gat(neighbors[i], 'value') === number) {
      return neighbors[i]
    }
  }
  return null;
}

function explaneHiddenSingle(hiddenSingle) {
  const tipCloud = gel('tipCloud');
  tipCloud.innerHTML = '';
  sat(tipCloud, "tool", "hiddenSingle");

  const areaIndex = hiddenSingle.group == "row" ? 
                      gat(hiddenSingle.firstCell, "row") :
                      (
                        hiddenSingle.group == "column" ?
                          gat(hiddenSingle.firstCell, "column") :
                          gat(hiddenSingle.firstCell, "block")
                      );
  const area = hiddenSingle.group + " " + areaIndex;

  var paragraph = document.createElement("p");
  sat(paragraph, "class", "xlh");
  paragraph.innerHTML = "a Hidden Single found" ;
  tipCloud.appendChild(paragraph);  

  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  paragraph.innerHTML = "in <span class='explP'>" + area + "</span> only <span class=\"explP\" id=\"thiscell\">this cell</span> can take number " + optionValue(hiddenSingle.option);
  tipCloud.appendChild(paragraph);  
  
  var thismeans = "this means:<br/>";
  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  thismeans = thismeans + "you must select " + optionValue(hiddenSingle.option) + " for this cell";
  paragraph.innerHTML = thismeans;
  tipCloud.appendChild(paragraph);  

}

function cellHasUnicOptionInNeighborhood(destCell, opt) { 
  var block  = gat(destCell, "block");
  var row    = gat(destCell, "row");
  var column = gat(destCell, "column");
  var xIndex = gat(destCell, "index");
  var hiddenSingle = null;
  var optionD = gel("candidate-" + xIndex.toString() + "-" + opt.toString());

  var optionIsUnicInBlock  = 1;
  var optionIsUnicInRow    = 1;
  var optionIsUnicInColumn = 1;
  for (var i = 0; i < 81; i++) {
    if (i != xIndex) {
      var cell = gel("cell-" + i.toString());
      if (gat(cell, "value") == "0") {
        var option = gel("candidate-" + i.toString() + "-" + opt.toString());
        if (gat(cell, "block") == block) {
          if (isCh(option)) {
            if (gat(option, "excluded") == "0") {
              optionIsUnicInBlock = 0;
            }
          }
        }
        if (gat(cell, "row") == row) {
          if (isCh(option)) {
            if (gat(option, "excluded") == "0") {
              optionIsUnicInRow = 0;
            }
          }
        }
        if (gat(cell, "column") == column) {
          if (isCh(option)) {
            if (gat(option, "excluded") == "0") {
              optionIsUnicInColumn = 0;
            }
          }
        }
      }
    }
  }
  if ( optionIsUnicInBlock == 1) {
    hiddenSingle = {firstCell:destCell, option:optionD, group:"block"}
  } else if ( optionIsUnicInRow == 1) {
    hiddenSingle = {firstCell:destCell, option:optionD, group:"row"}
  } else if ( optionIsUnicInColumn == 1) {
    hiddenSingle = {firstCell:destCell, option:optionD, group:"column"}
  }
  return hiddenSingle;
}

export {
  searchHiddenSingle,
  hiddenSingleFound,
}
