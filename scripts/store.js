import { setData, getData, removeData } from './utils/cookies.js';

class Store {
  constructor() {
    this.selectedCell = getData('selectedCell') || -1;
    this.defaultLang = getData('defaultLang') || 1;
    this.puzzle = '?';
    this.givens = 0;
    this.game = getData('game') || '?';
    this.selectedLevel = getData('selectedLevel') || 0;

    this.levelIndex = new Array(5);
    this.levelIndex[0] = getData('levelIndex0') || 1;
    this.levelIndex[1] = getData('levelIndex1') || 1;
    this.levelIndex[2] = getData('levelIndex2') || 1;
    this.levelIndex[3] = getData('levelIndex3') || 1;
    this.levelIndex[4] = getData('levelIndex4') || 1;

    this.selectedIndex = this.levelIndex[this.selectedLevel];

    this.undo = getData('undo') || '?';
    this.undosIdx = getData('undosIdx') || 0;
    this.exclude = getData('exclude') || '?';
    this.candidatesSet = getData('candidatesSet') || '?';

  }

  store(key, value) {
    setData(key, value);
  }

  remove(key) {
    removeData(key);
  }
  
  async loadPuzzle(handler, credentials) {
    const options = {
      method: 'GET',
      cache: "no-cache",
    }
    await fetch(`https://www.sudokun.com/getPuzzle.php?level=${this.selectedLevel}&counter=${this.selectedIndex}`, options)
    .then((data) => data.json())
    .then((data) => {
      this.puzzle = data.puzzle;
      this.givens = data.givens;
      if (!credentials) this.game = data.puzzle;

      handler();
    })
    .catch((error) => alert('error: ' + error.message));
  }
}

export default Store;
