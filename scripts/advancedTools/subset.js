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
  getRowCells,
  getColumnCells,
  getBlockCells,
} from './advanced.js';
import { gel, gat, sat, isCh, optionValue, crel, doc, delay } from '../utils/shortHands.js';


// function subsetsClicked(element) {
//   clearDrawDivision();

//   let subset = findSubset();

//   if (subset == null) {
//     reportNotFoundTools( "'.$no_subsets[$ses_lang].'", element);
//   } else {
    
//     explaneSubset(subset);
//     drawSubset(subset);
//   }
// }

function searchSubset() {
  for (let sz = 2; sz < 9; sz++) {
    for (let unit = 0; unit < 9; unit++) {
      let subset = findSubsetOfSizeInUnion(getRowCells(unit), sz, unit, "row")
      if (subset) {
        return subset;
      }
      subset = findSubsetOfSizeInUnion(getColumnCells(unit), sz, unit, "column")
      if (subset) {
        return subset;
      }
      subset = findSubsetOfSizeInUnion(getBlockCells(unit), sz, unit, "block")
      if (subset) {
        return subset;
      }
    }
  }
  return null;
}

function subsetFound(subset) {
  explaneSubset(subset);
  delay(500).then(
    () => drawSubset(subset)
  );
}

function explaneSubset(subset) {
  let tipCloud = gel('tipCloud');
  tipCloud.innerHTML = '';
  sat(tipCloud, "tool", "subset");

  let optionValues = [];
  for (var c = 0; c < subset.subsetCells.length; c++) {
    for (var ci = 1; ci < 10; ci++) {
      let candidate = gel("candidate-" + gat(subset.subsetCells[c], "index") + "-" + ci.toString());
      if (optionIsExcludable(candidate)) {
        let optionVal = optionValue(candidate);
        if (!optionValues.includes(optionVal)) {
          optionValues.push(optionVal);
        }
      }
    }
  }
  let optionsStr = optionValues[0];
  for (var c = 1; c < optionValues.length - 1; c++) {
    optionsStr = optionsStr + ", " + optionValues[c];
  }
  optionsStr = optionsStr + " and " + optionValues[c];

  let unit = subset.unit.toString() + " " + (parseInt((subset.unit == "row") ? gat(subset.subsetCells[0], "row") : ((subset.unit == "column") ? gat(subset.subsetCells[0], "column") : gat(subset.subsetCells[0], "block"))) + 1).toString() ;
  let numOffCells = subset.subsetCells.length.toString(); 

  let paragraph = document.createElement("p");
  sat(paragraph, "class", "xlh");
  paragraph.innerHTML = "a subset of " + numOffCells + " cells in " + unit ;
  tipCloud.appendChild(paragraph);  

  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  paragraph.innerHTML = "There are <span class=\"explP\" id=\"somecells\">" + numOffCells + " cells </span> in " + unit + " holding " + numOffCells + " cadidates (" + optionsStr + ") " + ((subset.subsetCells.length > 2) ? "all together" : "");
  tipCloud.appendChild(paragraph);  

  var thismeans = "this means:<br/>";
  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  thismeans = thismeans + "one of these cells must be <span class='framed-span'>" + optionValues[0] + "</span> ";
  for (var i = 1; i < subset.subsetCells.length - 1; i++) {
    thismeans = thismeans + "one must be <span class='framed-span'>" + optionValues[i] + "</span> ";
  }
  thismeans = thismeans + "and one of them must be <span class='framed-span'>" + optionValues[subset.subsetCells.length - 1] + "</span> ";
  
  paragraph.innerHTML = thismeans;
  tipCloud.appendChild(paragraph);  

  thismeans = "this means:<br/>";
  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  thismeans = thismeans + "no other cells in " + unit + " can hold one of these candidates (" + optionsStr + ") " + "<br/>";
  paragraph.innerHTML = thismeans;
  tipCloud.appendChild(paragraph);  

  thismeans = "this means:<br/>";
  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  thismeans = thismeans + "you may exclude " + (subset.excludes.length > 1 ? "these " : "this") + "<span class=\"explP\" id=\"excludes\">" + (subset.excludes.length > 1 ? " " + subset.excludes.length.toString() : "") + " yellow</span> candidate" + (subset.excludes.length > 1 ? "s" : "");
  paragraph.innerHTML = thismeans;
  tipCloud.appendChild(paragraph);  

}

