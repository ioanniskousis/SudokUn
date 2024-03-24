import {
  crel,
} from '../utils/shortHands.js';

export default class CandidateClass {
  constructor(cellIndex, candidateIndex) {
    this.element = crel('div');
    this.element.className = 'cell-candidate hidden';
    this.element.id = `candidate-${cellIndex}-${candidateIndex + 1}`;
    this.element.innerHTML = candidateIndex + 1;

    this.cellIndex = cellIndex;
    this.candidateNumber = candidateIndex + 1;
    this.checked = false;
    this.excluded = false;
  }
}
