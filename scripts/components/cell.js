import {
  crel,
  sat,
} from '../utils/shortHands.js';

function createCell(blockIndex, row, col) {
  const blockRow = parseInt(blockIndex / 3, 10);
  const blockCol = blockIndex % 3;
  const cell = crel('div');
  cell.className = 'grid-cell';
  const cellIndex = (((blockRow * 3) + row) * 9) + ((blockCol * 3) + col);
  cell.id = `cell-${cellIndex}`;
  sat(cell, 'index', cellIndex);
  sat(cell, 'block', blockIndex);
  sat(cell, 'row', (blockRow * 3) + row);
  sat(cell, 'col', (blockCol * 3) + col);

  return cell;
}

export default createCell;
