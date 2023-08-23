import { gel, gat, sat, isCh, setCh } from '../utils/shortHands.js';
import Bounds from '../utils/bounds.js';

function reportNotFoundTools(caption, element) { 
  element.style.textShadow = "1px 1px red";

  let invalidLabelDivision = gel("invalidLabelDivision");
  invalidLabelDivision.style.visibility = "visible";
  invalidLabelDivision.innerHTML = caption;

  setTimeout(function() { gel("invalidLabelDivision").style.visibility = "hidden"; element.style.textShadow = "none"; }, 1000);


}

function getRowCells(row){
  let unionCells = [];
  for (let i = 0; i < 81; i++) {
    let cell = gel("cell-" + i.toString());
    if (gat(cell, "row") == row) {
      unionCells.push(cell); 
    }
  }
  return unionCells;
}

function getColumnCells(column){
  let unionCells = [];
  for (let i = 0; i < 81; i++) {
    let cell = gel("cell-" + i.toString());
    if (gat(cell, "column") == column) {
      unionCells.push(cell); 
    }
  }
  return unionCells;
}

function getBlockCells(block){
  let unionCells = [];
  for (let i = 0; i < 81; i++) {
    let cell = gel("cell-" + i.toString());
    if (gat(cell, "block") == block) {
      unionCells.push(cell); 
    }
  }
  return unionCells;
}

function getBrotherBlocks(block){
  let blocks = [];
  switch (block) {
    case 0 : {
      blocks = [1, 2, 3, 6];
      break;
    }
    case 1 : {
      blocks = [0, 2, 4, 7];
      break;
    }
    case 2 : {
      blocks = [0, 1, 5, 8];
      break;
    }
    case 3 : {
      blocks = [4, 5, 0, 6];
      break;
    }
    case 4 : {
      blocks = [3, 5, 1, 7];
      break;
    }
    case 5 : {
      blocks = [3, 4, 2, 8];
      break;
    }
    case 6 : {
      blocks = [7, 8, 0, 3];
      break;
    }
    case 7 : {
      blocks = [6, 8, 1, 4];
      break;
    }
    case 8 : {
      blocks = [6, 7, 2, 5];
      break;
    }
  }
  return blocks;
}

function getCellOptions(cell) {
  const cellOptions = [];
  const cellIndex = gat(cell, "index");
  for (let option = 1; option < 10; option++) {
    const candidate = gel("candidate-" + cellIndex + "-" + option.toString());
    if (optionIsExcludable(candidate)) {
      cellOptions.push(candidate);
    }
  }
   
  return cellOptions;
}

function getNeighborhood(cell) {
  let row    = gat(cell, "row");
  let column = gat(cell, "column");
  let block  = gat(cell, "block");
  let neighborhood = [];
  let cellIndex = parseInt(gat(cell, "index"));
  for (let i = 0; i < 81; i++) {
    if (i != cellIndex) {
      let icell      = gel("cell-" + i.toString());
      let cellRow    = gat(icell, "row");
      let cellColumn = gat(icell, "column");
      let cellBlock  = gat(icell, "block");
      if ((cellRow == row) || (cellColumn == column) || (cellBlock == block)) {
        neighborhood.push(icell);
      }
    }
  }
   
  return neighborhood;
}

function getNeighborAreas(cell) {
  let row    = gat(cell, "row");
  let column = gat(cell, "column");
  let block  = gat(cell, "block");
  let rowNeighbors = [];
  let columnNeighbors = [];
  let blockNeighbors = [];
  let cellIndex = parseInt(gat(cell, "index"));
  for (let i = 0; i < 81; i++) {
    if (i != cellIndex) {
      let icell      = gel("cell-" + i.toString());
      let cellRow    = gat(icell, "row");
      let cellColumn = gat(icell, "column");
      let cellBlock  = gat(icell, "block");
      if (cellRow == row) {
        rowNeighbors.push(icell);
      }
      if (cellColumn == column) {
        columnNeighbors.push(icell);
      }
      if (cellBlock == block) {
        blockNeighbors.push(icell);
      }
    }
  }
   
  return {
    rowNeighbors: rowNeighbors,
    columnNeighbors: columnNeighbors,
    blockNeighbors: blockNeighbors
  };
}

