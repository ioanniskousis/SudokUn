import {
  crel,
  doc,
} from '../utils/shortHands.js';

import CandidateClass from './candidateClass.js';

export default class CandidatesContainerClass {
  constructor(blockIndex, row, col) {
    const blockRow = parseInt(blockIndex / 3, 10);
    const blockCol = blockIndex % 3;
    this.element = crel('div');
    this.element.className = 'cell-candidates-container';
    const cellIndex = parseInt((((blockRow * 3) + row) * 9) + ((blockCol * 3) + col), 10);
    this.element.id = `cell-candidates-container-${cellIndex}`;
    // sat(this.element, 'index', cellIndex);
    this.index = cellIndex;

    this.candidates = new Array(9);
    for (let i = 0; i < 3; i++) {
      for (let k = 0; k < 3; k++) {
        const candidateIndex = (i * 3) + k;
        this.candidates[candidateIndex] = new CandidateClass(cellIndex, candidateIndex);
        doc(this.element, this.candidates[candidateIndex].element);
      }
    }
  }

  layout(bounds) {

    // this.grid.layout(bounds);

  }
}