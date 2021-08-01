import {
  crel,
  sat,
} from '../utils/shortHands.js';

function createCandidateButton(number) {
  const button = crel('button');
  button.className = 'candidate-button';
  button.id = `candidate-button-${number}`;
  button.style.border = 'none';
  button.innerHTML = number || '';
  button.style.padding = '0';
  sat(button, 'value', number);

  return button;
}

export default createCandidateButton;
