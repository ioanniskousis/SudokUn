import { gel } from './utils/shortHands.js';
import Bounds from './utils/bounds.js';
import { hideCanvas } from './viewController.js'

function layoutSettingsView() {
  const bounds = new Bounds();
  bounds.getRect(gel('main-grid'));

  const settingsView = gel('settingsView');
  bounds.bound(settingsView);
  settingsView.style.padding = `${bounds.height * 0.1}px`;

  const settingsSelectors = settingsView.children;
  for (let i = 0; i < settingsSelectors.length; i++) {
    const settingSelector = settingsSelectors[i];
    settingSelector.style.fontSize = `${bounds.height * 0.04}px`;

  }

}

function layoutInstructionsView() {
  const bounds = new Bounds();
  bounds.getRect(gel('main-grid'));

  const instructionsView = gel('instructionsView');
  bounds.bound(instructionsView);
  instructionsView.style.padding = `${bounds.height * 0.1}px`;



}

function layoutCanvas() {
  const canvasContainerBounds = new Bounds(0, 0, window.innerWidth, window.innerHeight);
  canvasContainerBounds.bound(gel('canvasContainer'))
  canvasContainerBounds.bound(gel('canvasView'));
  
  const bounds = new Bounds();
  bounds.getRect(gel('advancedButton'));
  bounds.width /= 3;
  bounds.height /= 3;
  const tipCloud = gel('tipCloud');
  bounds.bound(tipCloud);
  tipCloud.style.opacity = 0.0;

}

function layoutFileSelector() {
  const bounds = new Bounds();
  bounds.getRect(gel('main-grid'));

  const fileSelector = gel('fileSelector');
  bounds.bound(fileSelector);
  fileSelector.style.padding = `${bounds.height * 0.1}px`;

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
      candidate.style.fontSize = `${Math.floor(candidateSize * 0.6)}px`
    }
  }
}

