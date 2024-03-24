import {
  crel,
  doc,
  sat,
  setCh,
  setEx,
} from '../utils/shortHands.js';

import SelectNumberButton from './selectNumberButton.js';

export default class NumbersSelector {
  constructor() {
    this.element = crel('div');
    this.element.id = 'numbersSelector';
    this.element.className = 'insert-panel';

    this.buttons = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.buttons[i] = new SelectNumberButton(i);
      
      doc(this.element, this.buttons[i].element);
    }
  }
}