import Q from 'q';
import JPEGEncoder from './jpeg';

import { execute } from './worker.js';


const to_arraybuffer = (blob) => {
  let d = Q.defer(),
      r = new FileReader();

  r.onloadend = () => {
    d.resolve(r.result);
  };

  r.readAsArrayBuffer(blob);
  return d.promise;
};



const mp4 = (arraybuffers) => {
  return execute('./scripts/thread.js', {
    type: 'command',
    arguments: [
      '-framerate', 3,
      '-i', 'frame%03d.jpg',
      '-r', 3,
      '-strict', 'experimental',
      '-pix_fmt', 'yuv420p',
      '-v', 'verbose',
      'output.mp4'
    ],
    files: arraybuffers.map((buffer, i) => {
      let n = i.toString();

      while(n.length < 3)
        n = '0' + n;

      return {
        data: new Uint8Array(buffer),
        name: `frame${n}.jpg`
      }
    })
  });
}


export const compile = (string, canvas, config) => {
  return Q()

    // prepare the input value
    .then(() => {
      return (
        string
          .split('')
          .reduce((prev, item) => prev.concat([item, false]), [])
      )
    })

    // encode each frame
    .then((chars) => {
      let encoder = new JPEGEncoder(60);

      return chars.map((char) => {
        canvas.render(char, config.mapping, config.spritesheet);
        let data = encoder.encode(canvas.getdata(), 60, true);

        return new Blob([data.buffer], { type: 'image/jpeg' })
      })
    })

    // convert blobs to array_buffer
    .then((blobs) => {
      let arraybuffers = [];

      return blobs.reduce((prev, blob) => {
        return to_arraybuffer(blob).then((buffer) => {
          arraybuffers.push(buffer);
        });
      }, Q())
      .then(() => { return arraybuffers; })
    })

    .then((arraybuffers) => mp4(arraybuffers))
}
