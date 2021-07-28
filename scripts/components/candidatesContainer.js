import {
  crel,
  doc,
  sat,
} from '../utils/shortHands.js';
import createCandidate from './candidate.js';

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

export default createCandidatesContainer;
