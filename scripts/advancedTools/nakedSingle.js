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
import { gel, gat, sat, isCh, optionValue, crel, doc, delay, isEx } from '../utils/shortHands.js';

function searchNakedSingle() {
  const cells = emptyCells();
  for (var i = 0; i < cells.length; i++) {
    const nakedSingle = searchNakedSingleInCell(cells[i])
    if (nakedSingle) return nakedSingle
  }

  return null;
}
function searchNakedSingleInCell(cell) {
  const cellIndex = gat(cell, 'index');
  const neighbors = getNeighborhood(cell)
  let neighborsWithNumber = new Array(9);
  for (let i = 0; i < 9; i++) {
    const candidate = gel('candidate-' + cellIndex + '-' + (i + 1).toString());
    neighborsWithNumber[i] = isEx(candidate) ? candidate : cellsArrayNumberHolderCell(neighbors, (i + 1).toString())
  }
  const empties = neighborsWithNumber.filter((c) => c === null)
  if (empties.length === 1 ) {
    for (let i = 0; i < 9; i++) {
      if (neighborsWithNumber[i] === null) {
        const candidate = gel('candidate-' + cellIndex + '-' + (i + 1).toString());
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
  const otherNumbers = nakedSingle.otherNumbers.filter((n) => n != null && n.id.match('cell')).map((cell) => gat(cell, 'value')).join(' ')
  const excludedNumbers = nakedSingle.otherNumbers.filter((n) => n != null && gat(n, 'id').match('candidate')).map((candidate) => gat(candidate, 'candidateNumber')).join(' ')
  paragraph.innerHTML = 'All other numbers [' + otherNumbers + '] exist in neighboring cells' + (excludedNumbers.length > 0 ? ' or [' + excludedNumbers + '] are excluded' : '');
  tipCloud.appendChild(paragraph);
}
function drawNakedSingle(nakedSingle) {
  let ctx = setUpCanvas()

  // frameCandidate(ctx, nakedSingle.option, "red")
  markElement(ctx, nakedSingle.option, "#fc0022", null)
  // setCh(nakedSingle.option, "1")
  updateCandidateTemporary(gat(nakedSingle.firstCell, 'index'), gat(nakedSingle.option, 'candidatenumber'), true)
  
  joinParagraphWithElement(ctx, gel("thiscell"), nakedSingle.option, "#0022fc", 1);
  const otherNumbers = nakedSingle.otherNumbers.filter((n) => n != null)
  for (let i = 0; i < otherNumbers.length; i++) {
    markElement(ctx, otherNumbers[i], "#fc0022", null)
    // if (nakedSingle.otherNumbers[i] != null) {
      // joinParagraphWithElement(ctx, gel("otherNumbers"), nakedSingle.otherNumbers[i], "#004c22", 0.5);
    // }
  }
}


export {
  searchNakedSingle,
  nakedSingleFound,
}