function getNeighborsWith2Candidates(cell) {
  let neighborhood = getNeighborhood(cell);
  let neighborsWith2Candidates = [];
  for (let i = 0; i < neighborhood.length; i++) {
    let cellOptions = getCellOptions(neighborhood[i]);
    if (cellOptions.length == 2) {
      neighborsWith2Candidates.push(neighborhood[i]);
    }
  }
  return neighborsWith2Candidates;
}

function cellsAreNeighbors(cell1, cell2) {
  let row1    = gat(cell1, "row");
  let column1 = gat(cell1, "column");
  let block1  = gat(cell1, "block");
  let row2    = gat(cell2, "row");
  let column2 = gat(cell2, "column");
  let block2  = gat(cell2, "block");
  return ((row1 == row2) || (column1 == column2) || (block1 == block2)) ;
}

function optionsContainOption(options, option) {
  let optionValue = gat(option, "value");
  for (let i = 0; i < options.length; i++) {
    if (gat(options[i], "value") == optionValue) {
      return true;
    }
  }
  return false;
}

function optionIsExcludable(candidate) {
  return isCh(candidate) && (gat(candidate, "excluded") == "0");
}

function getOption(cellIndex, option) {
  return gel("option" + cellIndex + "-" + option.toString());
}

function getSOption(cell, option) {
  return gel("candidate-" + gat(cell, "index") + "-" + option.toString());
}

function optionValue(option) {
  return gat(option, "value");
}

function optionAppearancesCount(cells, opt) {
  let cnt = 0;
  for (let i = 0; i < cells.length; i++) {
    let option = getSOption(cells[i], opt);
    if (optionIsExcludable(option)) {
      cnt++;
    }
  }
  return cnt;
}

function optionAppearancesInUnit(cells, opt) {
  let appearances = [];
  for (let i = 0; i < cells.length; i++) {
    let option = getSOption(cells[i], opt);
    if (optionIsExcludable(option)) {
       appearances.push(option);
    }
  }
  return appearances;
}

function getNeighborsWithExcludableOption(cell, option) {
  let neighborhood = getNeighborhood(cell);
  let neighbors    = [];
  for (let i = 0; i < neighborhood.length; i++) {
    let candidate = getSOption(neighborhood[i], option);
    if (optionIsExcludable(candidate)) {
      neighbors.push(neighborhood[i]);
    }
  }
  return neighbors;
}

function getNeighborhoodExcludableOptions(cell, opt) {
  let neighborhood = getNeighborhood(cell);
  let neighbors    = [];
  let options      = [];
  for (let i = 0; i < neighborhood.length; i++) {
    let option = getSOption(neighborhood[i], opt);
    if (optionIsExcludable(option)) {
      neighbors.push(neighborhood[i]);
      options.push(option);
    }
  }
  return {neighbors:neighbors, options:options};
}

function getNeighborhoodExcludableOptionsAwayFrom(cell, opt, awayFromCells) {
  let neighborhood = getNeighborhood(cell);
  let neighbors    = [];
  let options      = [];
  for (let i = 0; i < neighborhood.length; i++) {
    if (!awayFromCells.includes(neighborhood[i])) {
      let option = getSOption(neighborhood[i], opt);
      if (optionIsExcludable(option)) {
        neighbors.push(neighborhood[i]);
        options.push(option);
      }
    }
  }
  return {neighbors:neighbors, options:options};
}

function arrayInitWithArray(items) {
  let newArray = [];
  for (let i = 0; i < items.length; i++) {
    newArray.push(items[i]);
  }
  return newArray;
}

