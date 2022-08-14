const renderMessage = ({ messageType, message }, form, i18nInstance) => {
  const p = form.querySelector('.feedback');
  const input = form.querySelector('input');

  switch (messageType) {
    case 'success':
      input.classList.remove('is-invalid');
      p.classList.remove('text-danger');
      p.classList.add('text-success');
      break;

    case 'error':
      input.classList.add('is-invalid');
      p.classList.remove('text-success');
      p.classList.add('text-danger');
      break;

    default:
      throw new Error(`Unknown messageType: '${messageType}'!`);
  }

  switch (message) {
    case 'SuccessAdding':
      p.textContent = i18nInstance.t(`messages.${message}`);
      form.reset();
      input.focus();
      break;

    case 'invalidURL':
    case 'parseError':
    case 'duplicate':
    case 'downloadError':
    case 'Network Error':
    case 'required':
      p.textContent = i18nInstance.t(`messages.${message}`);
      break;

    default:
      throw new Error(`Unknown message: '${message}'!`);
  }
  form.append(p);
};

export { renderMessage };
