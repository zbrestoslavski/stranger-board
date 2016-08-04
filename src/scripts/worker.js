import Q from 'q';

export const execute = (script, message) => {
  let d = Q.defer(),
      w = new Worker(script);

  w.onmessage = function(e) {
    e = e.data;

    switch(e.type) {
      case 'ready':
        return w.postMessage(message);

      case 'stdout':
        return console.log(e.data);

      case 'done':
        return d.resolve(
          new Blob([e.data], {
          type: 'video/mp4'
          })
        );
    }
  }

  return d.promise;
};