
function appAlert(title, text) {
  const backView = crel('div');
  backView.className = 'backView';
  doc(document.body, backView);
  backView.setAttribute('tabindex', '0');
  backView.addEventListener('keypress', e => {
    if (e.keyCode === 27) {
      hideView(backView);
    }
  });

  const alertPanel = crel('div');
  alertPanel.className = 'alertPanel';

  const alertTitle = crel('div');
  alertTitle.className = 'alertTitle';
  alertTitle.textContent = title;

  const alertText = crel('div');
  alertText.className = 'alertText';
  alertText.textContent = text;

  const okAlertButton = crel('div');
  okAlertButton.className = 'okAlertButton';
  okAlertButton.textContent = 'OK';
  okAlertButton.addEventListener('click', () => {
    hideView(backView);
  });

  doc(alertPanel, alertTitle);
  doc(alertPanel, alertText);
  doc(alertPanel, okAlertButton);
  doc(backView, alertPanel);
  opac(backView);
}

function appConfirm(callBack, args, title, text) {
  const backView = crel('div');
  backView.className = 'backView';
  doc(document.body, backView);
  backView.setAttribute('tabindex', '0');
  backView.addEventListener('keypress', e => {
    if (e.keyCode === 27) {
      hideView(backView);
    }
  });

  const alertPanel = crel('div');
  alertPanel.className = 'alertPanel';

  const alertTitle = crel('div');
  alertTitle.className = 'alertTitle';
  alertTitle.textContent = title;

  const alertText = crel('div');
  alertText.className = 'alertText';
  alertText.textContent = text;

  const confirmButtons = crel('div');
  confirmButtons.className = 'confirmButtons';

  const yesButton = crel('div');
  yesButton.className = 'okAlertButton';
  yesButton.textContent = 'Yes';
  yesButton.addEventListener('click', () => {
    callBack(args);
    hideView(backView);
  });

  const noButton = crel('div');
  noButton.className = 'okAlertButton';
  noButton.textContent = 'No';
  noButton.addEventListener('click', () => {
    hideView(backView);
  });

  const okAlertButton = crel('div');
  okAlertButton.className = 'okAlertButton';
  okAlertButton.textContent = 'YES';
  okAlertButton.addEventListener('click', () => {
    callBack(args);
    hideView(backView);
  });

  doc(confirmButtons, yesButton);
  doc(confirmButtons, noButton);

  doc(alertPanel, alertTitle);
  doc(alertPanel, alertText);
  doc(alertPanel, confirmButtons);
  doc(backView, alertPanel);
  opac(backView);
}

export {
  appAlert,
  appConfirm,
};
