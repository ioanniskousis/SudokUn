import { gel } from './utils/shortHands.js';
import Bounds from './utils/bounds.js';

function layoutFileSelector() {
  const bounds = new Bounds();
  bounds.getRect(gel('main-grid'));

  const fileSelector = gel('fileSelector');
  bounds.bound(fileSelector);

  const levelSelectors = fileSelector.children;
  for (let i = 0; i < levelSelectors.length; i++) {
    const levelSelector = levelSelectors[i];
    levelSelector.style.fontSize = `${bounds.height * 0.04}px`;

    const shiftLeft = gel(`levelShiftLeft-${i}`);
    shiftLeft.style.width = `${bounds.height * 0.06}px`;
    shiftLeft.style.height = `${bounds.height * 0.06}px`;
    
    const shiftRight = gel(`levelShiftRight-${i}`);
    shiftRight.style.width = `${bounds.height * 0.06}px`;
    shiftRight.style.height = `${bounds.height * 0.06}px`;

    const indexInput = gel(`indexInput-${i}`);
    indexInput.style.width = `${bounds.height * 0.1}px`;
    indexInput.style.margin = `0 ${bounds.height * 0.02}px`;
    indexInput.style.fontSize = `${bounds.height * 0.03}px`;
    indexInput.style.padding = `${bounds.height * 0.01}px`;

    const playButton = gel(`playButton-${i}`);
    playButton.style.fontSize = `${bounds.height * 0.03}px`;
    playButton.style.padding = `${bounds.height * 0.02}px ${bounds.height * 0.05}px`;
    playButton.style.marginLeft = `${bounds.height * 0.05}px`;
  }

}

function layoutCellCandidates(cellIndex, cellSize) {
  const candidateSize = (cellSize - 2) / 3.0;
  const locations = [0.0, candidateSize , candidateSize * 2.0];
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      const candidateIndex = (i * 3) + k + 1;
      const candidate = gel(`candidate-${cellIndex}-${candidateIndex}`);
      const bounds = new Bounds (
        locations[k] + 2,
        locations[i] + 2,
        candidateSize - 4,
        candidateSize - 4
      );
      bounds.bound(candidate);
      candidate.style.fontSize = `${parseInt(candidateSize * 0.6)}px`
    }
  }
}

function layoutBlockCells(blockIndex, blockSize) {
  const cellSize = parseInt((blockSize - 2.0) / 3.0, 10);
  const locations = [0.0, cellSize + 1.0, (cellSize + 1.0) * 2.0];
  const blockRow = parseInt(blockIndex / 3, 10);
  const blockCol = blockIndex % 3;
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      const cellIndex = parseInt((((blockRow * 3) + i) * 9) + ((blockCol * 3) + k), 10);
      const cell = gel(`cell-${cellIndex}`);
      const candidatesContainer = gel(`cell-candidates-container-${cellIndex}`);
      const bounds = new Bounds (
        locations[k],
        locations[i],
        cellSize,
        cellSize
      );
      bounds.bound(cell);
      bounds.bound(candidatesContainer);
      cell.style.fontSize = `${parseInt(cellSize * 0.6)}px`

      layoutCellCandidates(cellIndex, cellSize);
    }
  }
}

function layoutBlocks(parentSize) {
  const blockSize = (parentSize - 6.0) / 3.0;
  const locations = [0.0, blockSize + 3.0, (blockSize + 3.0) * 2.0];
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      const blockIndex = (i * 3) + k;
      const block = gel(`block-${blockIndex}`);
      const bounds = new Bounds (
        locations[k],
        locations[i],
        blockSize,
        blockSize
      );
      bounds.bound(block);
      layoutBlockCells(blockIndex, blockSize)

    }
  }
}

function layoutGrid(parentWidth, parentHeight, isLandscape) {
  let bounds = null;
  if (isLandscape) {
    const paddingSize = (parentWidth / 11.0);
    bounds = new Bounds (
      paddingSize,
      paddingSize,
      parentWidth * (9.0 / 11.0),
      parentWidth * (9.0 / 11.0)
    );
  } else {
    bounds = new Bounds (
      0.0,
      parentWidth / 4.5,
      parentWidth,
      parentWidth
    );
  }
  bounds.bound(gel('main-grid'));

  layoutBlocks(bounds.width);
}

