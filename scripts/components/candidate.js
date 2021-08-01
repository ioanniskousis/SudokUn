import {
  crel,
  setCh,
} from '../utils/shortHands.js';

function createCandidate(cellIndex, candidateIndex) {
  const candidate = crel('div');
  candidate.className = 'cell-candidate';
  candidate.id = `candidate-${cellIndex}-${candidateIndex + 1}`;
  candidate.innerHTML = candidateIndex + 1;
  setCh(candidate, false);

  return candidate;
}

export default createCandidate;
