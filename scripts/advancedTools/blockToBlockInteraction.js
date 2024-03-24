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
  cellsArrayNumberHolderCell,
  markElement,
  updateCandidateTemporary,
  getBlockCells,
  joinParagraphWithColumn,
  joinParagraphWithRow,
  getBrotherBlocks,
  joinElements,
  rowLabel,
  columnLabel,
  blockLabel,
  candidateRow,
  candidateColumn,
} from './advanced.js';
import { gel, gat, sat, isCh, optionValue, crel, doc, delay } from '../utils/shortHands.js';

function searchBlockToBlockInteraction() {
  for (let block = 0; block < 9; block++) {
    const blockCells = getBlockCells(block);
    for (let option = 1; option < 10; option++) {
      const b2bInteraction = findB2BlockInteractionOnCandidate(block, blockCells, option);
      if (b2bInteraction) {
        return b2bInteraction;
      }
    }
  }
   
  return null;
}

function blockToBlockInteractionFound(blockToBlockInteraction) {
  explaneBlockToBlockInteraction(blockToBlockInteraction);
  delay(500).then(
    () => drawBlockToBlockInteraction(blockToBlockInteraction)
  );
}

function findB2BlockInteractionOnCandidate(block, blockCells, option) {
  const b2bRowInteraction = findB2BlockInteractionOnRowsOnCandidate(block, blockCells, option);
  if (b2bRowInteraction) {
    return b2bRowInteraction;
  }
  const b2bColumnInteraction = findB2BlockInteractionOnColumnsOnCandidate(block, option);
  if (b2bColumnInteraction) {
    return b2bColumnInteraction;
  }
  return null;
}
function findB2BlockInteractionOnRowsOnCandidate(block, blockCells, option) {
  var my2Rows = my2RowsWithCandidate(block, option);
  if (my2Rows.length > 1) {
    var brotherBlocks     = getBrotherBlocks(block);
    var myBrother2Rows = my2RowsWithCandidate(brotherBlocks[0], option);
    if (myBrother2Rows.length > 1) {
      if (((my2Rows[0] == myBrother2Rows[0]) && (my2Rows[1] == myBrother2Rows[1])) || ((my2Rows[0] == myBrother2Rows[1]) && (my2Rows[1] == myBrother2Rows[0]))) {
        var b2bInteraction = initB2BlockInteractionOnRowsOnCandidate(block, brotherBlocks[0], brotherBlocks[1], my2Rows, myBrother2Rows, option);
        if (b2bInteraction) {
          return b2bInteraction;
        }
      }
    }
    myBrother2Rows = my2RowsWithCandidate(brotherBlocks[1], option);
    if (myBrother2Rows.length > 1) {
      if (((my2Rows[0] == myBrother2Rows[0]) && (my2Rows[1] == myBrother2Rows[1])) || ((my2Rows[0] == myBrother2Rows[1]) && (my2Rows[1] == myBrother2Rows[0]))) {
        var b2bInteraction = initB2BlockInteractionOnRowsOnCandidate(block, brotherBlocks[1], brotherBlocks[0], my2Rows, myBrother2Rows, option);
        if (b2bInteraction) {
          return b2bInteraction;
        }
      }
    }
  }
  return null;
}
function findB2BlockInteractionOnColumnsOnCandidate(block, option) {
  var my2Columns = my2ColumnsWithCandidate(block, option);
  if (my2Columns.length > 1) {
    var brotherBlocks     = getBrotherBlocks(block);
    var myBrother2Columns = my2ColumnsWithCandidate(brotherBlocks[2], option);
    if (myBrother2Columns.length > 1) {
      if (((my2Columns[0] == myBrother2Columns[0]) && (my2Columns[1] == myBrother2Columns[1])) || ((my2Columns[0] == myBrother2Columns[1]) && (my2Columns[1] == myBrother2Columns[0]))) {
        var b2bInteraction = initB2BlockInteractionOnColumnsOnCandidate(block, brotherBlocks[2], brotherBlocks[3], my2Columns, myBrother2Columns, option);
        if (b2bInteraction) {
          return b2bInteraction;
        }
      }
    }
    myBrother2Columns = my2ColumnsWithCandidate(brotherBlocks[3], option);
    if (myBrother2Columns.length > 1) {
      if (((my2Columns[0] == myBrother2Columns[0]) && (my2Columns[1] == myBrother2Columns[1])) || ((my2Columns[0] == myBrother2Columns[1]) && (my2Columns[1] == myBrother2Columns[0]))) {
        var b2bInteraction = initB2BlockInteractionOnColumnsOnCandidate(block, brotherBlocks[3], brotherBlocks[2], my2Columns, myBrother2Columns, option);
        if (b2bInteraction) {
          return b2bInteraction;
        }
      }
    }
  }

  return null;
}
function my2RowsWithCandidate(block, option) {
  var my2Rows = [];
  var cells = getBlockCells(block);
  for (let c = 0; c < cells.length; c++) {
    var cell = cells[c];
    if (gat(cell, 'value') === '0') {
      var cellIndex = gat(cell, "index");
      var candidate = gel("candidate-" + cellIndex + "-" + option.toString());
      if (optionIsExcludable(candidate)) {
        var row = gat(cell, "row");
        if (!my2Rows.includes(row)) {
          my2Rows.push(row);
        }
      }
    }
  }
  if (my2Rows.length == 2) {
    return my2Rows;
  }
  return [];
}
function my2ColumnsWithCandidate(block, option) {
  var my2Columns = [];
  var cells = getBlockCells(block);
  for (let c = 0; c < cells.length; c++) {
    var cell = cells[c];
    if (gat(cell, 'value') === '0') {
      var cellIndex = gat(cell, "index");
      var candidate = gel("candidate-" + cellIndex + "-" + option.toString());
      if (optionIsExcludable(candidate)) {
        var column = gat(cell, "column");
        if (!my2Columns.includes(column)) {
          my2Columns.push(column);
        }
      }
    }
  }
  if (my2Columns.length == 2) {
    return my2Columns;
  }
  return [];
}
function initB2BlockInteractionOnRowsOnCandidate(block, brother, target, my2Rows, myBrother2Rows, option) {
  var excludes   = [];
  var targetBlockCells = getBlockCells(target);
  for (let c = 0; c < targetBlockCells.length; c++) {
    var cell = targetBlockCells[c];
    if (gat(cell, 'value') === '0') {
      var row = gat(cell, "row");
      if ((row == my2Rows[0]) || (row == my2Rows[1])) {
        var cellIndex = gat(cell, "index");
        var candidate = gel("candidate-" + cellIndex + "-" + option.toString());
        if (optionIsExcludable(candidate)) {
          excludes.push(candidate);
        }
      }
    }
  }
  if (excludes.length > 0) {
    var candidateCells = [];
    var candidates     = [];
    var blockCells        = getBlockCells(block);
    var brotherBlockCells = getBlockCells(brother);
    for (let c = 0; c < blockCells.length; c++) {
      var cell = blockCells[c];
      var cellIndex = gat(cell, "index");
      var candidate = gel("candidate-" + cellIndex + "-" + option.toString());
      if (optionIsExcludable(candidate)) {
        candidateCells.push(cell);
        candidates.push(candidate);
      }
      cell = brotherBlockCells[c];
      cellIndex = gat(cell, "index");
      candidate = gel("candidate-" + cellIndex + "-" + option.toString());
      if (optionIsExcludable(candidate)) {
        candidateCells.push(cell);
        candidates.push(candidate);
      }

    }
    return {flow:"rows",  candidateCells:candidateCells, candidates:candidates, excludes:excludes, block:block, brother:brother, target:target, candidate:option, my2Rows:my2Rows, myBrother2Rows:myBrother2Rows};
  }
  
  return null;
}
function initB2BlockInteractionOnColumnsOnCandidate(block, brother, target, my2Columns, myBrother2Columns, option) {
  var excludes   = [];
  var targetBlockCells = getBlockCells(target);
  for (let c = 0; c < targetBlockCells.length; c++) {
    var cell = targetBlockCells[c];
    if (gat(cell, 'value') === '0') {
      var column = gat(cell, "column");
      if ((column == my2Columns[0]) || (column == my2Columns[1])) {
        var cellIndex = gat(cell, "index");
        var candidate = gel("candidate-" + cellIndex + "-" + option.toString());
        if (optionIsExcludable(candidate)) {
          excludes.push(candidate);
        }
      }
    }
  }
  if (excludes.length > 0) {
    var candidateCells = [];
    var candidates     = [];
    var blockCells        = getBlockCells(block);
    var brotherBlockCells = getBlockCells(brother);
    for (let c = 0; c < blockCells.length; c++) {
      var cell = blockCells[c];
      var cellIndex = gat(cell, "index");
      var candidate = gel("candidate-" + cellIndex + "-" + option.toString());
      if (optionIsExcludable(candidate)) {
        candidateCells.push(cell);
        candidates.push(candidate);
      }
      cell = brotherBlockCells[c];
      cellIndex = gat(cell, "index");
      candidate = gel("candidate-" + cellIndex + "-" + option.toString());
      if (optionIsExcludable(candidate)) {
        candidateCells.push(cell);
        candidates.push(candidate);
      }

    }
    return {flow:"columns",  candidateCells:candidateCells, candidates:candidates, excludes:excludes, block:block, brother:brother, target:target, candidate:option, my2Columns:my2Columns, myBrother2Columns:myBrother2Columns};
  }
  
  return null;
}

