import {
  crel,
  doc,
  sat,
} from '../utils/shortHands.js';

function createAlertNoSelection() {
  const panel = crel('div');
  panel.id = 'alertNoSelection';
  panel.innerHTML = 'Select a Cell';
  panel.style.zIndex = "12"
  return panel;
}

function createAlertInvalid() {
  const panel = crel('div');
  panel.id = 'alertInvalid';
  panel.style.zIndex = "12"

  const messageLabel = crel('label');
  messageLabel.id = 'alertInvalidMessage';
  messageLabel.innerHTML = 'You have selected an invalid nubmer either for a row or a column or a block';

  const checkContainer = crel('div');
  checkContainer.id = 'alertInvalidCheckContainer';

  const checkLabel = crel('label');
  checkLabel.id = 'alertInvalidCheckLabel';
  checkLabel.innerHTML = 'Allow Mistakes';
  sat(checkLabel, 'for', 'alertInvalidCheckBox');
  doc(checkContainer, checkLabel);

  const checkBox = crel('input');
  sat(checkBox, 'type', 'checkbox');
  checkBox.id = 'alertInvalidCheckBox';
  checkBox.name = 'alertInvalidCheckBox';
  checkBox.className = 'custom-checkbox';
  doc(checkContainer, checkBox);


  doc(panel, messageLabel);
  doc(panel, checkContainer);
  
  

  return panel;
}

export {
  createAlertNoSelection,
  createAlertInvalid
};
