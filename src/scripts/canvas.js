import Q from 'q';

export const canvas  = document.querySelector('canvas');
export const context = canvas.getContext('2d');
export const ratio   = 1 / 2;

let background;
let spritesheet;

export const getdata = (x = 0, y = 0, w = NaN, h = NaN) => {
  if (isNaN(w))
    w = canvas.width;

  if (isNaN(h))
    h = canvas.height;

  return context.getImageData(x, y, w, h);
}

export const load = (...assets) => {
  return Q
    .all(
      assets.map(url => {
        let d = Q.defer(),
            i = new Image();

        i.onload  = () => { d.resolve(i); }
        i.src = url;

        return d.promise;
      })
    )
    .spread((b, s) => {
      background  = b;
      spritesheet = s;
    })
}

export const render = (expression = false, mapping = {}, sprites = {}, format = null) => {
  var d = Q.defer();

  // force the canvas
  canvas.width  = background.naturalWidth  * ratio;
  canvas.height = background.naturalHeight * ratio;
  context.scale(ratio, ratio);

  // draw background
  context.drawImage(background, 0, 0);

  if (expression in mapping)
    mapping[expression]
      .split('')
      .filter(char => (char in sprites))
      .forEach(char => {
        char = sprites[char];

        context.drawImage(spritesheet,
                          char.at.x, char.at.y, char.at.w, char.at.h,
                          char.to.x, char.to.y, char.at.w, char.at.h)
      });

  setImmediate(() => {
    d.resolve(canvas.toDataURL(format));
  });

  return d.promise;
}
