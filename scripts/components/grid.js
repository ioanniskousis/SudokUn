import {
  crel,
  doc,
} from '../utils/shortHands.js';
import createBlock from './block.js';

function createGrid() {
  const grid = crel('div');
  grid.id = 'main-grid';

  for (let i = 0; i < 9; i++) {
    doc(grid, createBlock(i));
  }

  return grid;
}

export default createGrid;
