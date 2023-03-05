import { singleTip } from './advanced_singles.js';

function reportNotFoundTools(caption, element) { 
  element.style.textShadow = "1px 1px red";

  var invalidLabelDivision = _el("invalidLabelDivision");
  invalidLabelDivision.style.visibility = "visible";
  invalidLabelDivision.innerHTML = caption;

  setTimeout(function() { _el("invalidLabelDivision").style.visibility = "hidden"; element.style.textShadow = "none"; }, 1000);


}

function getRowCells(row){
  var unionCells = [];
  for (var i = 0; i < 81; i++) {
    var cell = _el("cell" + i.toString());
    if (_gAttEl(cell, "row") == row) {
      unionCells.push(cell); 
    }
  }
  return unionCells;
}

function getColumnCells(column){
  var unionCells = [];
  for (var i = 0; i < 81; i++) {
    var cell = _el("cell" + i.toString());
    if (_gAttEl(cell, "column") == column) {
      unionCells.push(cell); 
    }
  }
  return unionCells;
}

function getBlockCells(block){
  var unionCells = [];
  for (var i = 0; i < 81; i++) {
    var cell = _el("cell" + i.toString());
    if (_gAttEl(cell, "block") == block) {
      unionCells.push(cell); 
    }
  }
  return unionCells;
}

function getBrotherBlocks(block){
  var blocks = [];
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
  var cellOptions = [];
  var cellIndex = _gAttEl(cell, "cellIndex");
  for (var i = 1; i < 10; i++) {
    var option = _el("option" + cellIndex + "-" + i.toString());
    if (optionIsExcludable(option)) {
      cellOptions.push(option);
    }
  }
   
  return cellOptions;
}

function getNeighborhood(cell) {
  var row    = _gAttEl(cell, "row");
  var column = _gAttEl(cell, "column");
  var block  = _gAttEl(cell, "block");
  var neighborhood = [];
  var cellIndex = parseInt(_gAttEl(cell, "cellIndex"));
  for (var i = 0; i < 81; i++) {
    if (i != cellIndex) {
      var icell      = _el("cell" + i.toString());
      var cellRow    = _gAttEl(icell, "row");
      var cellColumn = _gAttEl(icell, "column");
      var cellBlock  = _gAttEl(icell, "block");
      if ((cellRow == row) || (cellColumn == column) || (cellBlock == block)) {
        neighborhood.push(icell);
      }
    }
  }
   
  return neighborhood;
}

function getNeighborsWith2Candidates(cell) {
  var neighborhood = getNeighborhood(cell);
  var neighborsWith2Candidates = [];
  for (var i = 0; i < neighborhood.length; i++) {
    var cellOptions = getCellOptions(neighborhood[i]);
    if (cellOptions.length == 2) {
      neighborsWith2Candidates.push(neighborhood[i]);
    }
  }
  return neighborsWith2Candidates;
}

function cellsAreNeighbors(cell1, cell2) {
  var row1    = _gAttEl(cell1, "row");
  var column1 = _gAttEl(cell1, "column");
  var block1  = _gAttEl(cell1, "block");
  var row2    = _gAttEl(cell2, "row");
  var column2 = _gAttEl(cell2, "column");
  var block2  = _gAttEl(cell2, "block");
  return ((row1 == row2) || (column1 == column2) || (block1 == block2)) ;
}

function optionsContainOption(options, option) {
  var optionValue = _gAttEl(option, "value");
  for (var i = 0; i < options.length; i++) {
    if (_gAttEl(options[i], "value") == optionValue) {
      return true;
    }
  }
  return false;
}

function optionIsExcludable(option) {
  return _isChEl(option) && (_gAttEl(option, "excluded") == "0");
}

function getOption(cellIndex, option) {
  return _el("option" + cellIndex + "-" + option.toString());
}

function getSOption(cell, option) {
  return _el("option" + _gAttEl(cell, "cellIndex") + "-" + option.toString());
}

function optionValue(option) {
  return _gAttEl(option, "value");
}

function optionAppearancesCount(cells, opt) {
  var cnt = 0;
  for (var i = 0; i < cells.length; i++) {
    var option = getSOption(cells[i], opt);
    if (optionIsExcludable(option)) {
      cnt++;
    }
  }
  return cnt;
}

