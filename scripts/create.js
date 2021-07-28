import {
  crel,
  gel,
  doc,
  sat,
} from './utils/shortHands.js';

function createCandidate(cellIndex, candidateIndex) {
  const candidate = crel('div');
  candidate.className = 'cell-candidate';
  candidate.id = `candidate-${cellIndex}-${candidateIndex + 1}`;
  candidate.innerHTML = candidateIndex + 1;

  return candidate;
}

function createCandidatesContainer(blockIndex, row, col) {
  const blockRow = parseInt(blockIndex / 3, 10);
  const blockCol = blockIndex % 3;
  const container = crel('div');
  container.className = 'cell-candidates-container';
  const cellIndex = parseInt((((blockRow * 3) + row) * 9) + ((blockCol * 3) + col), 10);
  container.id = `cell-candidates-container-${cellIndex}`;
  sat(container, 'index', cellIndex);
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      doc(container, createCandidate(cellIndex, (i * 3) + k))
    }
  }

  return container;
}

function createCell(blockIndex, row, col) {
  const blockRow = parseInt(blockIndex / 3, 10);
  const blockCol = blockIndex % 3;
  const cell = crel('div');
  cell.className = 'grid-cell';
  const cellIndex = parseInt((((blockRow * 3) + row) * 9) + ((blockCol * 3) + col), 10);
  cell.id = `cell-${cellIndex}`;
  sat(cell, 'index', cellIndex);

  return cell;
}

function createBlock(index) {
  const block = crel('div');
  block.id = `block-${index}`;
  block.className = 'grid-block'

  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      doc(block, createCandidatesContainer(index, i, k));
      doc(block, createCell(index, i, k));
    }
  }

  return block;
}

function createGrid() {
  const grid = crel('div');
  grid.id = 'main-grid';

  for (let i = 0; i < 9; i++) {
    doc(grid,createBlock(i));
  }

  return grid;
}

function createSearchPanel() {
  
}

function createExcludePanel() {
  
}

function createCandidatesPanel() {
  
}

function createInputPanel() {

}

function createPlayGround() {
  const playGround = crel('div');
  playGround.id = 'play-ground';

  doc(playGround, createGrid());

  return playGround;
}

function createComponents() {
  doc(gel('main'), createPlayGround());
}

export {
  createComponents,
};
