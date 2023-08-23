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
} from './advanced.js';
import { gel, gat, sat, isCh, optionValue, crel, doc, delay } from '../utils/shortHands.js';

function searchNakedSingle() {
  const cells = emptyCells();
  for (var i = 0; i < cells.length; i++) {
    const nakedSingle = searchNakedSingleInCell(cells[i])
    if (nakedSingle) return nakedSingle
  }

  return null;
}
function searchNakedSingleInCell(cell) {
  const neighbors = getNeighborhood(cell)
  let neighborsWithNumber = new Array(9);
  for (let i = 0; i < 9; i++) {
    neighborsWithNumber[i] = cellsArrayNumberHolderCell(neighbors, (i + 1).toString())
  }
  const empties = neighborsWithNumber.filter((c) => c === null)
  if (empties.length === 1 ) {
    for (let i = 0; i < 9; i++) {
      if (neighborsWithNumber[i] === null) {
        const candidate = gel('candidate-' + gat(cell, 'index') + '-' + (i + 1).toString());
        return {firstCell:cell, option:candidate, otherNumbers: neighborsWithNumber};
      }
    }
  }

  return null
}


function nakedSingleFound(nakedSingle) {
  explaneNakedSingle(nakedSingle);
  delay(500).then(
    () => drawNakedSingle(nakedSingle)
  );
}
function explaneNakedSingle(nakedSingle) {
  const tipCloud = gel('tipCloud');
  tipCloud.innerHTML = '';
  sat(tipCloud, "tool", "nakedSingle");

  var paragraph = crel("p");
  sat(paragraph, "class", "xlh");
  paragraph.innerHTML = "A Naked Single found" ;
  tipCloud.appendChild(paragraph);  

  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  paragraph.innerHTML = "The one and only candidate for <span class=\"explP\" id=\"thiscell\">this cell</span> is " + optionValue(nakedSingle.option) ;
  tipCloud.appendChild(paragraph);  

  var thismeans = "This means:<br/>";
  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  thismeans = thismeans + "You must select " + optionValue(nakedSingle.option) + " for this cell";
  paragraph.innerHTML = thismeans;
  tipCloud.appendChild(paragraph);

  paragraph = document.createElement("p");
  sat(paragraph, "class", "xlp");
  sat(paragraph, "id", "otherNumbers");
  const otherNumbers = nakedSingle.otherNumbers.filter((n) => n != null).map((candidate) => candidate === null ? '' : gat(candidate, 'value')).join(' ')
  paragraph.innerHTML = 'All other numbers [' + otherNumbers + '] exist in neighboring cells';
  tipCloud.appendChild(paragraph);
}
function drawNakedSingle(nakedSingle) {
  let ctx = setUpCanvas()

  // frameCandidate(ctx, nakedSingle.option, "red")
  markElement(ctx, nakedSingle.option, "#fc0022", null)
  // setCh(nakedSingle.option, "1")
  updateCandidateTemporary(gat(nakedSingle.firstCell, 'index'), gat(nakedSingle.option, 'candidatenumber'), true)
  
  joinParagraphWithElement(ctx, gel("thiscell"), nakedSingle.firstCell, "#0022fc", 1);
  for (let i = 0; i < nakedSingle.otherNumbers.length; i++) {
    if (nakedSingle.otherNumbers[i] != null) {
      // joinParagraphWithElement(ctx, gel("otherNumbers"), nakedSingle.otherNumbers[i], "#004c22", 0.5);
      markElement(ctx, nakedSingle.otherNumbers[i], "#fc0022", null)
    }
  }
}


export {
  searchNakedSingle,
  nakedSingleFound,
}
