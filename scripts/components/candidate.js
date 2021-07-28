import {
  crel,
} from '../utils/shortHands.js';
function createCandidate(cellIndex, candidateIndex) {
  const candidate = crel('div');
  candidate.className = 'cell-candidate';
  candidate.id = `candidate-${cellIndex}-${candidateIndex + 1}`;
  candidate.innerHTML = candidateIndex + 1;

  return candidate;
}

export default createCandidate;
