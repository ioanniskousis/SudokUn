import {
  crel,
  sat,
} from '../utils/shortHands.js';

function createCell(blockIndex, row, col) {
  const blockRow = parseInt(blockIndex / 3, 10);
  const blockCol = blockIndex % 3;
  const cell = crel('div');
  cell.className = 'grid-cell';
  const cellIndex = parseInt((((blockRow * 3) + row) * 9) + ((blockCol * 3) + col), 10);
  cell.id = `cell-${cellIndex}`;
  sat(cell, 'index', cellIndex);
  sat(cell, 'row', (blockRow * 3) + row);
  sat(cell, 'col', (blockCol * 3) + col);

  return cell;
}

export default createCell;
