import {
  crel,
  doc
} from '../utils/shortHands.js';
import createCell from './cell.js';
import createCandidatesContainer from './candidatesContainer.js';

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

export default createBlock;
