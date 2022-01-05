import {
  crel,
  doc,
  sat,
  setCh,
  setEx,
} from '../utils/shortHands.js';

import SelectExcludeButton from './selectExcludeButton.js';

export default class ExcludesSelector {
  constructor() {
    this.element = crel('div');
    this.element.id = 'excludesSelector';
    this.element.className = 'insert-panel hidden';

    this.buttons = new Array(9);
    for (let i = 0; i < 9; i++) {
      this.buttons[i] = new SelectExcludeButton(i + 1);
      
      doc(this.element, this.buttons[i].element);
    }
  }
}