function optionAppearancesInUnit(cells, opt) {
  var appearances = [];
  for (var i = 0; i < cells.length; i++) {
    var option = getSOption(cells[i], opt);
    if (optionIsExcludable(option)) {
       appearances.push(option);
    }
  }
  return appearances;
}

function getNeighborsWithExcludableOption(cell, opt) {
  var neighborhood = getNeighborhood(cell);
  var neighbors    = [];
  for (var i = 0; i < neighborhood.length; i++) {
    var option = getSOption(neighborhood[i], opt);
    if (optionIsExcludable(option)) {
      neighbors.push(neighborhood[i]);
    }
  }
  return neighbors;
}

function getNeighborhoodExcludableOptions(cell, opt) {
  var neighborhood = getNeighborhood(cell);
  var neighbors    = [];
  var options      = [];
  for (var i = 0; i < neighborhood.length; i++) {
    var option = getSOption(neighborhood[i], opt);
    if (optionIsExcludable(option)) {
      neighbors.push(neighborhood[i]);
      options.push(option);
    }
  }
  return {neighbors:neighbors, options:options};
}

function getNeighborhoodExcludableOptionsAwayFrom(cell, opt, awayFromCells) {
  var neighborhood = getNeighborhood(cell);
  var neighbors    = [];
  var options      = [];
  for (var i = 0; i < neighborhood.length; i++) {
    if (!awayFromCells.includes(neighborhood[i])) {
      var option = getSOption(neighborhood[i], opt);
      if (optionIsExcludable(option)) {
        neighbors.push(neighborhood[i]);
        options.push(option);
      }
    }
  }
  return {neighbors:neighbors, options:options};
}

function arrayInitWithArray(items) {
  var newArray = [];
  for (var i = 0; i < items.length; i++) {
    newArray.push(items[i]);
  }
  return newArray;
}

function isExclude(option) { 
  return (_gAttEl(option, "excluded") == "1");
}

function candidateRow(candidate) { 
  return _gAttEl(_el("cell" + _gAttEl(candidate, "cellIndex")), "row");
}

function candidateColumn(candidate) { 
  return _gAttEl(_el("cell" + _gAttEl(candidate, "cellIndex")), "column");
}
  
function markElement(ctx, drect, element, color, fill) {

  var rect = element.getBoundingClientRect();
  var rad = (rect.height / 2);
  var cX = rect.left - drect.left - 0.5 + rad;
  var cY = rect.top - drect.top - 0.5 + rad;
  
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.ellipse(cX, cY, rad, rad, 0, 0, 2 * Math.PI);
  if (fill ) { 
    ctx.fillStyle = fill; 
    ctx.fill(); 
  }
  ctx.stroke();

}

function markSqElement(ctx, drect, element, color, fill) {

  var rect = element.getBoundingClientRect();
  if (fill ) { 
    ctx.fillStyle = fill; 
    ctx.fillRect(rect.left - drect.left - 0.5, rect.top - drect.top - 0.5, rect.width, rect.height);
  }
  ctx.strokeStyle = color;
  ctx.strokeRect(rect.left - drect.left - 0.5, rect.top - drect.top - 0.5, rect.width, rect.height);

}

function joinElements(ctx, drect, element1, element2, color) {
  ctx.strokeStyle = color;

  var rect = element1.getBoundingClientRect();
  var w = (rect.width / 2);
  var h = (rect.height / 2);
  var cX = rect.left - drect.left - 0.5 + w;
  var cY = rect.top - drect.top - 0.5 + h;

  ctx.beginPath();
  ctx.moveTo(cX, cY);
  rect = element2.getBoundingClientRect();
  w = (rect.width / 2);
  h = (rect.height / 2);
  cX = rect.left - drect.left - 0.5 + w;
  cY = rect.top - drect.top - 0.5 + h;
  ctx.lineTo(cX, cY);
  ctx.stroke();


}