function explaneBlockToBlockInteraction(b2bInteraction) {
  let tipCloud = gel('tipCloud');
  tipCloud.innerHTML = '';
  sat(tipCloud, "tool", "hiddenSingle");

  var block1 = blockLabel(parseInt(b2bInteraction.block));
  var block2 = blockLabel(parseInt(b2bInteraction.brother));
  var target = blockLabel(parseInt(b2bInteraction.target));
  var my2Rows1    = "";
  var my2Rows2    = ""
  var my2Columns1 = "";
  var my2Columns2 = "";
  if (b2bInteraction.flow == "rows") {
    my2Rows1    = rowLabel(parseInt(b2bInteraction.my2Rows[0]));
    my2Rows2    = rowLabel(parseInt(b2bInteraction.my2Rows[1]) + 1);
  } else {
    my2Columns1 = columnLabel(parseInt(b2bInteraction.my2Columns[0]));
    my2Columns2 = columnLabel(parseInt(b2bInteraction.my2Columns[1]));
  }

  var paragraph = document.createElement("p");
  sat(paragraph, "class", "xlh");
  if (b2bInteraction.flow == "rows") {
    paragraph.innerHTML = "a Block to Block Interaction off blocks " + block1 + " and " + block2 + " on rows " + my2Rows1 + " and " + my2Rows2 + " for candidate " + b2bInteraction.candidate;
  } else {
    paragraph.innerHTML = "a Block to Block Interaction off blocks " + block1 + " and " + block2 + " on columns " + my2Columns1 + " and " + my2Columns2 + " for candidate " + b2bInteraction.candidate;
  }
  tipCloud.appendChild(paragraph);  
  
  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  if (b2bInteraction.flow == "rows") {
    paragraph.innerHTML = "Blocks " + block1 + " and " + block2 + ", both they have candidates of " + b2bInteraction.candidate + " only on <br/>" + "<span class=\"explP\" id=\"myRow1\">rows " + my2Rows1 + "</span><br/> <span class=\"explP\" id=\"myRow2\">and " + my2Rows2 + "</span>" ;
  } else {
    paragraph.innerHTML = "Blocks " + block1 + " and " + block2 + ", both they have candidates of " + b2bInteraction.candidate + " only on <br/>" + "<span class=\"explP\" id=\"myColumn1\">columns " + my2Columns1 + "</span><br/> <span class=\"explP\" id=\"myColumn2\">and " + my2Columns2 + "</span>" ;
  }
  tipCloud.appendChild(paragraph);  

  let thismeans = "this means:<br/>";
  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  if (b2bInteraction.flow == "rows") {
    thismeans = thismeans + "if block " + block1 + " has a " + b2bInteraction.candidate + " in row " + my2Rows1 + "<br/>then block " + block2 + " has a " + b2bInteraction.candidate + " in row " + my2Rows2 + "<br/>";
    thismeans = thismeans + "or<br/>";
    thismeans = thismeans + "if block " + block1 + " has a " + b2bInteraction.candidate + " in row " + my2Rows2 + "<br/>then block " + block2 + " has a " + b2bInteraction.candidate + " in row " + my2Rows1;
  } else {
    thismeans = thismeans + "if block " + block1 + " has a " + b2bInteraction.candidate + " in column " + my2Columns1 + "<br/>then block " + block2 + " has a " + b2bInteraction.candidate + " in column " + my2Columns2 + "<br/>";
    thismeans = thismeans + "or<br/>";
    thismeans = thismeans + "if block " + block1 + " has a " + b2bInteraction.candidate + " in column " + my2Columns2 + "<br/>then block " + block2 + " has a " + b2bInteraction.candidate + " in column " + my2Columns1;
  }
  paragraph.innerHTML = thismeans;
  tipCloud.appendChild(paragraph);  
  
  thismeans = "this means:<br/>";
  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  if (b2bInteraction.flow == "rows") {
    thismeans = thismeans + "block " + target + " can not have a " + b2bInteraction.candidate + " neither in row " + my2Rows1 + " nor in row " + my2Rows2;
  } else {
    thismeans = thismeans + "block " + target + " can not have a " + b2bInteraction.candidate + " neither in column " + my2Columns1 + " nor in column " + my2Columns2;
  }
  paragraph.innerHTML = thismeans;
  tipCloud.appendChild(paragraph);  

  thismeans = "this means:<br/>";
  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  thismeans = thismeans + "you may exclude <br/><span class=\"explP\" id=\"excludes\">" + (b2bInteraction.excludes.length > 1 ? "these " + b2bInteraction.excludes.length : "this") + " candidate" + (b2bInteraction.excludes.length > 1 ? "s</span>" : "</span>");
  paragraph.innerHTML = thismeans;
  tipCloud.appendChild(paragraph);  

}

