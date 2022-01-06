import {
  crel,
  doc,
  sat,
  setCh,
  setEx,
} from '../utils/shortHands.js';

import GridClass from './gridClass.js';
import NumbersSelector from './numbersSelector.js';

export default class PlayGroundClass {
  constructor() {
    this.element = crel('div');
    this.element.id = 'play-ground';

    this.grid = new GridClass();
    this.numbersSelector = new NumbersSelector();

    doc(this.element, this.grid.element);
  }

  layout(bounds) {

    this.grid.layout(bounds);

  }

  isClicked() {

    return false;
  }
}