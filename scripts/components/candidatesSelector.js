import {
  crel,
  doc,
  sat,
  setCh,
  setEx,
} from '../utils/shortHands.js';

import SelectCandidateButton from './selectCandidateButton.js';

export default class CandidatesSelector {
  constructor() {
    this.element = crel('div');
    this.element.id = 'candidatesSelector';
    this.element.className = 'insert-panel hidden';

    this.buttons = new Array(9);
    for (let i = 0; i < 9; i++) {
      this.buttons[i] = new SelectCandidateButton(i + 1);
      
      doc(this.element, this.buttons[i].element);
    }
  }
}