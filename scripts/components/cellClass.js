import {
  crel,
  doc,
} from '../utils/shortHands.js';

export default class CellClass {
  constructor(blockIndex, row, col) {
    const blockRow = parseInt(blockIndex / 3, 10);
    const blockCol = blockIndex % 3;
    this.element = crel('div');
    this.element.className = 'grid-cell';
    const cellIndex = (((blockRow * 3) + row) * 9) + ((blockCol * 3) + col);
    this.element.id = `cell-${cellIndex}`;

    this.index = cellIndex;
    this.block = blockIndex;
    this.row = (blockRow * 3) + row;
    this.column = (blockCol * 3) + col;
  }
}