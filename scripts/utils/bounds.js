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

  getRect(element) {
    const box = element.getBoundingClientRect();
    this.left = box.left;
    this.top = box.top;
    this.width = box.width;
    this.height = box.height;
  }

  setRect(left, top, width, height) {
    this.left = parseInt(left, 10);
    this.top = parseInt(top, 10);
    this.width = parseInt(width, 10);;
    this.height = parseInt(height, 10);;
  }

  contains(x, y) {
    if (x < this.left) return false;
    if (y < this.top) return false;
    if (x > this.left + this.width) return false;
    if (y > this.top + this.height) return false;

    return true;
  }
}