function layoutBlockCells(blockIndex, blockSize) {
  const cellSize = Math.floor((blockSize - 2.0) / 3.0);
  const locations = [0.0, cellSize + 1.0, (cellSize + 1.0) * 2.0];
  const blockRow = Math.floor(blockIndex / 3);
  const blockCol = blockIndex % 3;
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      const cellIndex = Math.floor((((blockRow * 3) + i) * 9) + ((blockCol * 3) + k));
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
      cell.style.fontSize = `${Math.floor(cellSize * 0.6)}px`

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

function layoutNumbersSelector(gridSize, cellSize, isLandscape) {
  const numbersSelector = gel('numbersSelector');
  const numberButtons = numbersSelector.children;
  for (let i = 0; i < numberButtons.length; i++) {
    const button = numberButtons[i];
    button.style.width = `${Math.floor(cellSize * 0.6)}px`;
    button.style.height = `${Math.floor(cellSize * 0.6)}px`;
    button.style.margin = `${Math.floor(cellSize * 0.05)}px`;
    button.style.fontSize = `${Math.floor(cellSize * 0.4)}px`;
  }

  const bounds = new Bounds();
  if (isLandscape) {
    bounds.setRect (cellSize + cellSize, 0, gridSize - 2 - cellSize - cellSize, cellSize);
  } else {
    bounds.setRect (cellSize, cellSize, gridSize - cellSize - cellSize, cellSize);
  }
  bounds.bound(numbersSelector);
}

function layoutCandidatesSelector(gridSize, cellSize, isLandscape) {

  const candidatesSelector = gel('candidatesSelector');
  const excludesSelector = gel('excludesSelector');
  const candidateButtons = candidatesSelector.children;
  const excludeButtons = excludesSelector.children;
  for (let i = 0; i < candidateButtons.length; i++) {
    const candidateButton = candidateButtons[i];
    candidateButton.style.width = `${Math.floor(cellSize * 0.6)}px`;
    candidateButton.style.height = `${Math.floor(cellSize * 0.6)}px`;
    candidateButton.style.margin = `${Math.floor(cellSize * 0.05)}px`;
    candidateButton.style.fontSize = `${Math.floor(cellSize * 0.4)}px`;

    const excludeButton = excludeButtons[i];
    excludeButton.style.width = `${Math.floor(cellSize * 0.6)}px`;
    excludeButton.style.height = `${Math.floor(cellSize * 0.6)}px`;
    excludeButton.style.margin = `${Math.floor(cellSize * 0.05)}px`;
    excludeButton.style.fontSize = `${Math.floor(cellSize * 0.4)}px`;
  }

  const bounds = new Bounds();
  if (isLandscape) {
    bounds.setRect (cellSize + cellSize, 0, gridSize - 2 - cellSize - cellSize, cellSize);
  } else {
    bounds.setRect (cellSize, cellSize, gridSize - cellSize - cellSize, cellSize);
  }
  bounds.bound(candidatesSelector);
  bounds.bound(excludesSelector);
}

function layoutAlerts(gridSize, cellSize, isLandscape) {
  const sz = Math.floor(cellSize * 0.2);

  const alertNoSelection = gel('alertNoSelection');
  alertNoSelection.style.fontSize = `${sz * 2}px`;

  const alertInvalid = gel('alertInvalid');
  gel('alertInvalidMessage').style.padding = `${sz}px 0 0 ${sz}px`;
  gel('alertInvalidMessage').style.fontSize = `${sz * 1.3}px`;
  gel('alertInvalidCheckContainer').style.padding = `0 ${sz / 2}px ${sz / 2}px 0`;
  gel('alertInvalidCheckLabel').style.fontSize = `${sz * 1.1}px`;
  gel('alertInvalidCheckBox').style.width = `${sz * 2}px`;
  gel('alertInvalidCheckBox').style.height = `${sz *2}px`;

  const bounds = new Bounds();
  if (isLandscape) {
    bounds.setRect (cellSize, 0, gridSize - 2, cellSize);
  } else {
    bounds.setRect (0, cellSize, gridSize, cellSize);
  }
  bounds.bound(alertNoSelection);
  bounds.bound(alertInvalid);
}

function layoutFilesPanel(gridSize, cellSize, isLandscape) {
  const fileController = gel('fileController');
  const fileControllerButtons = fileController.children;

  for (let i = 0; i < fileControllerButtons.length; i++) {
    const element = fileControllerButtons[i];
    element.style.width = `${Math.floor(cellSize * 0.8)}px`;
    element.style.height = `${Math.floor(cellSize * 0.8)}px`;
    element.style.margin = `${Math.floor(cellSize * 0.1)}px`;
    element.style.fontSize = `${Math.floor(cellSize * 0.2)}px`;
  }

  const bounds = new Bounds();

  if (isLandscape) {
    fileController.style.flexDirection = 'column';
    bounds.setRect (0, cellSize, cellSize, Math.floor((gridSize - 6.0) * 4.0 / 9.0));
    bounds.bound(fileController);
  } else {
    fileController.style.flexDirection = 'row';
    bounds.setRect(0, 0, Math.floor((gridSize - 6.0) * 4.0 / 9.0), cellSize);
    bounds.bound(fileController);
  }
}

function layoutTipsController(gridSize, cellSize, isLandscape) {
  const tipsController = gel('tipsController');
  const tipsControllerButtons = tipsController.children;

  for (let i = 0; i < tipsControllerButtons.length; i++) {
    const button = tipsControllerButtons[i];
    button.style.width = `${Math.floor(cellSize * 0.8)}px`;
    button.style.height = `${Math.floor(cellSize * 0.8)}px`;
    button.style.margin = `${Math.floor(cellSize * 0.1)}px`;
  }

  const bounds = new Bounds();

  if (isLandscape) {
    tipsController.style.flexDirection = 'column';
    bounds.setRect (cellSize + gridSize, cellSize, cellSize, Math.floor((gridSize - 6.0) / 3.0));
    bounds.bound(tipsController);
  } else {
    tipsController.style.flexDirection = 'row';
    bounds.setRect(Math.floor(((gridSize + 3.0) * 5.0 / 9.0)), 0, Math.floor((gridSize - 6.0) * 2.0 / 9.0), cellSize);
    bounds.bound(tipsController);
  }
}

function layoutSearchPanel(gridSize, cellSize, isLandscape) {
  const searchPanel = gel('searchPanel');
  const searchPanelButtons = searchPanel.children;

  for (let i = 0; i < searchPanelButtons.length; i++) {
    const button = searchPanelButtons[i];

    button.style.width = `${Math.floor(cellSize * 0.6)}px`;
    button.style.height = `${Math.floor(cellSize * 0.6)}px`;
    button.style.margin = `${Math.floor(cellSize * 0.05)}px`;
    button.style.fontSize = `${Math.floor(cellSize * 0.3)}px`;
    const padding = Math.floor(cellSize * 0.1);
    button.style.padding = `${padding}px ${padding}px 0 0`;
  }

  const bounds = new Bounds();

  if (isLandscape) {
    searchPanel.style.flexDirection = 'column';
    bounds.setRect (cellSize + gridSize + 1, cellSize, cellSize, gridSize);
    bounds.bound(searchPanel);
  } else {
    searchPanel.style.flexDirection = 'row';
    // bounds.setRect(cellSize + cellSize, 0, gridSize, cellSize);
    bounds.setRect (0, cellSize - 1, gridSize, cellSize);
    bounds.bound(searchPanel);
  }
}

function layoutSettingsPanel(gridSize, cellSize, isLandscape) {
  const settingsController = gel('settingsController');
  const settingsControllerButtons = settingsController.children;

  for (let i = 0; i < settingsControllerButtons.length; i++) {
    const button = settingsControllerButtons[i];
    button.style.width = `${Math.floor(cellSize * 0.8)}px`;
    button.style.height = `${Math.floor(cellSize * 0.8)}px`;
    button.style.margin = `${Math.floor(cellSize * 0.1)}px`;
  }

  const bounds = new Bounds();

  if (isLandscape) {
    settingsController.style.flexDirection = 'column';
    bounds.setRect (cellSize + gridSize, gridSize - cellSize, cellSize, cellSize * 2.0);
    bounds.bound(settingsController);
  } else {
    settingsController.style.flexDirection = 'row';
    bounds.setRect(Math.floor(((gridSize + 3.0) * 7.0 / 9.0)), 0, cellSize * 2.0, cellSize);
    bounds.bound(settingsController);
  }
}

function layoutInsertModeContainer(cellSize, isLandscape) {
  const insertModeContainer = gel('insertModeContainer');
  const insertModeButton = gel('insertModeButton');
  insertModeButton.style.width = `${Math.floor(cellSize * 0.6)}px`;
  insertModeButton.style.height = `${Math.floor(cellSize * 0.6)}px`;

  const bounds = new Bounds();

  if (isLandscape) {
    bounds.setRect (cellSize, 0, cellSize, cellSize);
    bounds.bound(insertModeContainer);
  } else {
    bounds.setRect (0, cellSize, cellSize, cellSize);
    bounds.bound(insertModeContainer);
  }
}

function layoutExcludeButtonContainer(gridSize, cellSize, isLandscape) {
  const excludeModeButtonContainer = gel('excludeModeButtonContainer');
  const excludeModeButton = gel('excludeModeButton');
  excludeModeButton.style.width = `${Math.floor(cellSize * 0.6)}px`;
  excludeModeButton.style.height = `${Math.floor(cellSize * 0.6)}px`;

  const bounds = new Bounds();

  if (isLandscape) {
    bounds.setRect (gridSize, 0, cellSize, cellSize);
    bounds.bound(excludeModeButtonContainer);
  } else {
    bounds.setRect (gridSize - cellSize, cellSize, cellSize, cellSize);
    bounds.bound(excludeModeButtonContainer);
  }
}

function layoutUndosController(gridSize, cellSize, isLandscape) {
  const undosController = gel('undosController');
  const undosControllerButtons = undosController.children;
  for (let i = 0; i < undosControllerButtons.length; i++) {
    const button = undosControllerButtons[i];
    button.style.width = `${Math.floor(cellSize * 0.8)}px`;
    button.style.height = `${Math.floor(cellSize * 0.8)}px`;
    button.style.margin = `${Math.floor(cellSize * 0.1)}px`;
  }

  const bounds = new Bounds();

  if (isLandscape) {
    bounds.setRect (cellSize, cellSize + gridSize, cellSize * 2, cellSize);
    bounds.bound(undosController);
  } else {
    bounds.setRect (0, cellSize + cellSize + gridSize, cellSize * 2, cellSize);
    bounds.bound(undosController);
  }
}

function layoutGameStatus(gridSize, cellSize, isLandscape) {
  const gameStatus = gel('gameStatus');
  const remainters = gel('remainters');
  remainters.style.width = `${Math.floor(cellSize * 0.8)}px`;
  remainters.style.height = `${Math.floor(cellSize * 0.8)}px`;
  remainters.style.margin = `${Math.floor(cellSize * 0.1)}px`;
  remainters.style.fontSize = `${cellSize * 0.18}px`;

  const bounds = new Bounds();

  if (isLandscape) {
    bounds.setRect (cellSize * 5, cellSize + gridSize, cellSize, cellSize);
    bounds.bound(gameStatus);
  } else {
    bounds.setRect (cellSize * 4, cellSize + cellSize + gridSize, cellSize, cellSize);
    bounds.bound(gameStatus);
  }
}

function layoutRestartController(gridSize, cellSize, isLandscape) {
  const restartController = gel('restartController');
  const restartControllerButtons = restartController.children;
  for (let i = 0; i < restartControllerButtons.length; i++) {
    const button = restartControllerButtons[i];
    button.style.width = `${Math.floor(cellSize * 0.8)}px`;
    button.style.height = `${Math.floor(cellSize * 0.8)}px`;
    button.style.margin = `${Math.floor(cellSize * 0.1)}px`;
  }

  const bounds = new Bounds();

  if (isLandscape) {
    bounds.setRect (gridSize, cellSize + gridSize, cellSize, cellSize);
    bounds.bound(restartController);
  } else {
    bounds.setRect (gridSize - cellSize, cellSize + cellSize + gridSize, cellSize, cellSize);
    bounds.bound(restartController);
  }
}

function layoutDebugBox(gridSize, cellSize, isLandscape) {
  const bounds = new Bounds();
  if (isLandscape) {
    bounds.setRect (cellSize * 3, cellSize + gridSize, cellSize * 6, cellSize);
    bounds.bound(gel('debugBox'));
    gel('debugBox').style.fontSize = `${Math.floor(cellSize * 0.2)}px`;
  } else {
    bounds.setRect (cellSize * 2, cellSize + cellSize  + gridSize, cellSize * 6, cellSize);
    bounds.bound(gel('debugBox'));
    gel('debugBox').style.fontSize = `${Math.floor(cellSize * 0.2)}px`;
  }
}

function layoutPanels(parentWidth, parentHeight, isLandscape) {
  const gridSize = isLandscape ? Math.floor(parentWidth * 9 / 11) : parentWidth;
  const cellSize = isLandscape ? Math.floor(parentWidth / 11) : Math.floor(parentHeight / 13);

  layoutAlerts(gridSize, cellSize, isLandscape);
  layoutNumbersSelector(gridSize, cellSize,isLandscape);
  layoutCandidatesSelector(gridSize, cellSize, isLandscape);
  layoutFilesPanel(gridSize, cellSize, isLandscape);
  layoutTipsController(gridSize, cellSize, isLandscape);
  layoutSearchPanel(gridSize, cellSize, isLandscape);
  layoutSettingsPanel(gridSize, cellSize, isLandscape);
  layoutInsertModeContainer(cellSize, isLandscape);
  layoutExcludeButtonContainer(gridSize, cellSize, isLandscape);
  layoutUndosController(gridSize, cellSize, isLandscape);
  layoutRestartController(gridSize, cellSize, isLandscape);
  layoutInstructionsView();
  layoutGameStatus(gridSize, cellSize, isLandscape);
  // layoutCanvas();
  hideCanvas();

  layoutDebugBox(gridSize, cellSize, isLandscape);
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
  layoutSettingsView();
}

function clickOnGame(e) {
  const bounds = new Bounds();
  bounds.getRect(gel('play-ground'));
  // const cellSize = (bounds.width - 6.0) / 9.0;
  // bounds.top -= cellSize;
  // bounds.height += cellSize;
  // bounds.width += cellSize;

  const onGame = bounds.contains(e.pageX, e.pageY);
  bounds.getRect(gel('undosController'));
  const onUndos = bounds.contains(e.pageX, e.pageY);

  return onGame || onUndos;
}

function clickOnGrid(e) {
  const bounds = new Bounds();
  bounds.getRect(gel('main-grid'));

  return bounds.contains(e.pageX, e.pageY);
}

function clickOnPlayground(e) {
  const bounds = new Bounds();
  bounds.getRect(gel('play-ground'));

  return bounds.contains(e.pageX, e.pageY);
}

function clickOnSelectors(e) {
  const bounds = new Bounds();
  bounds.getRect(gel('numbersSelector'));

  return bounds.contains(e.pageX, e.pageY);
}

function clickOnSearchPanel(e) {
  const bounds = new Bounds();
  bounds.getRect(gel('searchPanel'));

  const buttonbounds = new Bounds();
  buttonbounds.getRect(gel('searchButton'));

  return bounds.contains(e.pageX, e.pageY) || buttonbounds.contains(e.pageX, e.pageY);
}

function clickOnAllowMistakes(e) {
  const bounds = new Bounds();
  bounds.getRect(gel('alertInvalidCheckContainer'));

  return bounds.contains(e.pageX, e.pageY);
}

function clickOnAdvancedButton(e) {
  const bounds = new Bounds();
  bounds.getRect(gel('advancedButton'));

  return bounds.contains(e.pageX, e.pageY);
}

export {
  layout,
  clickOnGame,
  clickOnSelectors,
  clickOnGrid,
  clickOnPlayground,
  clickOnAllowMistakes,
  clickOnSearchPanel,
  clickOnAdvancedButton,
  layoutCanvas,
}
