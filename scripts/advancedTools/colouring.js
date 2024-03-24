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
  getGrid,
  optionAppearancesInUnit,
  getNeighborhoodExcludableOptions,
  markSqElement,
} from './advanced.js';
import { gel, gat, sat, isCh, optionValue, crel, doc, delay } from '../utils/shortHands.js';

function searchColouring() {
  const grid = getGrid();
  for (let unit = 0; unit < 9; unit++) {
    for (let option = 1; option < 10; option++) {
      
      let appearances = optionAppearancesInUnit(grid.rows[unit], option);
      if (appearances.length == 2) {
        const coloring = initColoringWithOptions(appearances, option, "row", unit);
        if (coloring) {
          return coloring;
        }
      }
      appearances = optionAppearancesInUnit(grid.columns[unit], option);
      if (appearances.length == 2) {
        const coloring = initColoringWithOptions(appearances, option, "column", unit);
        if (coloring) {
          return coloring;
        }
      }
      appearances = optionAppearancesInUnit(grid.blocks[unit], option);
      if (appearances.length == 2) {
        const coloring = initColoringWithOptions(appearances, option, "block", unit);
        if (coloring) {
          return coloring;
        }
      }

    }
  }
  return null;
   
  return null;
}
function initColoringWithOptions(twoOptions, option, group, unit) {
  var leftOptionsOff  = [];
  var rightOptionsOff = [];
  var leftActiveOffs  = [];
  var rightActiveOffs = [];
  var leftOptionsOn  = [twoOptions[0]];
  var rightOptionsOn = [twoOptions[1]];

  const coloring = examineColoring(option, leftOptionsOff, rightOptionsOff, leftOptionsOn, rightOptionsOn, leftActiveOffs, rightActiveOffs, group, unit);
  if (coloring) {
    return coloring;
  }
  return null;

}
function examineColoring(opt, leftOptionsOff, rightOptionsOff, leftOptionsOn, rightOptionsOn, leftActiveOffs, rightActiveOffs, group, unit) {
  const excludes = [];
  for (let i = 0; i < leftOptionsOn.length; i++) {
    const option_ON = leftOptionsOn[i];
    const cell_ON = gel("cell-" +  gat(option_ON, "cellIndex"));
    const neighborhoodExcludableOptions = getNeighborhoodExcludableOptions(cell_ON, opt).options;
    for (let ii = 0; ii < neighborhoodExcludableOptions.length; ii++) {
      const excludableOption = neighborhoodExcludableOptions[ii];
      if (rightOptionsOff.includes(excludableOption)) {
        if (!excludes.includes(excludableOption)) {
          excludes.push(excludableOption);
        }
        if ((!leftOptionsOff.includes(excludableOption)) && (!leftOptionsOn.includes(excludableOption)) && (!rightOptionsOn.includes(excludableOption))) {
          leftOptionsOff.push(excludableOption);
        }
      } else {
        if ((!leftOptionsOff.includes(excludableOption)) && (!leftOptionsOn.includes(excludableOption)) && (!rightOptionsOn.includes(excludableOption))) {
          leftOptionsOff.push(excludableOption);
        }
      }
    }
  }
  for (let i = 0; i < rightOptionsOn.length; i++) {
    const option_ON = rightOptionsOn[i];
    const cell_ON = gel("cell-" + gat(option_ON, "cellIndex"));
    const neighborhoodExcludableOptions = getNeighborhoodExcludableOptions(cell_ON, opt).options;
    for (let ii = 0; ii < neighborhoodExcludableOptions.length; ii++) {
      const excludableOption = neighborhoodExcludableOptions[ii];
      if (leftOptionsOff.includes(excludableOption)) {
        if (!excludes.includes(excludableOption)) {
          excludes.push(excludableOption);
        }
        if ((!rightOptionsOff.includes(excludableOption)) && (!rightOptionsOn.includes(excludableOption)) && (!leftOptionsOn.includes(excludableOption))) {
          rightOptionsOff.push(excludableOption);
        }
      } else {
        if ((!rightOptionsOff.includes(excludableOption)) && (!rightOptionsOn.includes(excludableOption)) && (!leftOptionsOn.includes(excludableOption))) {
          rightOptionsOff.push(excludableOption);
        }
      }

    }
  }
  if (excludes.length > 0) {
    return { leftOptionsOff:leftOptionsOff, rightOptionsOff:rightOptionsOff, leftOptionsOn:leftOptionsOn, rightOptionsOn:rightOptionsOn, excludes:excludes, leftActiveOffs:leftActiveOffs, rightActiveOffs:rightActiveOffs , group:group, unit:unit};
  } else {
    var leftON  = [];
    var rightON = [];
  
    for (let i = 0; i < leftOptionsOff.length; i++) {
      const coloredONOptions = coloringONOptions("l", leftOptionsOff[i], opt, leftOptionsOff, rightOptionsOff, leftOptionsOn, rightOptionsOn);
      if (coloredONOptions.length > 0) {
        for (let ii = 0; ii < coloredONOptions.length; ii++) {
          if (!leftON.includes(coloredONOptions[ii])) {
            leftON.push(coloredONOptions[ii]);
            leftActiveOffs.push(leftOptionsOff[i]);
          }
        }
      }
    }
    for (let i = 0; i < rightOptionsOff.length; i++) {
      const coloredONOptions = coloringONOptions("r", rightOptionsOff[i], opt, leftOptionsOff, rightOptionsOff, leftOptionsOn, rightOptionsOn);
      if (coloredONOptions.length > 0) {
        for (let ii = 0; ii < coloredONOptions.length; ii++) {
          if (!rightON.includes(coloredONOptions[ii])) {
            rightON.push(coloredONOptions[ii]);
            rightActiveOffs.push(rightOptionsOff[i]);
          }
        }
      }
    }

    if (leftON.length > 0) {
      for (let i = 0; i < leftON.length; i++) {
        leftOptionsOn.push(leftON[i]);
      }
    }
    if (rightON.length > 0) {
      for (let i = 0; i < rightON.length; i++) {
        rightOptionsOn.push(rightON[i]);
      }
    }

    if ((leftON.length > 0) || (rightON.length > 0)) {
      const coloring = examineColoring(opt, leftOptionsOff, rightOptionsOff, leftOptionsOn, rightOptionsOn, leftActiveOffs, rightActiveOffs, group, unit);
      if (coloring) {
        return coloring;
      }
    }
  

  }
  return null;
}
function coloringONOptions(side, option, opt, leftOptionsOff, rightOptionsOff, leftOptionsOn, rightOptionsOn) {
  const optionCell      = gel("cell-" + gat(option, "cellIndex"));
  var options = [];
   
  let unitCells    = getRowCells(gat(optionCell, "row"));
  let appearances = optionAppearancesInUnit(unitCells, opt);
  let appearancesOFF = [];
  let appearancesON  = [];
  for (let i = 0; i < appearances.length; i++) {
    if (((leftOptionsOff.includes(appearances[i])) && (side == "l")) || ((rightOptionsOff.includes(appearances[i])) && (side == "r"))){
      appearancesOFF.push(appearances[i]);
    } else {
      if (!appearancesON.includes(appearances[i])) {
        appearancesON.push(appearances[i]);
      }
    }
  }
  if (appearancesON.length == 1) {
    const option_ON = appearancesON[0];
    if (side == "l") {
      if ((!leftOptionsOff.includes(option_ON)) && (!leftOptionsOn.includes(option_ON))) {
        options.push(option_ON);
      } 
    } else {
      if ((!rightOptionsOff.includes(option_ON)) && (!rightOptionsOn.includes(option_ON))) {
        options.push(option_ON);
      } 
    }
  }

  unitCells = getColumnCells(gat(optionCell, "column"));
  appearances = optionAppearancesInUnit(unitCells, opt);
  appearancesOFF = [];
  appearancesON  = [];
  for (let i = 0; i < appearances.length; i++) {
    if (((leftOptionsOff.includes(appearances[i])) && (side == "l")) || ((rightOptionsOff.includes(appearances[i])) && (side == "r"))){
      appearancesOFF.push(appearances[i]);
    } else {
      if (!appearancesON.includes(appearances[i])) {
        appearancesON.push(appearances[i]);
      }
    }
  }
  if (appearancesON.length == 1) {
    const option_ON = appearancesON[0];
    if (side == "l") {
      if ((!leftOptionsOff.includes(option_ON)) && (!leftOptionsOn.includes(option_ON))) {
        options.push(option_ON);
      } 
    } else {
      if ((!rightOptionsOff.includes(option_ON)) && (!rightOptionsOn.includes(option_ON))) {
        options.push(option_ON);
      } 
    }
  }

  unitCells  = getBlockCells(gat(optionCell, "block"));
  appearances = optionAppearancesInUnit(unitCells, opt);
  appearancesOFF = [];
  appearancesON  = [];
  for (let i = 0; i < appearances.length; i++) {
    if (((leftOptionsOff.includes(appearances[i])) && (side == "l")) || ((rightOptionsOff.includes(appearances[i])) && (side == "r"))){
      appearancesOFF.push(appearances[i]);
    } else {
      if (!appearancesON.includes(appearances[i])) {
        appearancesON.push(appearances[i]);
      }
    }
  }
  if (appearancesON.length == 1) {
    const option_ON = appearancesON[0];
    if (side == "l") {
      if ((!leftOptionsOff.includes(option_ON)) && (!leftOptionsOn.includes(option_ON))) {
        options.push(option_ON);
      } 
    } else {
      if ((!rightOptionsOff.includes(option_ON)) && (!rightOptionsOn.includes(option_ON))) {
        options.push(option_ON);
      } 
    }
  }

  return options;
  
}
function colouringFound(colouring) {
  explaneColouring(colouring);
  delay(500).then(
    () => drawColouring(colouring)
  );
}
function drawColouring(coloring) {
  let ctx = setUpCanvas()

  for (var i = 0; i < coloring.leftActiveOffs.length; i++) {
    var cellOFF = gel("cell-" + gat(coloring.leftActiveOffs[i], "cellIndex"));
    var neighborhood = getNeighborhood(cellOFF);
    for (var ii = 0; ii < coloring.leftOptionsOn.length; ii++) {
      var cellON = gel("cell-" + gat(coloring.leftOptionsOn[ii], "cellIndex"));
      if (neighborhood.includes(cellON)) {
        joinElements(ctx, coloring.leftActiveOffs[i], coloring.leftOptionsOn[ii], "blue");
      }
    }
  }
  for (var i = 0; i < coloring.rightActiveOffs.length; i++) {
    var cellOFF = gel("cell-" + gat(coloring.rightActiveOffs[i], "cellIndex"));
    var neighborhood = getNeighborhood(cellOFF);
    for (var ii = 0; ii < coloring.rightOptionsOn.length; ii++) {
      var cellON = gel("cell-" + gat(coloring.rightOptionsOn[ii], "cellIndex"));
      if (neighborhood.includes(cellON)) {
        joinElements(ctx, coloring.rightActiveOffs[i], coloring.rightOptionsOn[ii], "blue");
      }
    }
  }

  var markedOffs = [];
  for (var i = 0; i < coloring.leftOptionsOn.length; i++) {
    var cellON = gel("cell-" + gat(coloring.leftOptionsOn[i], "cellIndex"));
    var neighborhood = getNeighborhood(cellON);
    for (var ii = 0; ii < coloring.leftOptionsOff.length; ii++) {
      var cellOFF = gel("cell-" + gat(coloring.leftOptionsOff[ii], "cellIndex"));
      if (neighborhood.includes(cellOFF)) {
        if (!markedOffs.includes(coloring.leftOptionsOff[ii])){
          joinElements(ctx, coloring.leftOptionsOn[i], coloring.leftOptionsOff[ii], "red");
          markedOffs.push(coloring.leftOptionsOff[ii]);
        }
      }
    }
  }
  markedOffs = [];
  for (var i = 0; i < coloring.rightOptionsOn.length; i++) {
    var cellON = gel("cell-" + gat(coloring.rightOptionsOn[i], "cellIndex"));
    var neighborhood = getNeighborhood(cellON);
    for (var ii = 0; ii < coloring.rightOptionsOff.length; ii++) {
      var cellOFF = gel("cell-" + gat(coloring.rightOptionsOff[ii], "cellIndex"));
      if (neighborhood.includes(cellOFF)) {
        if (!markedOffs.includes(coloring.rightOptionsOff[ii])){
          joinElements(ctx, coloring.rightOptionsOn[i], coloring.rightOptionsOff[ii], "red");
          markedOffs.push(coloring.rightOptionsOff[ii]);
        }
      }
    }
  }

  var cellA = gel("cell-" + gat(coloring.leftOptionsOn[0], "cellIndex"));
  var cellB = gel("cell-" + gat(coloring.rightOptionsOn[0], "cellIndex"));
  ctx.lineWidth   = "1.5";
  markElement(ctx, cellA, "green", "rgba(200, 255, 200, 0.3)") ;
  markElement(ctx, cellB, "green", "rgba(200, 255, 200, 0.3)") ;

  ctx.lineWidth   = "1";
  markSqElement(ctx, coloring.leftOptionsOn[0], "blue", "rgba(255, 255, 255, 0.0)") ;
  markSqElement(ctx, coloring.rightOptionsOn[0], "red", "rgba(255, 255, 255, 0.0)") ;
  
  ctx.lineWidth   = "1";
  for (var i = 0; i < coloring.leftOptionsOff.length; i++) {
    markElement(ctx, coloring.leftOptionsOff[i], "red", "rgba(255, 255, 255, 0.5)") ;
  }
  for (var i = 0; i < coloring.rightOptionsOff.length; i++) {
    markElement(ctx, coloring.rightOptionsOff[i], "red", "rgba(255, 255, 255, 0.5)") ;
  }

  ctx.lineWidth   = "1";
  for (var i = 1; i < coloring.leftOptionsOn.length; i++) {
    markElement(ctx, coloring.leftOptionsOn[i], "blue", "rgba(255, 255, 255, 0.0)") ;
  }
  for (var i = 1; i < coloring.rightOptionsOn.length; i++) {
    markElement(ctx, coloring.rightOptionsOn[i], "blue", "rgba(255, 255, 255, 0.0)") ;
  }
  ctx.lineWidth   = "0.5";
  for (var i = 0; i < coloring.excludes.length; i++) {
    markElement(ctx, coloring.excludes[i], "black", "rgba(250, 250, 20, 0.3)") ;
  }

  joinParagraphWithElement(ctx, gel("twocandidates"), coloring.leftOptionsOn[0],  "#004c66");
  joinParagraphWithElement(ctx, gel("twocandidates"), coloring.rightOptionsOn[0], "#004c66");
  for (var i = 0; i < coloring.excludes.length; i++) {
    joinParagraphWithElement(ctx, gel("excludes"), coloring.excludes[i], "red");
  }
}

function explaneColouring(coloring) {
  const tipCloud = gel('tipCloud');
  tipCloud.innerHTML = '';
  sat(tipCloud, "tool", "colouring");

  var candidate      = optionValue(coloring.leftOptionsOn[0]);
  var unit           = (parseInt(coloring.unit) + 1).toString();
  var group          = coloring.group;

  var paragraph = document.createElement("p");
  sat(paragraph, "class", "xlh");
  paragraph.innerHTML = "a Coloring Structure in " + group + " " + unit + " on candidate " + candidate;
  tipCloud.appendChild(paragraph);  
  
  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  paragraph.innerHTML = group + " " + unit + " has only <span class=\"explP\" id=\"twocandidates\">two candidates for </span>" + candidate;
  tipCloud.appendChild(paragraph);  

  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  paragraph.innerHTML = "whichever is the corect selection implies <span class=\"explP\" id=\"excludes\">" + ((coloring.excludes.length > 1) ? "these" : "this") + " candidate" + ((coloring.excludes.length > 1) ? "s" : "") + "</span> can be excluded";
  tipCloud.appendChild(paragraph);  

}

export {
  searchColouring,
  colouringFound,
}