function isExclude(option) { 
  return (gat(option, "excluded") == "1");
}

function candidateRow(candidate) { 
  return gat(gel("cell-" + gat(candidate, "cellIndex")), "row");
}

function candidateColumn(candidate) { 
  return gat(gel("cell-" + gat(candidate, "cellIndex")), "column");
}
  
function markElement(ctx, element, color, fill) {

  let rect = element.getBoundingClientRect();
  let rad = (rect.height / 2);
  let cX = rect.left - 0.5 + rad;
  let cY = rect.top - 0.5 + rad;
  
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.ellipse(cX, cY, rad, rad, 0, 0, 2 * Math.PI);
  if (fill ) { 
    ctx.fillStyle = fill; 
    ctx.fill(); 
  }
  ctx.stroke();

}

function markSqElement(ctx, element, color, fill) {

  let rect = element.getBoundingClientRect();
  if (fill ) { 
    ctx.fillStyle = fill; 
    ctx.fillRect(rect.left - 0.5, rect.top - 0.5, rect.width, rect.height);
  }
  ctx.strokeStyle = color;
  ctx.strokeRect(rect.left - 0.5, rect.top - 0.5, rect.width, rect.height);

}

function joinElements(ctx, element1, element2, color) {
  ctx.strokeStyle = color;

  let rect = element1.getBoundingClientRect();
  let w = (rect.width / 2);
  let h = (rect.height / 2);
  let cX = rect.left - 0.5 + w;
  let cY = rect.top - 0.5 + h;

  ctx.beginPath();
  ctx.moveTo(cX, cY);
  rect = element2.getBoundingClientRect();
  w = (rect.width / 2);
  h = (rect.height / 2);
  cX = rect.left - 0.5 + w;
  cY = rect.top - 0.5 + h;
  ctx.lineTo(cX, cY);
  ctx.stroke();


}

function joinParagraphWithElement(ctx, paragraph, element, color, lineWidth) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  let paragraphRect = paragraph.getBoundingClientRect();
  let elementRect = element.getBoundingClientRect();

  let w = (paragraphRect.width / 2);
  let h = (paragraphRect.height);
  let cX;
  let cY;
  cX = paragraphRect.left + w;
  if (paragraphRect.top < elementRect.top) {
    cY = paragraphRect.top + h;
  } else {
    cY = paragraphRect.top;
  }
  ctx.moveTo(cX, cY);
  
  w = (elementRect.width / 2);
  h = (elementRect.height / 2);
  cX = elementRect.left + w;
  cY = elementRect.top + h;
  ctx.lineTo(cX, cY);
  ctx.stroke();
}

function getGrid() {
  let rows    = [];
  let columns = [];
  let blocks  = [];
  for (let i = 0; i < 9; i++) {
    rows.push(getRowCells(i));
    columns.push(getColumnCells(i));
    blocks.push(getBlockCells(i));
  }
  return {rows:rows, columns:columns, blocks:blocks};
}

function shadeRow(ctx, row) {
  let firstInRowIndex = row * 9;
  let leftCell = gel("cell-" + (firstInRowIndex).toString());
  let rightCell = gel("cell-" + (firstInRowIndex + 8).toString());
  let leftRect = leftCell.getBoundingClientRect();
  let rightRect = rightCell.getBoundingClientRect();
  let rect = new Bounds(leftRect.left, leftRect.top, rightRect.right - leftRect.left, rightRect.height);
  ctx.fillStyle = "rgba(0,0,0,0.2)"; 
  ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
}

function shadeColumn(ctx, column) {
  let topCell = gel("cell-" + (column).toString());
  let bottomCell = gel("cell-" + (72 + column).toString());
  let topRect = topCell.getBoundingClientRect();
  let bottomRect = bottomCell.getBoundingClientRect();
  let rect = new Bounds(topRect.left, topRect.top, bottomRect.width, bottomRect.bottom - topRect.top);
  ctx.fillStyle = "rgba(0,0,0,0.2)"; 
  ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
}