function layoutPanels(parentWidth, parentHeight, isLandscape) {
  const gridSize = isLandscape ? parseInt(parentWidth * 9 / 11) : parentWidth;
  const cellSize = isLandscape ? parseInt(parentWidth / 11, 10) : parseInt(parentHeight / 13, 10);

  const alertNoSelection = gel('alertNoSelection');

  const numbersSelector = gel('numbersSelector');
  const numberButtons = numbersSelector.children;
  for (let i = 0; i < numberButtons.length; i++) {
    const button = numberButtons[i];
    button.style.width = `${parseInt(cellSize * 0.6, 10)}px`;
    button.style.height = `${parseInt(cellSize * 0.6, 10)}px`;
    button.style.margin = `${parseInt(cellSize * 0.05, 10)}px`;
    button.style.fontSize = `${parseInt(cellSize * 0.4, 10)}px`;
  }

  const candidatesSelector = gel('candidatesSelector');
  const candidateButtons = candidatesSelector.children;
  for (let i = 0; i < candidateButtons.length; i++) {
    const button = candidateButtons[i];
    button.style.width = `${parseInt(cellSize * 0.6, 10)}px`;
    button.style.height = `${parseInt(cellSize * 0.6, 10)}px`;
    button.style.margin = `${parseInt(cellSize * 0.05, 10)}px`;
    button.style.fontSize = `${parseInt(cellSize * 0.4, 10)}px`;
  }

  const fileController = gel('fileController');
  const tipsController = gel('tipsController');
  const fileControllerButtons = fileController.children;
  const tipsControllerButtons = tipsController.children;

  const insertModeContainer = gel('insertModeContainer');
  const insertModeButton = gel('insertModeButton');
  insertModeButton.style.width = `${parseInt(cellSize * 0.6, 10)}px`;
  insertModeButton.style.height = `${parseInt(cellSize * 0.6, 10)}px`;

  for (let i = 0; i < fileControllerButtons.length; i++) {
    const element = fileControllerButtons[i];
    element.style.width = `${parseInt(cellSize * 0.8, 10)}px`;
    element.style.height = `${parseInt(cellSize * 0.8, 10)}px`;
    element.style.margin = `${parseInt(cellSize * 0.1, 10)}px`;
    element.style.fontSize = `${parseInt(cellSize * 0.2, 10)}px`;
  }

  for (let i = 0; i < tipsControllerButtons.length; i++) {
    const button = tipsControllerButtons[i];
    button.style.width = `${parseInt(cellSize * 0.8, 10)}px`;
    button.style.height = `${parseInt(cellSize * 0.8, 10)}px`;
    button.style.margin = `${parseInt(cellSize * 0.1, 10)}px`;
  }

  const undosController = gel('undosController');
  const undosControllerButtons = undosController.children;
  for (let i = 0; i < undosControllerButtons.length; i++) {
    const button = undosControllerButtons[i];
    button.style.width = `${parseInt(cellSize * 0.8, 10)}px`;
    button.style.height = `${parseInt(cellSize * 0.8, 10)}px`;
    button.style.margin = `${parseInt(cellSize * 0.1, 10)}px`;
  }

  const restartController = gel('restartController');
  const restartControllerButtons = restartController.children;
  for (let i = 0; i < restartControllerButtons.length; i++) {
    const button = restartControllerButtons[i];
    button.style.width = `${parseInt(cellSize * 0.8, 10)}px`;
    button.style.height = `${parseInt(cellSize * 0.8, 10)}px`;
    button.style.margin = `${parseInt(cellSize * 0.1, 10)}px`;
  }

  const bounds = new Bounds();

  if (isLandscape) {
    fileController.style.flexDirection = 'column';
    tipsController.style.flexDirection = 'column';

    bounds.setRect (cellSize, 0, gridSize - 2, cellSize);
    bounds.bound(numbersSelector);
    bounds.bound(candidatesSelector);
    bounds.bound(alertNoSelection);
    alertNoSelection.style.fontSize = `${parseInt(cellSize * 0.4, 10)}px`;

    bounds.setRect (cellSize, cellSize + gridSize, gridSize, cellSize);
    bounds.bound(undosController);

    bounds.setRect (gridSize, cellSize + gridSize, cellSize, cellSize);
    bounds.bound(restartController);

    bounds.setRect (0, cellSize, cellSize, parseInt((gridSize - 6.0) / 3.0, 10));
    bounds.bound(fileController);

    bounds.setRect (cellSize + gridSize, cellSize, cellSize, parseInt((gridSize - 6.0) / 3.0, 10));
    bounds.bound(tipsController);

    bounds.setRect (cellSize, 0, cellSize, cellSize);
    bounds.bound(insertModeContainer);
  } else {
    fileController.style.flexDirection = 'row';
    tipsController.style.flexDirection = 'row';

    bounds.setRect (0, cellSize, gridSize, cellSize);
    bounds.bound(numbersSelector);
    bounds.bound(candidatesSelector);
    bounds.bound(alertNoSelection);
    alertNoSelection.style.fontSize = `${parseInt(cellSize * 0.4, 10)}px`;

    bounds.setRect (0, cellSize + cellSize + gridSize, gridSize, cellSize);
    bounds.bound(undosController);

    bounds.setRect (gridSize, cellSize + cellSize + gridSize, cellSize, cellSize);
    bounds.bound(restartController);

    bounds.setRect(0, 0, parseInt((gridSize - 6.0) / 3.0, 10), cellSize);
    bounds.bound(fileController);

    bounds.setRect(parseInt(((gridSize + 3.0) * 7.0 / 9.0), 10), 0, parseInt((gridSize - 6.0) * 2.0 / 9.0, 10), cellSize);
    bounds.bound(tipsController);

    bounds.setRect (0, cellSize, cellSize, cellSize);
    bounds.bound(insertModeContainer);
  }
}