function drawSubset(subset) {
  let ctx = setUpCanvas()

  for (let c = 0; c < subset.subsetCells.length; c++) {
    markElement(ctx, subset.subsetCells[c], "#004c66", "");
  }
  
  ctx.strokeStyle = "red";
  for (let c = 0; c < subset.subsetCells.length; c++) {
    for (let ci = 1; ci < 10; ci++) {
      let candidate = gel("candidate-" + gat(subset.subsetCells[c], "index") + "-" + ci.toString());
      if (optionIsExcludable(candidate)) {
        markElement(ctx, candidate, "red", "");
      }
    }
  }

  ctx.lineWidth   = "0.5";
  for (let c = 0; c < subset.excludes.length; c++) {
    let option = subset.excludes[c];
    markElement(ctx, option, "black", "rgba(250, 250, 20, 0.5)");
  }

  for (let i = 0; i < subset.subsetCells.length; i++) {
    joinParagraphWithElement(ctx, gel("somecells"), subset.subsetCells[i], "#004c66");
  }
  for (let i = 0; i < subset.excludes.length; i++) {
    joinParagraphWithElement(ctx, gel("excludes"), subset.excludes[i], "black");
  }
}

function findSubsetOfSizeInUnion(unionCells, sz, row, unit) {
  let possibleCells =[];
  for (let ui = 0; ui < 9; ui++) {
    let cell = unionCells[ui];
    // THIS IS THE POINT TO CHANGE
    let candidatesCount = parseInt(gat(cell, "candidatesCount"));
    if (candidatesCount > 1) {
      if (candidatesCount < sz + 1) {
        possibleCells.push(cell);
      }
    }
  }
  if (possibleCells.length < sz) {
    return null;
  }
  for (let pi = 0; pi < possibleCells.length; pi++) {
    let firstCell = possibleCells[pi];
    let subset = subsetInitFromCell(firstCell, unionCells, possibleCells, sz, unit);
    if (subset) {
      return subset;
    }
  }

  return null;
}

function subsetInitFromCell(firstCell, unionCells, possibleCells, subsetSize, unit) {
  let totalCandidates = {count:0} ;

  let valids = [0,0,0,0,0,0,0,0,0];
  let subsetCells = [];
  let excludes = [];
  forwardWithCell(firstCell, unionCells, possibleCells, subsetSize, valids, subsetCells, totalCandidates);



  return examine_subset(firstCell, unionCells, possibleCells, subsetSize, valids, subsetCells, totalCandidates, excludes, unit);
}
function examine_subset(firstCell, unionCells, possibleCells, subsetSize, valids, subsetCells, totalCandidates, excludes, unit) {
  let chainCount = subsetCells.length;
  if ((chainCount==subsetSize) && (totalCandidates.count==subsetSize) && subset_canBeUsefull(unionCells, valids, subsetCells, excludes)) {
    return {subsetCells, excludes, unit};
  } else {
    for (let ei = 0; ei < possibleCells.length; ei++) {
      let cell = possibleCells[ei];
      if (!subsetContainsCell(subsetCells, cell)) {
        if (forwardWithCell(cell, unionCells, possibleCells, subsetSize, valids, subsetCells, totalCandidates)) {
          return examine_subset(cell, unionCells, possibleCells, subsetSize, valids, subsetCells, totalCandidates, excludes, unit) ;
        }
      }
    }
  }
  return null;
}
function forwardWithCell(firstCell, unionCells, possibleCells, subsetSize, valids, subsetCells, totalCandidates) {
  let tmpTotalCandidates = 0;
  let cellIndex = gat(firstCell, "index");
  for (let option = 1; option < 10; option++) {
    let candidate = gel("candidate-" + cellIndex + "-" + option.toString());
    if (optionIsExcludable(candidate) || (valids[option-1] == 1)) {
      tmpTotalCandidates++;
    } 
  }
  if (tmpTotalCandidates < (subsetSize + 1)) {
    totalCandidates.count = tmpTotalCandidates;
    subsetCells.push(firstCell);
    for (let option = 1; option < 10; option++) {
      let candidate = gel("candidate-" + cellIndex + "-" + option.toString());
      if (optionIsExcludable(candidate)) {
        valids[option - 1] = 1;
      } 
    }
    return true;
  }

  return false;
}
function subset_canBeUsefull(unionCells, valids, subsetCells, excludes) {
  let hasExcludes = false;
  for (let i = 0; i < 9; i++) {
    let cell = unionCells[i];
    if (gat(cell, 'value') == '0') {
      if (!subsetContainsCell(subsetCells, cell)) {
        for (let option = 1; option < 10; option++) {
          if (valids[option-1] == 1) {
            let candidate = gel("candidate-" + gat(cell, "index") + "-" + option.toString());
            if (optionIsExcludable(candidate)) {
            
              excludes.push(candidate);
              hasExcludes = true;
            
            }
          }
        }
      }
    }
  }

  return hasExcludes;
}
function subsetContainsCell(subsetCells, cell){
  for (let sci = 0; sci < subsetCells.length; sci++) {
    if (gat(subsetCells[sci], "index") == gat(cell, "index")) {
      return true;
    } 
  }
  return false;
}


export {
  searchSubset,
  subsetFound,
}