function shadeBlock(ctx, block) {
  let element = gel("block-" + block);
  let rect = element.getBoundingClientRect();
  
  ctx.fillStyle = "rgba(0,0,0,0.2)"; 
  ctx.fillRect(rect.left, rect.top, rect.width, rect.height);

}

function joinParagraphWithRow(ctx, paragraph, row) {
  let cI = parseInt(row * 9);
  let cell = gel("cell-" + (cI).toString());
  ctx.lineWidth   = "0.5";
  ctx.strokeStyle = "#004c66"; 

  let rect = paragraph.getBoundingClientRect();
  let w = (rect.width / 2);
  let h = (rect.height);
  
  let cX = rect.left + w + w;
  let cY = rect.top + (h/2);
  ctx.beginPath();
  ctx.moveTo(cX, cY);

  rect = cell.getBoundingClientRect();
  w = rect.width / 3;
  cX = rect.left - (w / 2) - 2;
  cY = rect.top + w + (w / 2);
  ctx.lineTo(cX, cY);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(cX, cY, (w / 2), (w / 2), 0, 0, 2 * Math.PI);
  ctx.fillStyle = "#004c66"; 
  ctx.fill(); 

}

function joinParagraphWithColumn(ctx, paragraph, column) {
  let cI = column;
  let cell = gel("cell-" + (cI).toString());
  ctx.lineWidth   = "0.5";
  ctx.strokeStyle = "#004c66"; 
  
  let rect = paragraph.getBoundingClientRect();
  let w = (rect.width / 2);
  let h = (rect.height);
  
  let cX = rect.left + w + w;
  let cY = rect.top + (h/2);
  ctx.beginPath();
  ctx.moveTo(cX, cY);

  rect = cell.getBoundingClientRect();
  w = rect.width / 3;
  cX = rect.left + w + (w / 2);
  cY = rect.top - (w / 2) - 2;
  ctx.lineTo(cX, cY);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(cX, cY, (w / 2), (w / 2), 0, 0, 2 * Math.PI);
  ctx.fillStyle = "#004c66"; 
  ctx.fill(); 

}

function clearDrawDivision() {
  let drawDivision = gel("canvasView");
  let ctx = drawDivision.getContext("2d");
  ctx.clearRect(0, 0, drawDivision.width, drawDivision.height);

  let explaneDivision = gel("canvasView");
   while (explaneDivision.firstChild) {
    explaneDivision.removeChild(explaneDivision.firstChild);
  }
  sat(explaneDivision, "tool", "");
}

function locateTipCloud(cell, width = 4, height = 3) {
  let row = parseInt(gat(cell, 'row'), 10);
  let column = parseInt(gat(cell, 'column'), 10);
  let blockRow = row % 3;
  let blockColumn = column % 3;

  let topLeftCell = null;
  if (column <  5) {
    if (row < 5 ) {
      let index = ((row + (3 - blockRow))* 9) + column + (3 - blockColumn);
      topLeftCell = gel(`cell-${index}`);
    } else {
      let index = ((row - blockRow - height)* 9) + column + (3 - blockColumn);
      topLeftCell = gel(`cell-${index}`);
    }
  } else {
    if (row < 5 ) {
      let index = ((row + (3 - blockRow))* 9) + column - 4 - blockColumn;
      topLeftCell = gel(`cell-${index}`);
    } else {
      let index = ((row - blockRow - height)* 9) + column - 4 - blockColumn;
      topLeftCell = gel(`cell-${index}`);
    }
  }

  let topLeftCellBounds = new Bounds();
  topLeftCellBounds.getRect(topLeftCell);

  let bound = new Bounds(
    topLeftCellBounds.left,
    topLeftCellBounds.top,
    topLeftCellBounds.width * width,
    topLeftCellBounds.height * height
  );

  let tipCloud = gel('tipCloud');
  tipCloud.style.fontSize = `${topLeftCellBounds.width / 6}px`;
  tipCloud.style.opacity = 0.9;
  bound.bound(tipCloud);
}