function drawBlockToBlockInteraction(b2bInteraction) {
  let ctx = setUpCanvas()

  shadeBlock(ctx, b2bInteraction.block);
  shadeBlock(ctx, b2bInteraction.brother);
  
  if (b2bInteraction.flow == "rows") {
    var firstCandidate  = b2bInteraction.candidates[0];
    var secondCandidate = null;
    var firstCell       = gel("cell-" + gat(firstCandidate, "cellIndex"));
    var firstRow        = gat(firstCell, "row");
    var secondRow       = "";
    if (firstRow == b2bInteraction.my2Rows[0]) {
      secondRow = b2bInteraction.my2Rows[1];
    } else {
      secondRow = b2bInteraction.my2Rows[0];
    }
    for (let c = 1; c < b2bInteraction.candidates.length; c++) {
      var tRow = gat(gel("cell-" + gat(b2bInteraction.candidates[c], "cellIndex")), "row");
      if (tRow == secondRow) {
        secondCandidate = b2bInteraction.candidates[c];
        break;
      }
    }
    
    var rect = firstCandidate.getBoundingClientRect();
    var rad = (rect.height / 2);
    var cX = rect.left - 0.5 + rad;
    var cY = rect.top - 0.5 + rad;
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(cX, cY);
    for (let c = 1; c < b2bInteraction.candidates.length; c++) {
      var tRow = gat(gel("cell-" + gat(b2bInteraction.candidates[c], "cellIndex")), "row");
      if (tRow == firstRow) {
        rect = b2bInteraction.candidates[c].getBoundingClientRect();
        cX = rect.left - 0.5 + rad;
        cY = rect.top - 0.5 + rad;
        ctx.lineTo(cX, cY);
}
    }
    ctx.stroke();

    rect = secondCandidate.getBoundingClientRect();
    cX = rect.left - 0.5 + rad;
    cY = rect.top - 0.5 + rad;
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(cX, cY);
    for (let c = 1; c < b2bInteraction.candidates.length; c++) {
      var tRow = gat(gel("cell-" + gat(b2bInteraction.candidates[c], "cellIndex")), "row");
      if (tRow == secondRow) {
        rect = b2bInteraction.candidates[c].getBoundingClientRect();
        cX = rect.left - 0.5 + rad;
        cY = rect.top - 0.5 + rad;
        ctx.lineTo(cX, cY);
      }
    }
    ctx.stroke();

  } else {
    var firstCandidate  = b2bInteraction.candidates[0];
    var secondCandidate = null;
    var firstCell       = gel("cell-" + gat(firstCandidate, "cellIndex"));
    var firstColumn     = gat(firstCell, "column");
    var secondColumn    = "";
    if (firstColumn == b2bInteraction.my2Columns[0]) {
      secondColumn = b2bInteraction.my2Columns[1];
    } else {
      secondColumn = b2bInteraction.my2Columns[0];
    }
    for (let c = 1; c < b2bInteraction.candidates.length; c++) {
      var tColumn = gat(gel("cell-" + gat(b2bInteraction.candidates[c], "cellIndex")), "column");
      if (tColumn == secondColumn) {
        secondCandidate = b2bInteraction.candidates[c];
        break;
      }
    }
    
    var rect = firstCandidate.getBoundingClientRect();
    var rad = (rect.height / 2);
    var cX = rect.left - 0.5 + rad;
    var cY = rect.top  - 0.5 + rad;
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(cX, cY);
    for (let c = 1; c < b2bInteraction.candidates.length; c++) {
      var tColumn = gat(gel("cell-" + gat(b2bInteraction.candidates[c], "cellIndex")), "column");
      if (tColumn == firstColumn) {
        rect = b2bInteraction.candidates[c].getBoundingClientRect();
        cX = rect.left - 0.5 + rad;
        cY = rect.top  - 0.5 + rad;
        ctx.lineTo(cX, cY);
      }
    }
    ctx.stroke();

    rect = secondCandidate.getBoundingClientRect();
    cX = rect.left - 0.5 + rad;
    cY = rect.top  - 0.5 + rad;
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(cX, cY);
    for (let c = 1; c < b2bInteraction.candidates.length; c++) {
      var tColumn = gat(gel("cell-" + gat(b2bInteraction.candidates[c], "cellIndex")), "column");
      if (tColumn == secondColumn) {
        rect = b2bInteraction.candidates[c].getBoundingClientRect();
        cX = rect.left - 0.5 + rad;
        cY = rect.top  - 0.5 + rad;
        ctx.lineTo(cX, cY);
      }
    }
    ctx.stroke();

  }

  for (let c = 0; c < b2bInteraction.candidates.length; c++) {
    markElement(ctx, b2bInteraction.candidates[c], "red", "snow");
  }
  
  for (let c = 0; c < b2bInteraction.excludes.length; c++) {
    markElement(ctx, b2bInteraction.excludes[c], "black", "rgba(250, 250, 20, 0.5)");
  }


  if (b2bInteraction.flow == "rows") {
    var r1, r2;
    for (let i = 0; i < b2bInteraction.candidates.length; i++) {
      if (gat(gel("cell-" + gat(b2bInteraction.candidates[i], "cellIndex")), "row") == b2bInteraction.my2Rows[0]) {
        //joinParagraphWithElement(ctx, gel("myRow1"), b2bInteraction.candidates[i], "#004c66");
        r1 = i;
      } else if (gat(gel("cell-" + gat(b2bInteraction.candidates[i], "cellIndex")), "row") == b2bInteraction.my2Rows[1]) {
        //joinParagraphWithElement(ctx, gel("myRow2"), b2bInteraction.candidates[i], "#004c66");
        r2 = i;
      }
    }
    joinParagraphWithRow(ctx, gel("myRow1"), candidateRow(b2bInteraction.candidates[r1]));
    joinParagraphWithRow(ctx, gel("myRow2"), candidateRow(b2bInteraction.candidates[r2]));
  } else {
    var c1, c2;
    for (let i = 0; i < b2bInteraction.candidates.length; i++) {
      if (gat("cell-" + gat(b2bInteraction.candidates[i], "cellIndex"), "column") == b2bInteraction.my2Columns[0]) {
        //joinParagraphWithElement(ctx, gel("myColumn1"), b2bInteraction.candidates[i], "#004c66");
        c1 = i;
      } else if (gat("cell-" + gat(b2bInteraction.candidates[i], "cellIndex"), "column") == b2bInteraction.my2Columns[1]) {
        //joinParagraphWithElement(ctx, gel("myColumn2"), b2bInteraction.candidates[i], "#004c66");
        c2 = i;
      }
    }
    joinParagraphWithColumn(ctx, gel("myColumn1"), candidateColumn(b2bInteraction.candidates[c1]));
    joinParagraphWithColumn(ctx, gel("myColumn2"), candidateColumn(b2bInteraction.candidates[c2]));
  }
  for (let i = 0; i < b2bInteraction.excludes.length; i++) {
    joinParagraphWithElement(ctx, gel("excludes"), b2bInteraction.excludes[i], "#004c66");
  }
}

export {
  searchBlockToBlockInteraction,
  blockToBlockInteractionFound,
}
