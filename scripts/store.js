import { setData, getData, removeData } from './utils/cookies.js';
import {
  gel,
  isCh,
  isEx,
 } from './utils/shortHands.js';

class Store {
  constructor() {
    this.selectedCell = getData('selectedCell') || -1;
    this.defaultLang = getData('defaultLang') || 1;
    this.puzzle = getData('puzzle') || '';
    this.givens = getData('givens') || 0;
    this.hardness = getData('hardness') || 0;
    this.game = getData('game') || '';
    this.selectedLevel = getData('selectedLevel') || 0;

    this.levelIndex = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.levelIndex[i] = getData(`levelIndex${i}`) || 1;
      gel(`indexInput-${i}`).value = this.levelIndex[i];
    }

    this.levelLimits = new Array(5);

    this.selectedIndex = this.levelIndex[this.selectedLevel];

    this.undosIndex = parseInt(getData('undosIndex'), 10) || -1;
    this.parseUndos(getData('undo') || '')

    this.exclude = getData('exclude') || '';
    this.candidatesSet = getData('candidatesSet') || '';

    this.levelCaptions = [
      'Easy',
      'Medium',
      'Hard',
      'Evil',
      'Beatific',
    ];

    this.allowMistakes = (getData('allowMistakes') === '1') || false;
    gel('alertInvalidCheckBox').checked = this.allowMistakes;


    gel('debugBox').value = this.candidatesSet;
  } 

  parseUndos(undosString) {
    this.undo = [];
    const undos = undosString.split(',');
    undos.forEach(undo => {
      const credentials = undo.split(':');
      if (credentials[0].length > 0) {
        this.undo.push(
          new Undo(
            credentials[0],
            credentials[1],
            credentials[2],
            credentials[3],
            credentials[4]
          )
        )  
      }
    });
    
  }

  addUndo(newUndo) {
    if (this.undosIndex > -1) {
      const currentUndo = this.undo[this.undosIndex];
      if (
        (currentUndo.type === newUndo.type) && 
        (currentUndo.cellIndex === newUndo.cellIndex) &&
        (currentUndo.candidate === newUndo.candidate) &&
        ((currentUndo.newValue === newUndo.newValue))
        ) {
        return;
      }
    }

    this.undo.splice(this.undosIndex + 1);
    this.undo.push(newUndo);
    this.undosIndex = this.undo.length - 1;
  }

  undosToString() {
    let s = '';
    this.undo.forEach((undo) => {
      s = s.concat(
        undo.type, ':',
        undo.cellIndex, ':',
        undo.candidate, ':',
        undo.oldValue, ':',
        undo.newValue, ','
      )
    }); 
    return s;
  }

  storeGame() {
    this.storeValue('puzzle', this.puzzle);
    this.storeValue('game', this.game);
    this.storeValue('selectedLevel', this.selectedLevel);
    this.storeValue(`levelIndex${this.selectedLevel}`, this.levelIndex[this.selectedLevel]);
    this.storeValue('selectedIndex', this.selectedIndex);

    this.storeValue('givens', this.givens);
    this.storeValue('hardness', this.hardness);

    this.storeValue('undo', this.undosToString());
    this.storeValue('undosIndex', this.undosIndex);
    this.storeValue('exclude', this.exclude);

    this.storeValue('candidatesSet', this.candidatesSet);

  }

  restart() {
    this.game =  this.puzzle;
    this.undo = [];
    this.undosIndex = -1;
    this.exclude = [];
    this.candidatesSet = '';

    this.storeGame();
  }

  storeValue(key, value) {
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
        gel(`levelLabel-${i}`).innerHTML = this.levelCaptions[i];
        //  + `<span class="small">${this.levelLimits[i]}</span>`;
        gel(`indexInput-${i}`).max = this.levelLimits[i];
      }
    })
    .catch((error) => alert('loadLimits error: ' + error.message));

  }

  async loadPuzzle(handler, clearGame) {
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
    .then((data) => data.json())
    .then((data) => {
      this.selectedLevel = data.level;
      this.selectedIndex = data.counter;
      this.givens = data.givens;
      this.hardness = data.hadrness;
      this.levelIndex[this.selectedLevel] = this.selectedIndex;

      this.puzzle = data.puzzle;
      this.givens = data.givens;

      if (clearGame || (this.game === '')) {
        this.game = data.puzzle;
        this.undo = [];
        this.undosIndex = -1;
        this.exclude = '';
        this.candidatesSet = '';
      }

      this.storeGame();
      handler();
    })
    .catch((error) => alert('loadPuzzle error: ' + error.message));


  }
}

export class Undo {
  constructor(type, cellIndex, candidate, oldValue, newValue) {
    this.type = type;
    this.cellIndex = cellIndex;
    this.candidate = candidate;
    this.oldValue = oldValue;
    this.newValue = newValue;
  }
}

export default Store;
