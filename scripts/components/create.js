import { crel } from '../utils.js';

function createComponents() {
  createGrid();

}

function createGrid() {
  const grid = crel('div');
  grid.id = 'main-grid';
  document.body.appendChild(grid);

}

export {
  createComponents,
};