function joinParagraphWithElement(ctx, drect, paragraph, element, color) {
  ctx.strokeStyle = color;

  var rect = paragraph.getBoundingClientRect();
  var w = (rect.width / 2);
  var h = (rect.height);
  var cX = rect.left - drect.left - 0.5;
  var cY = rect.top - drect.top - 0.5 + h;
  ctx.beginPath();
  //ctx.moveTo(cX, cY);
  cX = rect.left - drect.left - 0.5 + w + w;
  cY = rect.top - drect.top - 0.5 + h;
  //ctx.lineTo(cX, cY);
  //ctx.stroke();

  cX = rect.left - drect.left + w + w;
  cY = rect.top - drect.top + (h/2);
  ctx.beginPath();
  ctx.moveTo(cX, cY);
  rect = element.getBoundingClientRect();
  w = (rect.width / 2);
  h = (rect.height / 2);
  cX = rect.left - drect.left - 0.5 + w;
  cY = rect.top - drect.top - 0.5 + h;
  ctx.lineTo(cX, cY);
  ctx.stroke();


}

function getGrid() {
  var rows    = [];
  var columns = [];
  var blocks  = [];
  for (var i = 0; i < 9; i++) {
    rows.push(getRowCells(i));
    columns.push(getColumnCells(i));
    blocks.push(getBlockCells(i));
  }
  return {rows:rows, columns:columns, blocks:blocks};
}

function shadeRow(ctx, drect, row) {
  var cI = parseInt(row * 9);
  var cell = _el("cell" + (cI).toString());
  var rect = cell.getBoundingClientRect();
  ctx.fillStyle = "rgba(0,0,0,0.2)"; 
  ctx.fillRect(rect.left - drect.left - 0.5, rect.top - drect.top - 0.5, 562, rect.height);

}

function shadeColumn(ctx, drect, column) {
  var cI = column;
  var cell = _el("cell" + (cI).toString());
  var rect = cell.getBoundingClientRect();
  ctx.fillStyle = "rgba(0,0,0,0.2)"; 
  ctx.fillRect(rect.left - drect.left - 0.5, rect.top - drect.top - 0.5, rect.width, 562);

}

function shadeBlock(ctx, drect, block) {
  var element = _el("block" + block);
  var rect = element.getBoundingClientRect();
  
  ctx.fillStyle = "rgba(0,0,0,0.2)"; 
  ctx.fillRect(rect.left - drect.left + 0.5, rect.top - drect.top + 0.5, rect.width, rect.height);

  

}

function joinParagraphWithRow(ctx, drect, paragraph, row) {
  var cI = parseInt(row * 9);
  var cell = _el("cell" + (cI).toString());
  ctx.lineWidth   = "0.5";
  ctx.strokeStyle = "#004c66"; 

  var rect = paragraph.getBoundingClientRect();
  var w = (rect.width / 2);
  var h = (rect.height);
  
  var cX = rect.left - drect.left + w + w;
  var cY = rect.top - drect.top + (h/2);
  ctx.beginPath();
  ctx.moveTo(cX, cY);

  rect = cell.getBoundingClientRect();
  w = rect.width / 3;
  cX = rect.left - drect.left - (w / 2) - 2;
  cY = rect.top - drect.top + w + (w / 2);
  ctx.lineTo(cX, cY);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(cX, cY, (w / 2), (w / 2), 0, 0, 2 * Math.PI);
  ctx.fillStyle = "#004c66"; 
  ctx.fill(); 

}

function joinParagraphWithColumn(ctx, drect, paragraph, column) {
  var cI = column;
  var cell = _el("cell" + (cI).toString());
  ctx.lineWidth   = "0.5";
  ctx.strokeStyle = "#004c66"; 
  
  var rect = paragraph.getBoundingClientRect();
  var w = (rect.width / 2);
  var h = (rect.height);
  
  var cX = rect.left - drect.left + w + w;
  var cY = rect.top - drect.top + (h/2);
  ctx.beginPath();
  ctx.moveTo(cX, cY);

  rect = cell.getBoundingClientRect();
  w = rect.width / 3;
  cX = rect.left - drect.left + w + (w / 2);
  cY = rect.top - drect.top - (w / 2) - 2;
  ctx.lineTo(cX, cY);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(cX, cY, (w / 2), (w / 2), 0, 0, 2 * Math.PI);
  ctx.fillStyle = "#004c66"; 
  ctx.fill(); 

}

function searchAdvancedTip() {
  singleTip()
}

export {
  searchAdvancedTip,
}