function layoutPlayGround(wWidth, wHeight, isLandscape) {
  let bounds = null;
  if (isLandscape) {
    bounds = new Bounds (
      (wWidth - wHeight) / 2.0,
      0.0,
      wHeight,
      wHeight
    );
  } else {
    if ((wHeight / wWidth) < (13.0 / 9.0)) {
      bounds = new Bounds (
        (wWidth - (wHeight * (9.0 / 13.0))) / 2.0,
        0.0,
        wHeight * (9.0 / 13.0),
        wHeight
      );
    } else {
      bounds = new Bounds (
        0.0,
        (wHeight - (wWidth * (13.0 / 9.0))) / 2.0,
        wWidth,
        wWidth * (13.0 / 9.0)
      );
    }
  }
  bounds.bound(gel('play-ground'));

  layoutGrid(bounds.width, bounds.height, isLandscape);
  layoutPanels(bounds.width, bounds.height, isLandscape)
}

function layout() {
  const wWidth = window.innerWidth;
  const wHeight = window.innerHeight;
  const isLandscape = wWidth > wHeight;

  layoutPlayGround(wWidth, wHeight, isLandscape);
  layoutFileSelector();
}

function clickOnGame(e) {
  const bounds = new Bounds();
  bounds.getRect(gel('main-grid'));
  const cellSize = (bounds.width - 6.0) / 9.0;
  bounds.top -= cellSize;
  bounds.height += cellSize;

  return bounds.contains(e.pageX, e.pageY);
}

function clickOnGrid(e) {
  const bounds = new Bounds();
  bounds.getRect(gel('main-grid'));

  return bounds.contains(e.pageX, e.pageY);
}

function clickOnSelectors(e) {
  const bounds = new Bounds();
  bounds.getRect(gel('numbersSelector'));

  return bounds.contains(e.pageX, e.pageY);
}

export {
  layout,
  clickOnGame,
  clickOnSelectors,
  clickOnGrid,
}
