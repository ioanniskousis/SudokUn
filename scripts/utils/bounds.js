export default class Bounds {
  constructor(left, top, width, height) {
    this.left = parseInt(left, 10);
    this.top = parseInt(top, 10);
    this.width = parseInt(width, 10);;
    this.height = parseInt(height, 10);;
  }

  bound(element) {
    element.style.left = `${this.left}px`;
    element.style.top = `${this.top}px`;
    element.style.width = `${this.width}px`;
    element.style.height = `${this.height}px`;
  }
}