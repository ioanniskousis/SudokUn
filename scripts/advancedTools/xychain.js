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
  getCellOptions,
  getNeighborsWithExcludableOption,
  optionsContainOption,
  arrayInitWithArray,
  getSOption,
  cellLabel,
  joinElements,
} from './advanced.js';
import { gel, gat, sat, isCh, optionValue, delay, cempt } from '../utils/shortHands.js';

function searchXyChain() {
  for (let i = 0; i < 81; i++) {
    const cell = gel("cell-" + i.toString());
    if (cempt(cell)) {
      const cellOptions = getCellOptions(cell);
      if (cellOptions.length == 2) {
        var neighborsWithExcludableOption = getNeighborsWithExcludableOption(cell, optionValue(cellOptions[0]));
        if (neighborsWithExcludableOption.length > 0) {
          var xyChain = examineXYChain(cellOptions[0], neighborsWithExcludableOption, [cell], [{baseOption:cellOptions[0], linkOption:cellOptions[1]}]);
          if (xyChain) {
            return xyChain;
          }
        }
        neighborsWithExcludableOption = getNeighborsWithExcludableOption(cell, optionValue(cellOptions[1]));
        if (neighborsWithExcludableOption.length > 0) {
          var xyChain = examineXYChain(cellOptions[1], neighborsWithExcludableOption, [cell], [{baseOption:cellOptions[1], linkOption:cellOptions[0]}]);
          if (xyChain) {
            return xyChain;
          }
        }
      }
    }
  }
  return null;
}
function examineXYChain(chainBaseOption, baseExcludableNeighbors, chainCells, chainCellsOptions) {
  const lastCell           = chainCells[chainCells.length - 1];
  const lastCellLinkOption = chainCellsOptions[chainCellsOptions.length - 1].linkOption;
  if (optionValue(chainBaseOption) == optionValue(lastCellLinkOption)) {
    const neighborsWithExcludableOption = getNeighborsWithExcludableOption(lastCell, optionValue(lastCellLinkOption));
    if (neighborsWithExcludableOption.length > 0) {
      const excludes = [];
      for (let i = 0; i < baseExcludableNeighbors.length; i++) {
        if (neighborsWithExcludableOption.includes(baseExcludableNeighbors[i])) {
          excludes.push(getSOption(baseExcludableNeighbors[i], optionValue(chainBaseOption)));
        }
      }
      if (excludes.length > 0) {
        return {excludes:excludes, chainCells:chainCells, chainCellsOptions:chainCellsOptions};
      }
    }
  }

  var neighborsToJoin = getNeighborsToJoinXYChain(chainCells, chainCellsOptions);
  for (var i = 0; i < neighborsToJoin.length; i++) {
    var examineChain        = arrayInitWithArray(chainCells);
    var examineChainOptions = arrayInitWithArray(chainCellsOptions);
    var nextCellToJoin  = neighborsToJoin[i].cell;
    var nextCellOptions = neighborsToJoin[i].options;
    var cellOptions = [];
    if (optionValue(nextCellOptions[0]) == optionValue(lastCellLinkOption)) {
      cellOptions = {baseOption:nextCellOptions[0], linkOption:nextCellOptions[1]};
    } else {
      cellOptions = {baseOption:nextCellOptions[1], linkOption:nextCellOptions[0]};
    }
    examineChain.push(nextCellToJoin);
    examineChainOptions.push(cellOptions );
    var xyChain = examineXYChain(chainBaseOption, baseExcludableNeighbors, examineChain, examineChainOptions);
    if (xyChain) {
      return xyChain;
    }
  }
  return null;
}
function getNeighborsToJoinXYChain(chainCells, chainCellsOptions) {
  const lastCell   = chainCells[chainCells.length - 1];
  const linkOption = chainCellsOptions[chainCellsOptions.length - 1].linkOption;
  const neighborhood = getNeighborhood(lastCell, true);
  const neighbors    = [];
  for (let i = 0; i < neighborhood.length; i++) {
    if (!chainCells.includes(neighborhood[i])) {
      const cellOptions = getCellOptions(neighborhood[i]);
      if (cellOptions.length == 2) {
        if (optionsContainOption(cellOptions, linkOption)) {
          neighbors.push({cell:neighborhood[i], options:cellOptions});
        }
      }
    }
  }
  return neighbors;
}

