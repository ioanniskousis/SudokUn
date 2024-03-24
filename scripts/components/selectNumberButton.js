import {
  crel,
  doc,
  sat,
  setCh,
  setEx,
} from '../utils/shortHands.js';

export default class SelectNumberButton {
  constructor(number) {
    this.element = crel('button');
    this.element.className = 'number-button';
    this.element.id = `number-button-${number}`;

    this.element.innerHTML = number || '';

    this.value = number;
  }
}
