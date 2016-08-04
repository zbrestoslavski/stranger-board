import Q from 'q';

import { config } from '../config';

import * as canvas from './canvas';
import { getdata, load, render } from './canvas';

import { play, stop, ontick } from './loop';
import { getinput, oninput } from './input';

import { compile } from './compile';

// main website routine
load(config.background_url, config.spritesheet_url)
  .then(() => {
    document.querySelector('section').classList.add('visible');
    render();
  })
  .then(() => {
    // wire the loop to the render function
    ontick((char) => {
      render(char, config.mapping, config.spritesheet);
    });
  })
  .then(() => {
    // wire the input field to the loop
    oninput((string) => {
      play(string);
    })
  })



// conversion process
let processing = false;
document.querySelector('button')
  .onclick = () => {

    let input = getinput();

    if (!input.trim().length)
      return alert('no message typed!');

    if (processing)
      return alert('be patient!');

    document.querySelector('section').classList.add('processing');
    processing = true;


    compile(getinput(), canvas, config)
      .then((blob) => {
        let d = Q.defer();

        let data = new FormData();
            data.append('api_key', 'dc6zaTOxFJmzC');
            data.append('username', 'openbeta');
            data.append('file', blob, 'file.webm');

        let xhr = new XMLHttpRequest();

        xhr.onload = (e) => {
          if (xhr.status !== 200)
            return d.reject(xhr.response);

          d.resolve(JSON.parse(xhr.response));
        }

        xhr.open('post', 'https://upload.giphy.com/v1/gifs');
        xhr.send(data);

        return d.promise;
      })
      .then((response) => {
        if (!response.data || !response.data.id)
          return;

        window.open(
          `https://media.giphy.com/media/${response.data.id}/giphy.gif`
        );
      })
      .then(() => {
        document.querySelector('section').classList.remove('processing');
        processing = false;
      })



      .catch((error) => {
        console.log(error);
      })
  };
