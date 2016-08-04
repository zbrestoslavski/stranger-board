const TICK = 1000/3;

let timer     = null,
    callback  = null;

export const ontick = (handler = function() {}) => {
  if (!(handler instanceof Function))
    handler = () => {};

  callback = handler;
}



export const play = (value = '') => {
  stop();

  // set internals
  let string = value.split('')
                    .reduce((prev, char) => prev.concat([char, false]), []);

  // define loop boundaries
  let i = 0, l = string.length;

  timer = setInterval(() => {
  if (callback instanceof Function)
    callback(string[i]);

    if (++i == l)
      i = 0;
  }, TICK)
}

export const stop = () => {
  clearInterval(timer);
}

