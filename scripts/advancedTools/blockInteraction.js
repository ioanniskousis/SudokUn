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
} from './advanced.js';
import { gel, gat, sat, isCh, optionValue, crel, doc, delay } from '../utils/shortHands.js';

function searchBlockInteraction() {
  for (let block = 0; block < 9; block++) {
    let blockCells = getBlockCells(block);
    for (let option = 1; option < 10; option++) {
      let blockInteraction = findBlockInteractionOnCandidate(block, blockCells, option);
      if (blockInteraction) {
        return blockInteraction;
      }
    }
  }

  return null;
}
function blockInteractionFound(blockInteraction) {
  explaneBlockInteraction(blockInteraction);
  delay(500).then(
    () => drawBlockInteraction(blockInteraction)
  );
}

function explaneBlockInteraction(blockInteraction) {
  let unit = (parseInt(blockInteraction.interactionRow) > -1) ? "row " + (parseInt(blockInteraction.interactionRow) + 1).toString() : "column " + (parseInt(blockInteraction.interactionColumn) + 1).toString();
  let tipCloud = gel('tipCloud');
  tipCloud.innerHTML = '';
  sat(tipCloud, "tool", "hiddenSingle");

  let paragraph = document.createElement("p");
  sat(paragraph, "class", "xlh");
  paragraph.innerHTML = "a Block Interaction off block " + (blockInteraction.block + 1).toString() + " on " + unit + " for candidate " + blockInteraction.candidate;
  tipCloud.appendChild(paragraph);  

  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  paragraph.innerHTML = "Block " + (blockInteraction.block + 1).toString() + " has candidates of " + blockInteraction.candidate + " only on<br/><span class=\"explP\" id=\"region\">" + unit + "</span>";
  tipCloud.appendChild(paragraph);  

  let thismeans = "this means:<br/>";
  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  let cell = gel("cell-" + gat(blockInteraction.candidates[0], "cellIndex"));
  let cellRow    = (parseInt(gat(cell, "row")) + 1).toString();
  let cellColumn = (parseInt(gat(cell, "column")) + 1).toString();
  thismeans = thismeans + "either <span class=\"explP\" id=\"candi0\">cell R" + cellRow + "C" + cellColumn + "</span> is " + blockInteraction.candidate + "<br/>";
  for (let i = 1; i < blockInteraction.candidates.length - 1; i++) {
    cell = gel("cell-" + gat(blockInteraction.candidates[i], "cellIndex"));
    cellRow    = (parseInt(gat(cell, "row")) + 1).toString();
    cellColumn = (parseInt(gat(cell, "column")) + 1).toString();
    thismeans = thismeans + "or <span class=\"explP\" id=\"candi" + (i).toString() + "\">cell R" + cellRow + "C" + cellColumn + "</span> is " + blockInteraction.candidate + "<br/>";
  }
  cell = gel("cell-" + gat(blockInteraction.candidates[blockInteraction.candidates.length - 1], "cellIndex"));
  cellRow    = (parseInt(gat(cell, "row")) + 1).toString();
  cellColumn = (parseInt(gat(cell, "column")) + 1).toString();
  thismeans = thismeans + "or <span class=\"explP\" id=\"candi" + (blockInteraction.candidates.length - 1).toString() + "\">cell R" + cellRow + "C" + cellColumn + "</span> is " + blockInteraction.candidate + "<br/>";
  paragraph.innerHTML = thismeans;
  tipCloud.appendChild(paragraph);  


  thismeans = "this means:<br/>";
  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  thismeans = thismeans + "<span class=\"explP\" id=\"excludes\">" + (blockInteraction.excludes.length > 1 ? "these" : "this") + " candidate" + (blockInteraction.excludes.length > 1 ? "s" : "") + "</span><br/>";
  thismeans = thismeans + "can be excluded";
  paragraph.innerHTML = thismeans;
  tipCloud.appendChild(paragraph); 
}
// function blockInteractionClicked(element) {
//   clearDrawDivision();

//   let blockInteraction = findBlockInteraction();
//   if (blockInteraction == null) {
//       reportNotFoundTools( "'.$no_binteraction[$ses_lang].'", element);
//   } else {
//     explaneBlockInteraction(blockInteraction);
//     drawBlockInteraction(blockInteraction);
//   }
// }
function drawBlockInteraction(blockInteraction) {
  let ctx = setUpCanvas()

    // let drawDivision = gel("drawDivision");
    // let drect = drawDivision.getBoundingClientRect();
    // let ctx = drawDivision.getContext("2d");
    // ctx.translate(0, 0);
    // ctx.lineWidth   = "1.5";

  shadeBlock(ctx, blockInteraction.block);
  if (parseInt(blockInteraction.interactionRow) > -1) {
    shadeRow(ctx, parseInt(blockInteraction.interactionRow));
    joinParagraphWithRow(ctx, gel("region"), blockInteraction.interactionRow);
  } else {
    shadeColumn(ctx, parseInt(blockInteraction.interactionColumn));
    joinParagraphWithColumn(ctx, gel("region"), blockInteraction.interactionColumn);
  }

    for (let c = 0; c < blockInteraction.candidates.length - 1; c++) {
      joinElements(ctx, blockInteraction.candidates[c], blockInteraction.candidates[c + 1], "red")
    }
    ctx.stroke();

  ctx.lineWidth   = "1";
  for (let i = 0; i < blockInteraction.candidates.length; i++) {
    joinParagraphWithElement(ctx, gel("candi" + i), blockInteraction.candidates[i], "#004c66");
  }
  for (let i = 0; i < blockInteraction.excludes.length; i++) {
    joinParagraphWithElement(ctx, gel("excludes"), blockInteraction.excludes[i], "#004c66");
  }

    for (let c = 0; c < blockInteraction.candidates.length; c++) {
      let option = blockInteraction.candidates[c];
      markElement(ctx, option, "red", "snow");
    }

    for (let c = 0; c < blockInteraction.excludes.length; c++) {
      let option = blockInteraction.excludes[c];
      markElement(ctx, option, "black", "yellow");

    }
}

