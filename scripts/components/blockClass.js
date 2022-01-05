import {
  crel,
  doc,
  sat,
  setCh,
  setEx,
} from '../utils/shortHands.js';

import CandidatesContainerClass from './candidatesContainerClass.js';
import CellClass from './cellClass.js';

export default class BlockClass {
  constructor(blockIndex) {
    this.element = crel('div');
    this.element.className = 'grid-block';
    this.index = blockIndex;
    // this.element.id = `block-${index}`;
    this.candidatesContainers = new Array(9);
    this.cells = new Array(9);

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const index = (row * 3) + col;
        this.candidatesContainers[index] = new CandidatesContainerClass(blockIndex, row, col);
        this.cells[index] = new CellClass(blockIndex, row, col);

        doc(this.element, this.candidatesContainers[index].element);
        doc(this.element, this.cells[index].element);
      }
    }

  }
}