function xyChainFound(xyChain) {
  explaneXyChain(xyChain);
  delay(500).then(
    () => drawXyChain(xyChain)
  );
}
function explaneXyChain(xyChain) {
  const tipCloud = gel('tipCloud');
  tipCloud.innerHTML = '';
  sat(tipCloud, "tool", "xyChain");


  var firstCell = xyChain.chainCells[0];
  var lastCell  = xyChain.chainCells[xyChain.chainCells.length - 1];
  var candidate = optionValue(xyChain.excludes[0]);

  var paragraph = document.createElement("p");
  sat(paragraph, "class", "xlh");
  paragraph.innerHTML = "an XY Chain for candidate " + candidate;
  tipCloud.appendChild(paragraph);  

  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  paragraph.innerHTML = "an XY Chain for candidate " + candidate + " starts from <span class=\"explP\" id=\"fromcell\">cell " + cellLabel(firstCell) + "</span> <br/>and ends to <span class=\"explP\" id=\"tocell\">cell " + cellLabel(lastCell) + "</span>";
  tipCloud.appendChild(paragraph);  

  var thismeans = "this means:<br/>";
  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  thismeans = thismeans + "either cell " + cellLabel(firstCell) + " must take " + candidate + ",<br/>or cell " + cellLabel(lastCell) + " must take " + candidate;
  paragraph.innerHTML = thismeans;
  tipCloud.appendChild(paragraph);  

  thismeans = "this implies:<br/>";
  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  thismeans = thismeans + "cells around the grid that share a row, or a column, or a block with both cells<br/> can not have " + candidate + " as a candidate";
  thismeans = thismeans + " and <span class=\"explP\" id=\"excludes\">" + ((xyChain.excludes.length > 1) ? "these " + xyChain.excludes.length + " candidates" : "this candidate") + "</span> <br/>";
  thismeans = thismeans + "can be excluded";
  paragraph.innerHTML = thismeans;
  tipCloud.appendChild(paragraph);  

}
function drawXyChain(xyChain) {
  let ctx = setUpCanvas()

  var firstCell = xyChain.chainCells[0];
  var lastCell  = xyChain.chainCells[xyChain.chainCells.length - 1];
  var candidate = optionValue(xyChain.excludes[0]);
  ctx.lineWidth   = "0.5";
  joinParagraphWithElement(ctx, gel("fromcell"), firstCell, "#004c66");
  joinParagraphWithElement(ctx, gel("tocell"), lastCell, "#004c66");

  ctx.lineWidth   = "2.5";
  markElement(ctx, xyChain.chainCells[0], "green", "") ;
  markElement(ctx, xyChain.chainCells[xyChain.chainCells.length - 1], "red", "") ;
  ctx.lineWidth   = "0.5";
  for (var i = 0; i < xyChain.chainCellsOptions.length - 1; i++) {
    joinElements(ctx, xyChain.chainCellsOptions[i].linkOption, xyChain.chainCellsOptions[i + 1].baseOption, "green");
  }
  ctx.lineWidth   = "1.5";
  for (var i = 0; i < xyChain.chainCellsOptions.length; i++) {
    markElement(ctx, xyChain.chainCellsOptions[i].linkOption, "#004c66", "rgba(0, 255, 255, 0.5") ;
    markElement(ctx, xyChain.chainCellsOptions[i].baseOption, "red", "rgba(255, 255, 255, 0.5") ;
  }
  ctx.lineWidth   = "0.5";
  for (var c = 0; c < xyChain.excludes.length; c++) {
    markElement(ctx, xyChain.excludes[c], "black", "rgba(255, 255, 0, 0.5)") ;
  }

for (var i = 0; i < xyChain.excludes.length; i++) {
  joinParagraphWithElement(ctx, gel("excludes"), xyChain.excludes[i], "red");
}

}


export {
  searchXyChain,
  xyChainFound,
}