function findBlockInteractionOnCandidate(block, blockCells, option) {

  let candidateCells = blockCellsWithCandidate(blockCells, option);
  let candidates = [];
  let excludes   = [];
  let interactionRow    = -1;
  let interactionColumn = -1;
  if (candidateCells.length > 1) {
    let onSameRow = true;
    let onSameCol = true;
    let examineCell = candidateCells[0];
    let currentRow  = gat(examineCell, "row");
    for (let c = 1; c < candidateCells.length; c++) {
      let nextCell = candidateCells[c];
      let nextRow  = gat(nextCell, "row");
      if (nextRow != currentRow) {
        onSameRow = false;
        c = candidateCells.length;
        break;
      }
      currentRow = nextRow;
    }

    examineCell        = candidateCells[0];
    let currentColumn  = gat(examineCell, "column");
    for (let c = 1; c < candidateCells.length; c++) {
      let nextCell = candidateCells[c];
      let nextCol  = gat(nextCell, "column");
      if (nextCol != currentColumn) {
        onSameCol = false;
        c = candidateCells.length;
        break;
      }
      currentColumn = nextCol;
    }
    let brotherBlocks = getBrotherBlocks(block);
    if (onSameRow) {
      interactionRow = currentRow;   
      let candidates = blockCandidatesOfOptionInRow(brotherBlocks[0], option, currentRow);
      if (candidates.length > 0) {
        for (let c = 0; c < candidates.length; c++) {
          excludes.push(candidates[c]);
        }
      }
      candidates = blockCandidatesOfOptionInRow(brotherBlocks[1], option, currentRow);
      if (candidates.length > 0) {
        for (let c = 0; c < candidates.length; c++) {
          excludes.push(candidates[c]);
        }
      }
    }
    if (onSameCol) {
      interactionColumn = currentColumn;
      let candidates = blockCandidatesOfOptionInColumn(brotherBlocks[2], option, currentColumn);
      if (candidates.length > 0) {
        for (let c = 0; c < candidates.length; c++) {
          excludes.push(candidates[c]);
        }
      }
      candidates = blockCandidatesOfOptionInColumn(brotherBlocks[3], option, currentColumn);
      if (candidates.length > 0) {
        for (let c = 0; c < candidates.length; c++) {
          excludes.push(candidates[c]);
        }
      }

    }

    if (excludes.length > 0) {
      for (let c = 0; c < candidateCells.length; c++) {
        let cell = candidateCells[c];
        let cellIndex = gat(cell, "index");
        let candidate = gel("candidate-" + cellIndex + "-" + option);
        candidates.push(candidate);
      }
      return {candidateCells:candidateCells, candidates:candidates, excludes:excludes, block:block, candidate:option, interactionRow:interactionRow, interactionColumn:interactionColumn};
    }


  }
  return null;
}

function blockCellsWithCandidate(blockCells, option) {
  let candidateCells = [];
  for (let i = 0; i < blockCells.length; i++) {
    let cell = blockCells[i];
    if (gat(cell, 'value') === '0') {
      let cellIndex = gat(cell, "index");
      let candidate = gel("candidate-" + cellIndex + "-" + option);
      if (optionIsExcludable(candidate)) {
        candidateCells.push(cell);
      }
    }
  }
  return candidateCells;
}
function blockCandidatesOfOptionInRow(brotherBlock, option, currentRow) {
  let options = [];
  let brotherBlockCells = getBlockCells(brotherBlock);
  for (let c = 0; c < brotherBlockCells.length; c++) {
    let cell = brotherBlockCells[c];
    let cellIndex = gat(cell, "index");
    if (gat(cell, 'value') == '0') {
      if (gat(cell, "row") == currentRow) {
        let candidate = gel("candidate-" + cellIndex + "-" + option);
        if (optionIsExcludable(candidate)) {
          options.push(candidate);
        }
      }
    }
  }
  return options;
}
function blockCandidatesOfOptionInColumn(brotherBlock, option, currentColumn) {
  let options = [];
  let brotherBlockCells = getBlockCells(brotherBlock);
  for (let c = 0; c < brotherBlockCells.length; c++) {
    let cell = brotherBlockCells[c];
    let cellIndex = gat(cell, "index");
    if (gat(cell, 'value') == '0') {
      if (gat(cell, "column") == currentColumn) {
        let candidate = gel("candidate-" + cellIndex + "-" + option);
        if (optionIsExcludable(candidate)) {
          options.push(candidate);
        }
      }
    }
  }
  return options;
}

export {
  searchBlockInteraction,
  blockInteractionFound,
}
