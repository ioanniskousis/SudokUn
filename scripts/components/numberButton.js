import {
  crel,
  sat,
} from '../utils/shortHands.js';

function createNumberButton(number) {
  const button = crel('button');
  button.className = 'number-button';
  button.id = `number-button-${number}`;
  button.style.border = 'none';
  button.innerHTML = number || '';
  button.style.padding = '0';
  sat(button, 'value', number);

  return button;
}

export default createNumberButton;
