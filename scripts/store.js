import { setData, getData, removeData } from './utils/cookies.js';
import { gel } from './utils/shortHands.js';

class Store {
  constructor() {
    this.selectedCell = getData('selectedCell') || -1;
    this.defaultLang = getData('defaultLang') || 1;
    this.puzzle = getData('puzzle') || '?';
    this.givens = getData('givens') || 0;
    this.game = getData('game') || '?';
    this.selectedLevel = getData('selectedLevel') || 0;

    this.levelIndex = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.levelIndex[i] = getData(`levelIndex${i}`) || 1;
      gel(`indexInput-${i}`).value = this.levelIndex[i];
    }

    this.levelLimits = new Array(5);

    this.selectedIndex = this.levelIndex[this.selectedLevel];

    this.undo = getData('undo') || '?';
    this.undosIdx = getData('undosIdx') || 0;
    this.exclude = getData('exclude') || '?';
    this.candidatesSet = getData('candidatesSet') || '?';

    this.levelCaptions = [
      'Easy',
      'Medium',
      'Hard',
      'Evil',
      'Beatific',
    ];
  }

  store(key, value) {
    setData(key, value);
  }

  remove(key) {
    removeData(key);
  }
  
  async loadLimits() {
    const headers = new Headers();
    headers.append('pragma', 'no-cache');
    headers.append('cache-control', 'no-cache');

    const options = {
      method: 'GET',
      headers: headers,
    };
    const getPuzzleUrl = 'https://www.sudokun.com/getLimits.php';

    await fetch(getPuzzleUrl, options)
    .then((data) => data.json())
    .then((data) => {
      for (let i = 0; i < 5; i++) {
        this.levelLimits[i] = data.levelLimits[i]
        gel(`levelLabel-${i}`).innerHTML = this.levelCaptions[i] + `<span class="small">${this.levelLimits[i]}</span>`;
        gel(`indexInput-${i}`).max = this.levelLimits[i];
      }
    })
    .catch((error) => alert('loadLimits error: ' + error.message));

  }

  async loadPuzzle(handler, credentials) {
    const headers = new Headers();
    headers.append('pragma', 'no-cache');
    headers.append('cache-control', 'no-cache');

    const options = {
      method: 'GET',
      headers: headers,
    }
    
    const baseUrl = 'https://www.sudokun.com/getPuzzle.php';
    const srch = `level=${this.selectedLevel}&counter=${this.selectedIndex}`;
    const getPuzzleUrl = `${baseUrl}?${srch}`;

    await fetch(getPuzzleUrl, options)
    .then((data) => {
      // console.log(data);
      // console.log(data.json());
      // return data.json();
      // alert(data);
      return data.json();
    })
    .then((data) => {
      // alert(JSON.stringify(data));
      // alert(data);
      this.puzzle = data.puzzle;
      this.givens = data.givens;
      if (!credentials) this.game = data.puzzle;

      handler();
    })
    .catch((error) => alert('loadPuzzle error: ' + error.message));


  }
}

export default Store;
