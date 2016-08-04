const input = document.querySelector('input');

let callback = null;

export const oninput = (handler = function() {}) => {
  if (!(handler instanceof Function))
    handler = () => {};

  callback = handler;
}

export const getinput = () => { return `${input.value} ` };

input.oninput = () => {
  if (callback instanceof Function)
    callback(getinput());
}