function setUpCanvas() {
  let mainRect = gel('main').getBoundingClientRect();

  let canvas = document.getElementById('canvasView');
  let ctx = canvas.getContext('2d');
  window.devicePixelRatio = 2;
  let size = Math.max(mainRect.width, mainRect.height);
  
  canvas.style.width = size + "px";
  canvas.style.height = size + "px";
  let scale = window.devicePixelRatio;
  
  canvas.width = Math.floor(size * scale);
  canvas.height = Math.floor(size * scale);
  
  ctx.scale(scale, scale);
  return ctx
}

function frameCandidate(ctx, candidate, color) {
  let rect = candidate.getBoundingClientRect();

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.roundRect(rect.left, rect.top, rect.width, rect.height, 2);
  ctx.stroke();
}

function emptyCells() {
  let cells = [];
  for (let ci = 0; ci < 81; ci++) {
    let cell = gel("cell-" + ci.toString());
    if (gat(cell, "value") === '0') {
      cells.push(cell);
    }
  }
  return cells;
}

function isNumberInArea(area, number) {

}

function cellHasExcludedCandidate(cell, option) {
  let cellIndex = gat(cell, "index");
  let excludedCandidate = gel("candidate-" + cellIndex + "-" + option);
  return gat(excludedCandidate, "exclude") == "1"
}

function cellAcceptsCandidate(cell, option) {
  if (gat(cell, 'value') != '0') return false
  if (cellHasExcludedCandidate(cell, option)) return false
  
  let neighborhood = getNeighborhood(cell);

  for (let i = 0; i < neighborhood.length; i++){
    if (gat(neighborhood[i], "value") === option) return false
  }

  return true
}

function rowNeightbors(cell) {
  let cells = [];

}

function cellsArrayNumberHolderCell(cells, number) {
  for (let i = 0; i < cells.length; i++) {
    if (gat(cells[i], 'value') === number) return cells[i]
  }
  return null;
}

function updateCandidateTemporary(cellIndex, candidateNumber, check) {
  let candidate = gel('candidate-' + cellIndex + '-' + candidateNumber);
  if (isCh(candidate) && check) return

  let visibilityClass = check ? '' : ' hidden';

  candidate.className = 'cell-candidate ' + visibilityClass;
  candidate.innerHTML = candidateNumber;
  setCh(candidate, check);
  sat(candidate, 'tempMark', check ? "1" : null)
}

function removeTemporaryCandidates() {
  for (let i = 0; i < 81; i++) {
    for (let c = 1; c < 10; c++) {
      let candidate = gel('candidate-' + i.toString() + '-' + c.toString())
      if (gat(candidate, 'tempMark') === '1') {
        updateCandidateTemporary(i.toString(), c.toString(), false)
      }
    }
  }
}
function cellLabel(cell) {
  var row = (parseInt(gat(cell, "row"), 10)    + 1).toString();
  var col = (parseInt(gat(cell, "column"), 10) + 1).toString();
  return "R" + row + "C" + col;
}
export {
  cellLabel,
  shadeRow,
  shadeColumn,
  shadeBlock,
  clearDrawDivision,
  optionIsExcludable,
  joinParagraphWithElement,
  locateTipCloud,
  setUpCanvas,
  frameCandidate,
  emptyCells,
  getNeighborhood,
  cellAcceptsCandidate,
  cellsArrayNumberHolderCell,
  markElement,
  updateCandidateTemporary,
  removeTemporaryCandidates,
  getRowCells,
  getColumnCells,
  getBlockCells,
  joinElements,
  joinParagraphWithColumn,
  joinParagraphWithRow,
  getBrotherBlocks,
  getCellOptions,
  getNeighborsWithExcludableOption,
  optionsContainOption,
  arrayInitWithArray,
  getSOption,
}
