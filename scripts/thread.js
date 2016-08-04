importScripts('./ffmpeg.js?v=0.0.1');

var now = Date.now;

function getModule() {
  return {
    print: function (text) {
      postMessage({
        'type' : 'stdout',
        'data' : text
      });
    },
    printErr: function (text) {
      postMessage({
        'type' : 'stdout',
        'data' : text
      });
    }
  };
}

// http://stackoverflow.com/questions/9763441/milliseconds-to-time-in-javascript
function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return hrs + ':' + mins + ':' + secs + '.' + ms;
}

onmessage = function(event) {
  var message = event.data;

  if (message.type === "command") {

    postMessage({
      'type' : 'start',
    });
    if (message.files) {
      message.files.forEach(function(file) {
        postMessage({
          'type' : 'stdout',
          'data' : 'Received file ' + file.name + '.  Length: ' + file.data.length
        });
      })
    } else {
      postMessage({
        'type' : 'stdout',
        'data' : 'Received command (no file).'
      });
    }

    var outputFilePath = message.arguments[message.arguments.length - 1];
    if (message.arguments.length > 2 && outputFilePath && outputFilePath.indexOf(".") > -1) {
      message.arguments[message.arguments.length - 1] = "output/" + outputFilePath;
    }

    var Module = getModule();
    Module['files'] = message.files;
    Module['arguments'] = message.arguments;

    var time = now();
    postMessage({
      'type' : 'stdout',
      'data' : 'Received command: ' + message.arguments.join(" ")
    });

    var result = ffmpeg_run(Module);

    var totalTime = now() - time;
    postMessage({
      'type' : 'stdout',
      'data' : 'Finished processing (took ' + msToTime(totalTime) + ')'
    });

    var outputFileHandle = result && result.object.contents[outputFilePath];
    var buffer;

    if (outputFileHandle) {
      buffer = new Uint8Array(outputFileHandle.contents).buffer;
    }

    postMessage({
      'type' : 'done',
      'data' : buffer,
      'fileName' : outputFilePath
    });
  }
};

postMessage({
  'type' : 'ready'
});
