import {
  crel,
  doc,
  sat,
  setCh,
  setEx,
} from '../utils/shortHands.js';

export default class SelectCandidateButton {
  constructor(number) {
    this.element = crel('button');
    this.element.className = 'candidate-button';
    this.element.id = `candidate-button-${number}`;

    this.element.innerHTML = number;

    this.value = number;
  }
}
