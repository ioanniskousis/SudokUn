import {
  crel,
  doc,
  sat,
  setCh,
  setEx,
} from '../utils/shortHands.js';

import BlockClass from './blockClass.js';

export default class GridClass {
  constructor() {
    this.element = crel('div');
    this.element.id = 'main-grid';

    this.blocks = new Array(9)

    for (let i = 0; i < 9; i++) {
      this.blocks[i] = new BlockClass(i);
      doc(this.element, this.blocks[i].element);
    }
  }

  layout(bounds) {
    
  }

  isClicked() {

    return false;
  }
}