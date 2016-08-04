/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _q = __webpack_require__(1);

	var _q2 = _interopRequireDefault(_q);

	var _config = __webpack_require__(4);

	var _canvas = __webpack_require__(5);

	var canvas = _interopRequireWildcard(_canvas);

	var _loop = __webpack_require__(6);

	var _input = __webpack_require__(7);

	var _compile = __webpack_require__(8);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// main website routine
	(0, _canvas.load)(_config.config.background_url, _config.config.spritesheet_url).then(function () {
	  document.querySelector('section').classList.add('visible');
	  (0, _canvas.render)();
	}).then(function () {
	  // wire the loop to the render function
	  (0, _loop.ontick)(function (char) {
	    (0, _canvas.render)(char, _config.config.mapping, _config.config.spritesheet);
	  });
	}).then(function () {
	  // wire the input field to the loop
	  (0, _input.oninput)(function (string) {
	    (0, _loop.play)(string);
	  });
	});

	// conversion process
	var processing = false;
	document.querySelector('button').onclick = function () {

	  var input = (0, _input.getinput)();

	  if (!input.trim().length) return alert('no message typed!');

	  if (processing) return alert('be patient!');

	  document.querySelector('section').classList.add('processing');
	  processing = true;

	  (0, _compile.compile)((0, _input.getinput)(), canvas, _config.config).then(function (blob) {
	    var d = _q2.default.defer();

	    var data = new FormData();
	    data.append('api_key', 'dc6zaTOxFJmzC');
	    data.append('username', 'openbeta');
	    data.append('file', blob, 'file.webm');

	    var xhr = new XMLHttpRequest();

	    xhr.onload = function (e) {
	      if (xhr.status !== 200) return d.reject(xhr.response);

	      d.resolve(JSON.parse(xhr.response));
	    };

	    xhr.open('post', 'https://upload.giphy.com/v1/gifs');
	    xhr.send(data);

	    return d.promise;
	  }).then(function (response) {
	    if (!response.data || !response.data.id) return;

	    window.open('https://media.giphy.com/media/' + response.data.id + '/giphy.gif');
	  }).then(function () {
	    document.querySelector('section').classList.remove('processing');
	    processing = false;
	  }).catch(function (error) {
	    console.log(error);
	  });
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// vim:ts=4:sts=4:sw=4:
	/*!
	 *
	 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
	 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
	 *
	 * With parts by Tyler Close
	 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
	 * at http://www.opensource.org/licenses/mit-license.html
	 * Forked at ref_send.js version: 2009-05-11
	 *
	 * With parts by Mark Miller
	 * Copyright (C) 2011 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 */

	(function (definition) {
	    "use strict";

	    // This file will function properly as a <script> tag, or a module
	    // using CommonJS and NodeJS or RequireJS module formats.  In
	    // Common/Node/RequireJS, the module exports the Q API and when
	    // executed as a simple <script>, it creates a Q global instead.

	    // Montage Require
	    if (typeof bootstrap === "function") {
	        bootstrap("promise", definition);

	    // CommonJS
	    } else if (true) {
	        module.exports = definition();

	    // RequireJS
	    } else if (typeof define === "function" && define.amd) {
	        define(definition);

	    // SES (Secure EcmaScript)
	    } else if (typeof ses !== "undefined") {
	        if (!ses.ok()) {
	            return;
	        } else {
	            ses.makeQ = definition;
	        }

	    // <script>
	    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
	        // Prefer window over self for add-on scripts. Use self for
	        // non-windowed contexts.
	        var global = typeof window !== "undefined" ? window : self;

	        // Get the `window` object, save the previous Q global
	        // and initialize Q as a global.
	        var previousQ = global.Q;
	        global.Q = definition();

	        // Add a noConflict function so Q can be removed from the
	        // global namespace.
	        global.Q.noConflict = function () {
	            global.Q = previousQ;
	            return this;
	        };

	    } else {
	        throw new Error("This environment was not anticipated by Q. Please file a bug.");
	    }

	})(function () {
	"use strict";

	var hasStacks = false;
	try {
	    throw new Error();
	} catch (e) {
	    hasStacks = !!e.stack;
	}

	// All code after this point will be filtered from stack traces reported
	// by Q.
	var qStartingLine = captureLine();
	var qFileName;

	// shims

	// used for fallback in "allResolved"
	var noop = function () {};

	// Use the fastest possible means to execute a task in a future turn
	// of the event loop.
	var nextTick =(function () {
	    // linked list of tasks (single, with head node)
	    var head = {task: void 0, next: null};
	    var tail = head;
	    var flushing = false;
	    var requestTick = void 0;
	    var isNodeJS = false;
	    // queue for late tasks, used by unhandled rejection tracking
	    var laterQueue = [];

	    function flush() {
	        /* jshint loopfunc: true */
	        var task, domain;

	        while (head.next) {
	            head = head.next;
	            task = head.task;
	            head.task = void 0;
	            domain = head.domain;

	            if (domain) {
	                head.domain = void 0;
	                domain.enter();
	            }
	            runSingle(task, domain);

	        }
	        while (laterQueue.length) {
	            task = laterQueue.pop();
	            runSingle(task);
	        }
	        flushing = false;
	    }
	    // runs a single function in the async queue
	    function runSingle(task, domain) {
	        try {
	            task();

	        } catch (e) {
	            if (isNodeJS) {
	                // In node, uncaught exceptions are considered fatal errors.
	                // Re-throw them synchronously to interrupt flushing!

	                // Ensure continuation if the uncaught exception is suppressed
	                // listening "uncaughtException" events (as domains does).
	                // Continue in next event to avoid tick recursion.
	                if (domain) {
	                    domain.exit();
	                }
	                setTimeout(flush, 0);
	                if (domain) {
	                    domain.enter();
	                }

	                throw e;

	            } else {
	                // In browsers, uncaught exceptions are not fatal.
	                // Re-throw them asynchronously to avoid slow-downs.
	                setTimeout(function () {
	                    throw e;
	                }, 0);
	            }
	        }

	        if (domain) {
	            domain.exit();
	        }
	    }

	    nextTick = function (task) {
	        tail = tail.next = {
	            task: task,
	            domain: isNodeJS && process.domain,
	            next: null
	        };

	        if (!flushing) {
	            flushing = true;
	            requestTick();
	        }
	    };

	    if (typeof process === "object" &&
	        process.toString() === "[object process]" && process.nextTick) {
	        // Ensure Q is in a real Node environment, with a `process.nextTick`.
	        // To see through fake Node environments:
	        // * Mocha test runner - exposes a `process` global without a `nextTick`
	        // * Browserify - exposes a `process.nexTick` function that uses
	        //   `setTimeout`. In this case `setImmediate` is preferred because
	        //    it is faster. Browserify's `process.toString()` yields
	        //   "[object Object]", while in a real Node environment
	        //   `process.nextTick()` yields "[object process]".
	        isNodeJS = true;

	        requestTick = function () {
	            process.nextTick(flush);
	        };

	    } else if (typeof setImmediate === "function") {
	        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
	        if (typeof window !== "undefined") {
	            requestTick = setImmediate.bind(window, flush);
	        } else {
	            requestTick = function () {
	                setImmediate(flush);
	            };
	        }

	    } else if (typeof MessageChannel !== "undefined") {
	        // modern browsers
	        // http://www.nonblocking.io/2011/06/windownexttick.html
	        var channel = new MessageChannel();
	        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
	        // working message ports the first time a page loads.
	        channel.port1.onmessage = function () {
	            requestTick = requestPortTick;
	            channel.port1.onmessage = flush;
	            flush();
	        };
	        var requestPortTick = function () {
	            // Opera requires us to provide a message payload, regardless of
	            // whether we use it.
	            channel.port2.postMessage(0);
	        };
	        requestTick = function () {
	            setTimeout(flush, 0);
	            requestPortTick();
	        };

	    } else {
	        // old browsers
	        requestTick = function () {
	            setTimeout(flush, 0);
	        };
	    }
	    // runs a task after all other tasks have been run
	    // this is useful for unhandled rejection tracking that needs to happen
	    // after all `then`d tasks have been run.
	    nextTick.runAfter = function (task) {
	        laterQueue.push(task);
	        if (!flushing) {
	            flushing = true;
	            requestTick();
	        }
	    };
	    return nextTick;
	})();

	// Attempt to make generics safe in the face of downstream
	// modifications.
	// There is no situation where this is necessary.
	// If you need a security guarantee, these primordials need to be
	// deeply frozen anyway, and if you don’t need a security guarantee,
	// this is just plain paranoid.
	// However, this **might** have the nice side-effect of reducing the size of
	// the minified code by reducing x.call() to merely x()
	// See Mark Miller’s explanation of what this does.
	// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
	var call = Function.call;
	function uncurryThis(f) {
	    return function () {
	        return call.apply(f, arguments);
	    };
	}
	// This is equivalent, but slower:
	// uncurryThis = Function_bind.bind(Function_bind.call);
	// http://jsperf.com/uncurrythis

	var array_slice = uncurryThis(Array.prototype.slice);

	var array_reduce = uncurryThis(
	    Array.prototype.reduce || function (callback, basis) {
	        var index = 0,
	            length = this.length;
	        // concerning the initial value, if one is not provided
	        if (arguments.length === 1) {
	            // seek to the first value in the array, accounting
	            // for the possibility that is is a sparse array
	            do {
	                if (index in this) {
	                    basis = this[index++];
	                    break;
	                }
	                if (++index >= length) {
	                    throw new TypeError();
	                }
	            } while (1);
	        }
	        // reduce
	        for (; index < length; index++) {
	            // account for the possibility that the array is sparse
	            if (index in this) {
	                basis = callback(basis, this[index], index);
	            }
	        }
	        return basis;
	    }
	);

	var array_indexOf = uncurryThis(
	    Array.prototype.indexOf || function (value) {
	        // not a very good shim, but good enough for our one use of it
	        for (var i = 0; i < this.length; i++) {
	            if (this[i] === value) {
	                return i;
	            }
	        }
	        return -1;
	    }
	);

	var array_map = uncurryThis(
	    Array.prototype.map || function (callback, thisp) {
	        var self = this;
	        var collect = [];
	        array_reduce(self, function (undefined, value, index) {
	            collect.push(callback.call(thisp, value, index, self));
	        }, void 0);
	        return collect;
	    }
	);

	var object_create = Object.create || function (prototype) {
	    function Type() { }
	    Type.prototype = prototype;
	    return new Type();
	};

	var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

	var object_keys = Object.keys || function (object) {
	    var keys = [];
	    for (var key in object) {
	        if (object_hasOwnProperty(object, key)) {
	            keys.push(key);
	        }
	    }
	    return keys;
	};

	var object_toString = uncurryThis(Object.prototype.toString);

	function isObject(value) {
	    return value === Object(value);
	}

	// generator related shims

	// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
	function isStopIteration(exception) {
	    return (
	        object_toString(exception) === "[object StopIteration]" ||
	        exception instanceof QReturnValue
	    );
	}

	// FIXME: Remove this helper and Q.return once ES6 generators are in
	// SpiderMonkey.
	var QReturnValue;
	if (typeof ReturnValue !== "undefined") {
	    QReturnValue = ReturnValue;
	} else {
	    QReturnValue = function (value) {
	        this.value = value;
	    };
	}

	// long stack traces

	var STACK_JUMP_SEPARATOR = "From previous event:";

	function makeStackTraceLong(error, promise) {
	    // If possible, transform the error stack trace by removing Node and Q
	    // cruft, then concatenating with the stack trace of `promise`. See #57.
	    if (hasStacks &&
	        promise.stack &&
	        typeof error === "object" &&
	        error !== null &&
	        error.stack &&
	        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
	    ) {
	        var stacks = [];
	        for (var p = promise; !!p; p = p.source) {
	            if (p.stack) {
	                stacks.unshift(p.stack);
	            }
	        }
	        stacks.unshift(error.stack);

	        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
	        error.stack = filterStackString(concatedStacks);
	    }
	}

	function filterStackString(stackString) {
	    var lines = stackString.split("\n");
	    var desiredLines = [];
	    for (var i = 0; i < lines.length; ++i) {
	        var line = lines[i];

	        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
	            desiredLines.push(line);
	        }
	    }
	    return desiredLines.join("\n");
	}

	function isNodeFrame(stackLine) {
	    return stackLine.indexOf("(module.js:") !== -1 ||
	           stackLine.indexOf("(node.js:") !== -1;
	}

	function getFileNameAndLineNumber(stackLine) {
	    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
	    // In IE10 function name can have spaces ("Anonymous function") O_o
	    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
	    if (attempt1) {
	        return [attempt1[1], Number(attempt1[2])];
	    }

	    // Anonymous functions: "at filename:lineNumber:columnNumber"
	    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
	    if (attempt2) {
	        return [attempt2[1], Number(attempt2[2])];
	    }

	    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
	    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
	    if (attempt3) {
	        return [attempt3[1], Number(attempt3[2])];
	    }
	}

	function isInternalFrame(stackLine) {
	    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

	    if (!fileNameAndLineNumber) {
	        return false;
	    }

	    var fileName = fileNameAndLineNumber[0];
	    var lineNumber = fileNameAndLineNumber[1];

	    return fileName === qFileName &&
	        lineNumber >= qStartingLine &&
	        lineNumber <= qEndingLine;
	}

	// discover own file name and line number range for filtering stack
	// traces
	function captureLine() {
	    if (!hasStacks) {
	        return;
	    }

	    try {
	        throw new Error();
	    } catch (e) {
	        var lines = e.stack.split("\n");
	        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
	        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
	        if (!fileNameAndLineNumber) {
	            return;
	        }

	        qFileName = fileNameAndLineNumber[0];
	        return fileNameAndLineNumber[1];
	    }
	}

	function deprecate(callback, name, alternative) {
	    return function () {
	        if (typeof console !== "undefined" &&
	            typeof console.warn === "function") {
	            console.warn(name + " is deprecated, use " + alternative +
	                         " instead.", new Error("").stack);
	        }
	        return callback.apply(callback, arguments);
	    };
	}

	// end of shims
	// beginning of real work

	/**
	 * Constructs a promise for an immediate reference, passes promises through, or
	 * coerces promises from different systems.
	 * @param value immediate reference or promise
	 */
	function Q(value) {
	    // If the object is already a Promise, return it directly.  This enables
	    // the resolve function to both be used to created references from objects,
	    // but to tolerably coerce non-promises to promises.
	    if (value instanceof Promise) {
	        return value;
	    }

	    // assimilate thenables
	    if (isPromiseAlike(value)) {
	        return coerce(value);
	    } else {
	        return fulfill(value);
	    }
	}
	Q.resolve = Q;

	/**
	 * Performs a task in a future turn of the event loop.
	 * @param {Function} task
	 */
	Q.nextTick = nextTick;

	/**
	 * Controls whether or not long stack traces will be on
	 */
	Q.longStackSupport = false;

	// enable long stacks if Q_DEBUG is set
	if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
	    Q.longStackSupport = true;
	}

	/**
	 * Constructs a {promise, resolve, reject} object.
	 *
	 * `resolve` is a callback to invoke with a more resolved value for the
	 * promise. To fulfill the promise, invoke `resolve` with any value that is
	 * not a thenable. To reject the promise, invoke `resolve` with a rejected
	 * thenable, or invoke `reject` with the reason directly. To resolve the
	 * promise to another thenable, thus putting it in the same state, invoke
	 * `resolve` with that other thenable.
	 */
	Q.defer = defer;
	function defer() {
	    // if "messages" is an "Array", that indicates that the promise has not yet
	    // been resolved.  If it is "undefined", it has been resolved.  Each
	    // element of the messages array is itself an array of complete arguments to
	    // forward to the resolved promise.  We coerce the resolution value to a
	    // promise using the `resolve` function because it handles both fully
	    // non-thenable values and other thenables gracefully.
	    var messages = [], progressListeners = [], resolvedPromise;

	    var deferred = object_create(defer.prototype);
	    var promise = object_create(Promise.prototype);

	    promise.promiseDispatch = function (resolve, op, operands) {
	        var args = array_slice(arguments);
	        if (messages) {
	            messages.push(args);
	            if (op === "when" && operands[1]) { // progress operand
	                progressListeners.push(operands[1]);
	            }
	        } else {
	            Q.nextTick(function () {
	                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
	            });
	        }
	    };

	    // XXX deprecated
	    promise.valueOf = function () {
	        if (messages) {
	            return promise;
	        }
	        var nearerValue = nearer(resolvedPromise);
	        if (isPromise(nearerValue)) {
	            resolvedPromise = nearerValue; // shorten chain
	        }
	        return nearerValue;
	    };

	    promise.inspect = function () {
	        if (!resolvedPromise) {
	            return { state: "pending" };
	        }
	        return resolvedPromise.inspect();
	    };

	    if (Q.longStackSupport && hasStacks) {
	        try {
	            throw new Error();
	        } catch (e) {
	            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
	            // accessor around; that causes memory leaks as per GH-111. Just
	            // reify the stack trace as a string ASAP.
	            //
	            // At the same time, cut off the first line; it's always just
	            // "[object Promise]\n", as per the `toString`.
	            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
	        }
	    }

	    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
	    // consolidating them into `become`, since otherwise we'd create new
	    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

	    function become(newPromise) {
	        resolvedPromise = newPromise;
	        promise.source = newPromise;

	        array_reduce(messages, function (undefined, message) {
	            Q.nextTick(function () {
	                newPromise.promiseDispatch.apply(newPromise, message);
	            });
	        }, void 0);

	        messages = void 0;
	        progressListeners = void 0;
	    }

	    deferred.promise = promise;
	    deferred.resolve = function (value) {
	        if (resolvedPromise) {
	            return;
	        }

	        become(Q(value));
	    };

	    deferred.fulfill = function (value) {
	        if (resolvedPromise) {
	            return;
	        }

	        become(fulfill(value));
	    };
	    deferred.reject = function (reason) {
	        if (resolvedPromise) {
	            return;
	        }

	        become(reject(reason));
	    };
	    deferred.notify = function (progress) {
	        if (resolvedPromise) {
	            return;
	        }

	        array_reduce(progressListeners, function (undefined, progressListener) {
	            Q.nextTick(function () {
	                progressListener(progress);
	            });
	        }, void 0);
	    };

	    return deferred;
	}

	/**
	 * Creates a Node-style callback that will resolve or reject the deferred
	 * promise.
	 * @returns a nodeback
	 */
	defer.prototype.makeNodeResolver = function () {
	    var self = this;
	    return function (error, value) {
	        if (error) {
	            self.reject(error);
	        } else if (arguments.length > 2) {
	            self.resolve(array_slice(arguments, 1));
	        } else {
	            self.resolve(value);
	        }
	    };
	};

	/**
	 * @param resolver {Function} a function that returns nothing and accepts
	 * the resolve, reject, and notify functions for a deferred.
	 * @returns a promise that may be resolved with the given resolve and reject
	 * functions, or rejected by a thrown exception in resolver
	 */
	Q.Promise = promise; // ES6
	Q.promise = promise;
	function promise(resolver) {
	    if (typeof resolver !== "function") {
	        throw new TypeError("resolver must be a function.");
	    }
	    var deferred = defer();
	    try {
	        resolver(deferred.resolve, deferred.reject, deferred.notify);
	    } catch (reason) {
	        deferred.reject(reason);
	    }
	    return deferred.promise;
	}

	promise.race = race; // ES6
	promise.all = all; // ES6
	promise.reject = reject; // ES6
	promise.resolve = Q; // ES6

	// XXX experimental.  This method is a way to denote that a local value is
	// serializable and should be immediately dispatched to a remote upon request,
	// instead of passing a reference.
	Q.passByCopy = function (object) {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return object;
	};

	Promise.prototype.passByCopy = function () {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return this;
	};

	/**
	 * If two promises eventually fulfill to the same value, promises that value,
	 * but otherwise rejects.
	 * @param x {Any*}
	 * @param y {Any*}
	 * @returns {Any*} a promise for x and y if they are the same, but a rejection
	 * otherwise.
	 *
	 */
	Q.join = function (x, y) {
	    return Q(x).join(y);
	};

	Promise.prototype.join = function (that) {
	    return Q([this, that]).spread(function (x, y) {
	        if (x === y) {
	            // TODO: "===" should be Object.is or equiv
	            return x;
	        } else {
	            throw new Error("Can't join: not the same: " + x + " " + y);
	        }
	    });
	};

	/**
	 * Returns a promise for the first of an array of promises to become settled.
	 * @param answers {Array[Any*]} promises to race
	 * @returns {Any*} the first promise to be settled
	 */
	Q.race = race;
	function race(answerPs) {
	    return promise(function (resolve, reject) {
	        // Switch to this once we can assume at least ES5
	        // answerPs.forEach(function (answerP) {
	        //     Q(answerP).then(resolve, reject);
	        // });
	        // Use this in the meantime
	        for (var i = 0, len = answerPs.length; i < len; i++) {
	            Q(answerPs[i]).then(resolve, reject);
	        }
	    });
	}

	Promise.prototype.race = function () {
	    return this.then(Q.race);
	};

	/**
	 * Constructs a Promise with a promise descriptor object and optional fallback
	 * function.  The descriptor contains methods like when(rejected), get(name),
	 * set(name, value), post(name, args), and delete(name), which all
	 * return either a value, a promise for a value, or a rejection.  The fallback
	 * accepts the operation name, a resolver, and any further arguments that would
	 * have been forwarded to the appropriate method above had a method been
	 * provided with the proper name.  The API makes no guarantees about the nature
	 * of the returned object, apart from that it is usable whereever promises are
	 * bought and sold.
	 */
	Q.makePromise = Promise;
	function Promise(descriptor, fallback, inspect) {
	    if (fallback === void 0) {
	        fallback = function (op) {
	            return reject(new Error(
	                "Promise does not support operation: " + op
	            ));
	        };
	    }
	    if (inspect === void 0) {
	        inspect = function () {
	            return {state: "unknown"};
	        };
	    }

	    var promise = object_create(Promise.prototype);

	    promise.promiseDispatch = function (resolve, op, args) {
	        var result;
	        try {
	            if (descriptor[op]) {
	                result = descriptor[op].apply(promise, args);
	            } else {
	                result = fallback.call(promise, op, args);
	            }
	        } catch (exception) {
	            result = reject(exception);
	        }
	        if (resolve) {
	            resolve(result);
	        }
	    };

	    promise.inspect = inspect;

	    // XXX deprecated `valueOf` and `exception` support
	    if (inspect) {
	        var inspected = inspect();
	        if (inspected.state === "rejected") {
	            promise.exception = inspected.reason;
	        }

	        promise.valueOf = function () {
	            var inspected = inspect();
	            if (inspected.state === "pending" ||
	                inspected.state === "rejected") {
	                return promise;
	            }
	            return inspected.value;
	        };
	    }

	    return promise;
	}

	Promise.prototype.toString = function () {
	    return "[object Promise]";
	};

	Promise.prototype.then = function (fulfilled, rejected, progressed) {
	    var self = this;
	    var deferred = defer();
	    var done = false;   // ensure the untrusted promise makes at most a
	                        // single call to one of the callbacks

	    function _fulfilled(value) {
	        try {
	            return typeof fulfilled === "function" ? fulfilled(value) : value;
	        } catch (exception) {
	            return reject(exception);
	        }
	    }

	    function _rejected(exception) {
	        if (typeof rejected === "function") {
	            makeStackTraceLong(exception, self);
	            try {
	                return rejected(exception);
	            } catch (newException) {
	                return reject(newException);
	            }
	        }
	        return reject(exception);
	    }

	    function _progressed(value) {
	        return typeof progressed === "function" ? progressed(value) : value;
	    }

	    Q.nextTick(function () {
	        self.promiseDispatch(function (value) {
	            if (done) {
	                return;
	            }
	            done = true;

	            deferred.resolve(_fulfilled(value));
	        }, "when", [function (exception) {
	            if (done) {
	                return;
	            }
	            done = true;

	            deferred.resolve(_rejected(exception));
	        }]);
	    });

	    // Progress propagator need to be attached in the current tick.
	    self.promiseDispatch(void 0, "when", [void 0, function (value) {
	        var newValue;
	        var threw = false;
	        try {
	            newValue = _progressed(value);
	        } catch (e) {
	            threw = true;
	            if (Q.onerror) {
	                Q.onerror(e);
	            } else {
	                throw e;
	            }
	        }

	        if (!threw) {
	            deferred.notify(newValue);
	        }
	    }]);

	    return deferred.promise;
	};

	Q.tap = function (promise, callback) {
	    return Q(promise).tap(callback);
	};

	/**
	 * Works almost like "finally", but not called for rejections.
	 * Original resolution value is passed through callback unaffected.
	 * Callback may return a promise that will be awaited for.
	 * @param {Function} callback
	 * @returns {Q.Promise}
	 * @example
	 * doSomething()
	 *   .then(...)
	 *   .tap(console.log)
	 *   .then(...);
	 */
	Promise.prototype.tap = function (callback) {
	    callback = Q(callback);

	    return this.then(function (value) {
	        return callback.fcall(value).thenResolve(value);
	    });
	};

	/**
	 * Registers an observer on a promise.
	 *
	 * Guarantees:
	 *
	 * 1. that fulfilled and rejected will be called only once.
	 * 2. that either the fulfilled callback or the rejected callback will be
	 *    called, but not both.
	 * 3. that fulfilled and rejected will not be called in this turn.
	 *
	 * @param value      promise or immediate reference to observe
	 * @param fulfilled  function to be called with the fulfilled value
	 * @param rejected   function to be called with the rejection exception
	 * @param progressed function to be called on any progress notifications
	 * @return promise for the return value from the invoked callback
	 */
	Q.when = when;
	function when(value, fulfilled, rejected, progressed) {
	    return Q(value).then(fulfilled, rejected, progressed);
	}

	Promise.prototype.thenResolve = function (value) {
	    return this.then(function () { return value; });
	};

	Q.thenResolve = function (promise, value) {
	    return Q(promise).thenResolve(value);
	};

	Promise.prototype.thenReject = function (reason) {
	    return this.then(function () { throw reason; });
	};

	Q.thenReject = function (promise, reason) {
	    return Q(promise).thenReject(reason);
	};

	/**
	 * If an object is not a promise, it is as "near" as possible.
	 * If a promise is rejected, it is as "near" as possible too.
	 * If it’s a fulfilled promise, the fulfillment value is nearer.
	 * If it’s a deferred promise and the deferred has been resolved, the
	 * resolution is "nearer".
	 * @param object
	 * @returns most resolved (nearest) form of the object
	 */

	// XXX should we re-do this?
	Q.nearer = nearer;
	function nearer(value) {
	    if (isPromise(value)) {
	        var inspected = value.inspect();
	        if (inspected.state === "fulfilled") {
	            return inspected.value;
	        }
	    }
	    return value;
	}

	/**
	 * @returns whether the given object is a promise.
	 * Otherwise it is a fulfilled value.
	 */
	Q.isPromise = isPromise;
	function isPromise(object) {
	    return object instanceof Promise;
	}

	Q.isPromiseAlike = isPromiseAlike;
	function isPromiseAlike(object) {
	    return isObject(object) && typeof object.then === "function";
	}

	/**
	 * @returns whether the given object is a pending promise, meaning not
	 * fulfilled or rejected.
	 */
	Q.isPending = isPending;
	function isPending(object) {
	    return isPromise(object) && object.inspect().state === "pending";
	}

	Promise.prototype.isPending = function () {
	    return this.inspect().state === "pending";
	};

	/**
	 * @returns whether the given object is a value or fulfilled
	 * promise.
	 */
	Q.isFulfilled = isFulfilled;
	function isFulfilled(object) {
	    return !isPromise(object) || object.inspect().state === "fulfilled";
	}

	Promise.prototype.isFulfilled = function () {
	    return this.inspect().state === "fulfilled";
	};

	/**
	 * @returns whether the given object is a rejected promise.
	 */
	Q.isRejected = isRejected;
	function isRejected(object) {
	    return isPromise(object) && object.inspect().state === "rejected";
	}

	Promise.prototype.isRejected = function () {
	    return this.inspect().state === "rejected";
	};

	//// BEGIN UNHANDLED REJECTION TRACKING

	// This promise library consumes exceptions thrown in handlers so they can be
	// handled by a subsequent promise.  The exceptions get added to this array when
	// they are created, and removed when they are handled.  Note that in ES6 or
	// shimmed environments, this would naturally be a `Set`.
	var unhandledReasons = [];
	var unhandledRejections = [];
	var reportedUnhandledRejections = [];
	var trackUnhandledRejections = true;

	function resetUnhandledRejections() {
	    unhandledReasons.length = 0;
	    unhandledRejections.length = 0;

	    if (!trackUnhandledRejections) {
	        trackUnhandledRejections = true;
	    }
	}

	function trackRejection(promise, reason) {
	    if (!trackUnhandledRejections) {
	        return;
	    }
	    if (typeof process === "object" && typeof process.emit === "function") {
	        Q.nextTick.runAfter(function () {
	            if (array_indexOf(unhandledRejections, promise) !== -1) {
	                process.emit("unhandledRejection", reason, promise);
	                reportedUnhandledRejections.push(promise);
	            }
	        });
	    }

	    unhandledRejections.push(promise);
	    if (reason && typeof reason.stack !== "undefined") {
	        unhandledReasons.push(reason.stack);
	    } else {
	        unhandledReasons.push("(no stack) " + reason);
	    }
	}

	function untrackRejection(promise) {
	    if (!trackUnhandledRejections) {
	        return;
	    }

	    var at = array_indexOf(unhandledRejections, promise);
	    if (at !== -1) {
	        if (typeof process === "object" && typeof process.emit === "function") {
	            Q.nextTick.runAfter(function () {
	                var atReport = array_indexOf(reportedUnhandledRejections, promise);
	                if (atReport !== -1) {
	                    process.emit("rejectionHandled", unhandledReasons[at], promise);
	                    reportedUnhandledRejections.splice(atReport, 1);
	                }
	            });
	        }
	        unhandledRejections.splice(at, 1);
	        unhandledReasons.splice(at, 1);
	    }
	}

	Q.resetUnhandledRejections = resetUnhandledRejections;

	Q.getUnhandledReasons = function () {
	    // Make a copy so that consumers can't interfere with our internal state.
	    return unhandledReasons.slice();
	};

	Q.stopUnhandledRejectionTracking = function () {
	    resetUnhandledRejections();
	    trackUnhandledRejections = false;
	};

	resetUnhandledRejections();

	//// END UNHANDLED REJECTION TRACKING

	/**
	 * Constructs a rejected promise.
	 * @param reason value describing the failure
	 */
	Q.reject = reject;
	function reject(reason) {
	    var rejection = Promise({
	        "when": function (rejected) {
	            // note that the error has been handled
	            if (rejected) {
	                untrackRejection(this);
	            }
	            return rejected ? rejected(reason) : this;
	        }
	    }, function fallback() {
	        return this;
	    }, function inspect() {
	        return { state: "rejected", reason: reason };
	    });

	    // Note that the reason has not been handled.
	    trackRejection(rejection, reason);

	    return rejection;
	}

	/**
	 * Constructs a fulfilled promise for an immediate reference.
	 * @param value immediate reference
	 */
	Q.fulfill = fulfill;
	function fulfill(value) {
	    return Promise({
	        "when": function () {
	            return value;
	        },
	        "get": function (name) {
	            return value[name];
	        },
	        "set": function (name, rhs) {
	            value[name] = rhs;
	        },
	        "delete": function (name) {
	            delete value[name];
	        },
	        "post": function (name, args) {
	            // Mark Miller proposes that post with no name should apply a
	            // promised function.
	            if (name === null || name === void 0) {
	                return value.apply(void 0, args);
	            } else {
	                return value[name].apply(value, args);
	            }
	        },
	        "apply": function (thisp, args) {
	            return value.apply(thisp, args);
	        },
	        "keys": function () {
	            return object_keys(value);
	        }
	    }, void 0, function inspect() {
	        return { state: "fulfilled", value: value };
	    });
	}

	/**
	 * Converts thenables to Q promises.
	 * @param promise thenable promise
	 * @returns a Q promise
	 */
	function coerce(promise) {
	    var deferred = defer();
	    Q.nextTick(function () {
	        try {
	            promise.then(deferred.resolve, deferred.reject, deferred.notify);
	        } catch (exception) {
	            deferred.reject(exception);
	        }
	    });
	    return deferred.promise;
	}

	/**
	 * Annotates an object such that it will never be
	 * transferred away from this process over any promise
	 * communication channel.
	 * @param object
	 * @returns promise a wrapping of that object that
	 * additionally responds to the "isDef" message
	 * without a rejection.
	 */
	Q.master = master;
	function master(object) {
	    return Promise({
	        "isDef": function () {}
	    }, function fallback(op, args) {
	        return dispatch(object, op, args);
	    }, function () {
	        return Q(object).inspect();
	    });
	}

	/**
	 * Spreads the values of a promised array of arguments into the
	 * fulfillment callback.
	 * @param fulfilled callback that receives variadic arguments from the
	 * promised array
	 * @param rejected callback that receives the exception if the promise
	 * is rejected.
	 * @returns a promise for the return value or thrown exception of
	 * either callback.
	 */
	Q.spread = spread;
	function spread(value, fulfilled, rejected) {
	    return Q(value).spread(fulfilled, rejected);
	}

	Promise.prototype.spread = function (fulfilled, rejected) {
	    return this.all().then(function (array) {
	        return fulfilled.apply(void 0, array);
	    }, rejected);
	};

	/**
	 * The async function is a decorator for generator functions, turning
	 * them into asynchronous generators.  Although generators are only part
	 * of the newest ECMAScript 6 drafts, this code does not cause syntax
	 * errors in older engines.  This code should continue to work and will
	 * in fact improve over time as the language improves.
	 *
	 * ES6 generators are currently part of V8 version 3.19 with the
	 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
	 * for longer, but under an older Python-inspired form.  This function
	 * works on both kinds of generators.
	 *
	 * Decorates a generator function such that:
	 *  - it may yield promises
	 *  - execution will continue when that promise is fulfilled
	 *  - the value of the yield expression will be the fulfilled value
	 *  - it returns a promise for the return value (when the generator
	 *    stops iterating)
	 *  - the decorated function returns a promise for the return value
	 *    of the generator or the first rejected promise among those
	 *    yielded.
	 *  - if an error is thrown in the generator, it propagates through
	 *    every following yield until it is caught, or until it escapes
	 *    the generator function altogether, and is translated into a
	 *    rejection for the promise returned by the decorated generator.
	 */
	Q.async = async;
	function async(makeGenerator) {
	    return function () {
	        // when verb is "send", arg is a value
	        // when verb is "throw", arg is an exception
	        function continuer(verb, arg) {
	            var result;

	            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
	            // engine that has a deployed base of browsers that support generators.
	            // However, SM's generators use the Python-inspired semantics of
	            // outdated ES6 drafts.  We would like to support ES6, but we'd also
	            // like to make it possible to use generators in deployed browsers, so
	            // we also support Python-style generators.  At some point we can remove
	            // this block.

	            if (typeof StopIteration === "undefined") {
	                // ES6 Generators
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    return reject(exception);
	                }
	                if (result.done) {
	                    return Q(result.value);
	                } else {
	                    return when(result.value, callback, errback);
	                }
	            } else {
	                // SpiderMonkey Generators
	                // FIXME: Remove this case when SM does ES6 generators.
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    if (isStopIteration(exception)) {
	                        return Q(exception.value);
	                    } else {
	                        return reject(exception);
	                    }
	                }
	                return when(result, callback, errback);
	            }
	        }
	        var generator = makeGenerator.apply(this, arguments);
	        var callback = continuer.bind(continuer, "next");
	        var errback = continuer.bind(continuer, "throw");
	        return callback();
	    };
	}

	/**
	 * The spawn function is a small wrapper around async that immediately
	 * calls the generator and also ends the promise chain, so that any
	 * unhandled errors are thrown instead of forwarded to the error
	 * handler. This is useful because it's extremely common to run
	 * generators at the top-level to work with libraries.
	 */
	Q.spawn = spawn;
	function spawn(makeGenerator) {
	    Q.done(Q.async(makeGenerator)());
	}

	// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
	/**
	 * Throws a ReturnValue exception to stop an asynchronous generator.
	 *
	 * This interface is a stop-gap measure to support generator return
	 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
	 * generators like Chromium 29, just use "return" in your generator
	 * functions.
	 *
	 * @param value the return value for the surrounding generator
	 * @throws ReturnValue exception with the value.
	 * @example
	 * // ES6 style
	 * Q.async(function* () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      return foo + bar;
	 * })
	 * // Older SpiderMonkey style
	 * Q.async(function () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      Q.return(foo + bar);
	 * })
	 */
	Q["return"] = _return;
	function _return(value) {
	    throw new QReturnValue(value);
	}

	/**
	 * The promised function decorator ensures that any promise arguments
	 * are settled and passed as values (`this` is also settled and passed
	 * as a value).  It will also ensure that the result of a function is
	 * always a promise.
	 *
	 * @example
	 * var add = Q.promised(function (a, b) {
	 *     return a + b;
	 * });
	 * add(Q(a), Q(B));
	 *
	 * @param {function} callback The function to decorate
	 * @returns {function} a function that has been decorated.
	 */
	Q.promised = promised;
	function promised(callback) {
	    return function () {
	        return spread([this, all(arguments)], function (self, args) {
	            return callback.apply(self, args);
	        });
	    };
	}

	/**
	 * sends a message to a value in a future turn
	 * @param object* the recipient
	 * @param op the name of the message operation, e.g., "when",
	 * @param args further arguments to be forwarded to the operation
	 * @returns result {Promise} a promise for the result of the operation
	 */
	Q.dispatch = dispatch;
	function dispatch(object, op, args) {
	    return Q(object).dispatch(op, args);
	}

	Promise.prototype.dispatch = function (op, args) {
	    var self = this;
	    var deferred = defer();
	    Q.nextTick(function () {
	        self.promiseDispatch(deferred.resolve, op, args);
	    });
	    return deferred.promise;
	};

	/**
	 * Gets the value of a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to get
	 * @return promise for the property value
	 */
	Q.get = function (object, key) {
	    return Q(object).dispatch("get", [key]);
	};

	Promise.prototype.get = function (key) {
	    return this.dispatch("get", [key]);
	};

	/**
	 * Sets the value of a property in a future turn.
	 * @param object    promise or immediate reference for object object
	 * @param name      name of property to set
	 * @param value     new value of property
	 * @return promise for the return value
	 */
	Q.set = function (object, key, value) {
	    return Q(object).dispatch("set", [key, value]);
	};

	Promise.prototype.set = function (key, value) {
	    return this.dispatch("set", [key, value]);
	};

	/**
	 * Deletes a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to delete
	 * @return promise for the return value
	 */
	Q.del = // XXX legacy
	Q["delete"] = function (object, key) {
	    return Q(object).dispatch("delete", [key]);
	};

	Promise.prototype.del = // XXX legacy
	Promise.prototype["delete"] = function (key) {
	    return this.dispatch("delete", [key]);
	};

	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param value     a value to post, typically an array of
	 *                  invocation arguments for promises that
	 *                  are ultimately backed with `resolve` values,
	 *                  as opposed to those backed with URLs
	 *                  wherein the posted value can be any
	 *                  JSON serializable object.
	 * @return promise for the return value
	 */
	// bound locally because it is used by other methods
	Q.mapply = // XXX As proposed by "Redsandro"
	Q.post = function (object, name, args) {
	    return Q(object).dispatch("post", [name, args]);
	};

	Promise.prototype.mapply = // XXX As proposed by "Redsandro"
	Promise.prototype.post = function (name, args) {
	    return this.dispatch("post", [name, args]);
	};

	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param ...args   array of invocation arguments
	 * @return promise for the return value
	 */
	Q.send = // XXX Mark Miller's proposed parlance
	Q.mcall = // XXX As proposed by "Redsandro"
	Q.invoke = function (object, name /*...args*/) {
	    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
	};

	Promise.prototype.send = // XXX Mark Miller's proposed parlance
	Promise.prototype.mcall = // XXX As proposed by "Redsandro"
	Promise.prototype.invoke = function (name /*...args*/) {
	    return this.dispatch("post", [name, array_slice(arguments, 1)]);
	};

	/**
	 * Applies the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param args      array of application arguments
	 */
	Q.fapply = function (object, args) {
	    return Q(object).dispatch("apply", [void 0, args]);
	};

	Promise.prototype.fapply = function (args) {
	    return this.dispatch("apply", [void 0, args]);
	};

	/**
	 * Calls the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q["try"] =
	Q.fcall = function (object /* ...args*/) {
	    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
	};

	Promise.prototype.fcall = function (/*...args*/) {
	    return this.dispatch("apply", [void 0, array_slice(arguments)]);
	};

	/**
	 * Binds the promised function, transforming return values into a fulfilled
	 * promise and thrown errors into a rejected one.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q.fbind = function (object /*...args*/) {
	    var promise = Q(object);
	    var args = array_slice(arguments, 1);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};
	Promise.prototype.fbind = function (/*...args*/) {
	    var promise = this;
	    var args = array_slice(arguments);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};

	/**
	 * Requests the names of the owned properties of a promised
	 * object in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @return promise for the keys of the eventually settled object
	 */
	Q.keys = function (object) {
	    return Q(object).dispatch("keys", []);
	};

	Promise.prototype.keys = function () {
	    return this.dispatch("keys", []);
	};

	/**
	 * Turns an array of promises into a promise for an array.  If any of
	 * the promises gets rejected, the whole array is rejected immediately.
	 * @param {Array*} an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns a promise for an array of the corresponding values
	 */
	// By Mark Miller
	// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
	Q.all = all;
	function all(promises) {
	    return when(promises, function (promises) {
	        var pendingCount = 0;
	        var deferred = defer();
	        array_reduce(promises, function (undefined, promise, index) {
	            var snapshot;
	            if (
	                isPromise(promise) &&
	                (snapshot = promise.inspect()).state === "fulfilled"
	            ) {
	                promises[index] = snapshot.value;
	            } else {
	                ++pendingCount;
	                when(
	                    promise,
	                    function (value) {
	                        promises[index] = value;
	                        if (--pendingCount === 0) {
	                            deferred.resolve(promises);
	                        }
	                    },
	                    deferred.reject,
	                    function (progress) {
	                        deferred.notify({ index: index, value: progress });
	                    }
	                );
	            }
	        }, void 0);
	        if (pendingCount === 0) {
	            deferred.resolve(promises);
	        }
	        return deferred.promise;
	    });
	}

	Promise.prototype.all = function () {
	    return all(this);
	};

	/**
	 * Returns the first resolved promise of an array. Prior rejected promises are
	 * ignored.  Rejects only if all promises are rejected.
	 * @param {Array*} an array containing values or promises for values
	 * @returns a promise fulfilled with the value of the first resolved promise,
	 * or a rejected promise if all promises are rejected.
	 */
	Q.any = any;

	function any(promises) {
	    if (promises.length === 0) {
	        return Q.resolve();
	    }

	    var deferred = Q.defer();
	    var pendingCount = 0;
	    array_reduce(promises, function (prev, current, index) {
	        var promise = promises[index];

	        pendingCount++;

	        when(promise, onFulfilled, onRejected, onProgress);
	        function onFulfilled(result) {
	            deferred.resolve(result);
	        }
	        function onRejected() {
	            pendingCount--;
	            if (pendingCount === 0) {
	                deferred.reject(new Error(
	                    "Can't get fulfillment value from any promise, all " +
	                    "promises were rejected."
	                ));
	            }
	        }
	        function onProgress(progress) {
	            deferred.notify({
	                index: index,
	                value: progress
	            });
	        }
	    }, undefined);

	    return deferred.promise;
	}

	Promise.prototype.any = function () {
	    return any(this);
	};

	/**
	 * Waits for all promises to be settled, either fulfilled or
	 * rejected.  This is distinct from `all` since that would stop
	 * waiting at the first rejection.  The promise returned by
	 * `allResolved` will never be rejected.
	 * @param promises a promise for an array (or an array) of promises
	 * (or values)
	 * @return a promise for an array of promises
	 */
	Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
	function allResolved(promises) {
	    return when(promises, function (promises) {
	        promises = array_map(promises, Q);
	        return when(all(array_map(promises, function (promise) {
	            return when(promise, noop, noop);
	        })), function () {
	            return promises;
	        });
	    });
	}

	Promise.prototype.allResolved = function () {
	    return allResolved(this);
	};

	/**
	 * @see Promise#allSettled
	 */
	Q.allSettled = allSettled;
	function allSettled(promises) {
	    return Q(promises).allSettled();
	}

	/**
	 * Turns an array of promises into a promise for an array of their states (as
	 * returned by `inspect`) when they have all settled.
	 * @param {Array[Any*]} values an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns {Array[State]} an array of states for the respective values.
	 */
	Promise.prototype.allSettled = function () {
	    return this.then(function (promises) {
	        return all(array_map(promises, function (promise) {
	            promise = Q(promise);
	            function regardless() {
	                return promise.inspect();
	            }
	            return promise.then(regardless, regardless);
	        }));
	    });
	};

	/**
	 * Captures the failure of a promise, giving an oportunity to recover
	 * with a callback.  If the given promise is fulfilled, the returned
	 * promise is fulfilled.
	 * @param {Any*} promise for something
	 * @param {Function} callback to fulfill the returned promise if the
	 * given promise is rejected
	 * @returns a promise for the return value of the callback
	 */
	Q.fail = // XXX legacy
	Q["catch"] = function (object, rejected) {
	    return Q(object).then(void 0, rejected);
	};

	Promise.prototype.fail = // XXX legacy
	Promise.prototype["catch"] = function (rejected) {
	    return this.then(void 0, rejected);
	};

	/**
	 * Attaches a listener that can respond to progress notifications from a
	 * promise's originating deferred. This listener receives the exact arguments
	 * passed to ``deferred.notify``.
	 * @param {Any*} promise for something
	 * @param {Function} callback to receive any progress notifications
	 * @returns the given promise, unchanged
	 */
	Q.progress = progress;
	function progress(object, progressed) {
	    return Q(object).then(void 0, void 0, progressed);
	}

	Promise.prototype.progress = function (progressed) {
	    return this.then(void 0, void 0, progressed);
	};

	/**
	 * Provides an opportunity to observe the settling of a promise,
	 * regardless of whether the promise is fulfilled or rejected.  Forwards
	 * the resolution to the returned promise when the callback is done.
	 * The callback can return a promise to defer completion.
	 * @param {Any*} promise
	 * @param {Function} callback to observe the resolution of the given
	 * promise, takes no arguments.
	 * @returns a promise for the resolution of the given promise when
	 * ``fin`` is done.
	 */
	Q.fin = // XXX legacy
	Q["finally"] = function (object, callback) {
	    return Q(object)["finally"](callback);
	};

	Promise.prototype.fin = // XXX legacy
	Promise.prototype["finally"] = function (callback) {
	    callback = Q(callback);
	    return this.then(function (value) {
	        return callback.fcall().then(function () {
	            return value;
	        });
	    }, function (reason) {
	        // TODO attempt to recycle the rejection with "this".
	        return callback.fcall().then(function () {
	            throw reason;
	        });
	    });
	};

	/**
	 * Terminates a chain of promises, forcing rejections to be
	 * thrown as exceptions.
	 * @param {Any*} promise at the end of a chain of promises
	 * @returns nothing
	 */
	Q.done = function (object, fulfilled, rejected, progress) {
	    return Q(object).done(fulfilled, rejected, progress);
	};

	Promise.prototype.done = function (fulfilled, rejected, progress) {
	    var onUnhandledError = function (error) {
	        // forward to a future turn so that ``when``
	        // does not catch it and turn it into a rejection.
	        Q.nextTick(function () {
	            makeStackTraceLong(error, promise);
	            if (Q.onerror) {
	                Q.onerror(error);
	            } else {
	                throw error;
	            }
	        });
	    };

	    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
	    var promise = fulfilled || rejected || progress ?
	        this.then(fulfilled, rejected, progress) :
	        this;

	    if (typeof process === "object" && process && process.domain) {
	        onUnhandledError = process.domain.bind(onUnhandledError);
	    }

	    promise.then(void 0, onUnhandledError);
	};

	/**
	 * Causes a promise to be rejected if it does not get fulfilled before
	 * some milliseconds time out.
	 * @param {Any*} promise
	 * @param {Number} milliseconds timeout
	 * @param {Any*} custom error message or Error object (optional)
	 * @returns a promise for the resolution of the given promise if it is
	 * fulfilled before the timeout, otherwise rejected.
	 */
	Q.timeout = function (object, ms, error) {
	    return Q(object).timeout(ms, error);
	};

	Promise.prototype.timeout = function (ms, error) {
	    var deferred = defer();
	    var timeoutId = setTimeout(function () {
	        if (!error || "string" === typeof error) {
	            error = new Error(error || "Timed out after " + ms + " ms");
	            error.code = "ETIMEDOUT";
	        }
	        deferred.reject(error);
	    }, ms);

	    this.then(function (value) {
	        clearTimeout(timeoutId);
	        deferred.resolve(value);
	    }, function (exception) {
	        clearTimeout(timeoutId);
	        deferred.reject(exception);
	    }, deferred.notify);

	    return deferred.promise;
	};

	/**
	 * Returns a promise for the given value (or promised value), some
	 * milliseconds after it resolved. Passes rejections immediately.
	 * @param {Any*} promise
	 * @param {Number} milliseconds
	 * @returns a promise for the resolution of the given promise after milliseconds
	 * time has elapsed since the resolution of the given promise.
	 * If the given promise rejects, that is passed immediately.
	 */
	Q.delay = function (object, timeout) {
	    if (timeout === void 0) {
	        timeout = object;
	        object = void 0;
	    }
	    return Q(object).delay(timeout);
	};

	Promise.prototype.delay = function (timeout) {
	    return this.then(function (value) {
	        var deferred = defer();
	        setTimeout(function () {
	            deferred.resolve(value);
	        }, timeout);
	        return deferred.promise;
	    });
	};

	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided as an array, and returns a promise.
	 *
	 *      Q.nfapply(FS.readFile, [__filename])
	 *      .then(function (content) {
	 *      })
	 *
	 */
	Q.nfapply = function (callback, args) {
	    return Q(callback).nfapply(args);
	};

	Promise.prototype.nfapply = function (args) {
	    var deferred = defer();
	    var nodeArgs = array_slice(args);
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided individually, and returns a promise.
	 * @example
	 * Q.nfcall(FS.readFile, __filename)
	 * .then(function (content) {
	 * })
	 *
	 */
	Q.nfcall = function (callback /*...args*/) {
	    var args = array_slice(arguments, 1);
	    return Q(callback).nfapply(args);
	};

	Promise.prototype.nfcall = function (/*...args*/) {
	    var nodeArgs = array_slice(arguments);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * Wraps a NodeJS continuation passing function and returns an equivalent
	 * version that returns a promise.
	 * @example
	 * Q.nfbind(FS.readFile, __filename)("utf-8")
	 * .then(console.log)
	 * .done()
	 */
	Q.nfbind =
	Q.denodeify = function (callback /*...args*/) {
	    var baseArgs = array_slice(arguments, 1);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        Q(callback).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};

	Promise.prototype.nfbind =
	Promise.prototype.denodeify = function (/*...args*/) {
	    var args = array_slice(arguments);
	    args.unshift(this);
	    return Q.denodeify.apply(void 0, args);
	};

	Q.nbind = function (callback, thisp /*...args*/) {
	    var baseArgs = array_slice(arguments, 2);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        function bound() {
	            return callback.apply(thisp, arguments);
	        }
	        Q(bound).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};

	Promise.prototype.nbind = function (/*thisp, ...args*/) {
	    var args = array_slice(arguments, 0);
	    args.unshift(this);
	    return Q.nbind.apply(void 0, args);
	};

	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback with a given array of arguments, plus a provided callback.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param {Array} args arguments to pass to the method; the callback
	 * will be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nmapply = // XXX As proposed by "Redsandro"
	Q.npost = function (object, name, args) {
	    return Q(object).npost(name, args);
	};

	Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
	Promise.prototype.npost = function (name, args) {
	    var nodeArgs = array_slice(args || []);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback, forwarding the given variadic arguments, plus a provided
	 * callback argument.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param ...args arguments to pass to the method; the callback will
	 * be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nsend = // XXX Based on Mark Miller's proposed "send"
	Q.nmcall = // XXX Based on "Redsandro's" proposal
	Q.ninvoke = function (object, name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 2);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};

	Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
	Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
	Promise.prototype.ninvoke = function (name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 1);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * If a function would like to support both Node continuation-passing-style and
	 * promise-returning-style, it can end its internal promise chain with
	 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
	 * elects to use a nodeback, the result will be sent there.  If they do not
	 * pass a nodeback, they will receive the result promise.
	 * @param object a result (or a promise for a result)
	 * @param {Function} nodeback a Node.js-style callback
	 * @returns either the promise or nothing
	 */
	Q.nodeify = nodeify;
	function nodeify(object, nodeback) {
	    return Q(object).nodeify(nodeback);
	}

	Promise.prototype.nodeify = function (nodeback) {
	    if (nodeback) {
	        this.then(function (value) {
	            Q.nextTick(function () {
	                nodeback(null, value);
	            });
	        }, function (error) {
	            Q.nextTick(function () {
	                nodeback(error);
	            });
	        });
	    } else {
	        return this;
	    }
	};

	Q.noConflict = function() {
	    throw new Error("Q.noConflict only works when Q is used as a global");
	};

	// All code before this point will be filtered from stack traces.
	var qEndingLine = captureLine();

	return Q;

	});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(3).setImmediate))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	(function () {
	    try {
	        cachedSetTimeout = setTimeout;
	    } catch (e) {
	        cachedSetTimeout = function () {
	            throw new Error('setTimeout is not defined');
	        }
	    }
	    try {
	        cachedClearTimeout = clearTimeout;
	    } catch (e) {
	        cachedClearTimeout = function () {
	            throw new Error('clearTimeout is not defined');
	        }
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        return setTimeout(fun, 0);
	    } else {
	        return cachedSetTimeout.call(null, fun, 0);
	    }
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        clearTimeout(marker);
	    } else {
	        cachedClearTimeout.call(null, marker);
	    }
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(2).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3).setImmediate, __webpack_require__(3).clearImmediate))

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var config = exports.config = {
	  "background_url": "./assets/bg.gif",
	  "spritesheet_url": "./assets/spritesheet.png",
	  "spritesheet": {
	    "a": {
	      "at": { "x": 151, "y": 301, "w": 86, "h": 83 },
	      "to": { "x": 97, "y": 192 }
	    },
	    "b": {
	      "at": { "x": 133, "y": 48, "w": 57, "h": 53 },
	      "to": { "x": 186, "y": 197 }
	    },
	    "c": {
	      "at": { "x": 111, "y": 105, "w": 55, "h": 59 },
	      "to": { "x": 232, "y": 193 }
	    },
	    "d": {
	      "at": { "x": 190, "y": 166, "w": 46, "h": 63 },
	      "to": { "x": 347, "y": 183 }
	    },
	    "e": {
	      "at": { "x": 82, "y": 48, "w": 51, "h": 52 },
	      "to": { "x": 409, "y": 174 }
	    },
	    "f": {
	      "at": { "x": 0, "y": 166, "w": 72, "h": 61 },
	      "to": { "x": 528, "y": 194 }
	    },
	    "g": {
	      "at": { "x": 88, "y": 384, "w": 77, "h": 87 },
	      "to": { "x": 602, "y": 145 }
	    },
	    "h": {
	      "at": { "x": 70, "y": 229, "w": 68, "h": 67 },
	      "to": { "x": 693, "y": 143 }
	    },
	    "i": {
	      "at": { "x": 0, "y": 301, "w": 74, "h": 76 },
	      "to": { "x": 11, "y": 309 }
	    },
	    "j": {
	      "at": { "x": 190, "y": 48, "w": 49, "h": 57 },
	      "to": { "x": 128, "y": 339 }
	    },
	    "k": {
	      "at": { "x": 0, "y": 384, "w": 88, "h": 84 },
	      "to": { "x": 176, "y": 332 }
	    },
	    "l": {
	      "at": { "x": 0, "y": 0, "w": 37, "h": 38 },
	      "to": { "x": 279, "y": 352 }
	    },
	    "m": {
	      "at": { "x": 131, "y": 166, "w": 59, "h": 63 },
	      "to": { "x": 352, "y": 334 }
	    },
	    "n": {
	      "at": { "x": 138, "y": 229, "w": 71, "h": 72 },
	      "to": { "x": 424, "y": 304 }
	    },
	    "o": {
	      "at": { "x": 83, "y": 0, "w": 43, "h": 44 },
	      "to": { "x": 522, "y": 294 }
	    },
	    "p": {
	      "at": { "x": 126, "y": 0, "w": 45, "h": 48 },
	      "to": { "x": 608, "y": 287 }
	    },
	    "q": {
	      "at": { "x": 74, "y": 301, "w": 77, "h": 79 },
	      "to": { "x": 789, "y": 275 }
	    },
	    "r": {
	      "at": { "x": 0, "y": 229, "w": 70, "h": 66 },
	      "to": { "x": 65, "y": 463 }
	    },
	    "s": {
	      "at": { "x": 0, "y": 48, "w": 39, "h": 49 },
	      "to": { "x": 153, "y": 478 }
	    },
	    "t": {
	      "at": { "x": 39, "y": 48, "w": 43, "h": 49 },
	      "to": { "x": 212, "y": 498 }
	    },
	    "u": {
	      "at": { "x": 166, "y": 105, "w": 43, "h": 61 },
	      "to": { "x": 302, "y": 485 }
	    },
	    "v": {
	      "at": { "x": 55, "y": 105, "w": 56, "h": 58 },
	      "to": { "x": 380, "y": 476 }
	    },
	    "w": {
	      "at": { "x": 171, "y": 0, "w": 37, "h": 48 },
	      "to": { "x": 468, "y": 467 }
	    },
	    "x": {
	      "at": { "x": 72, "y": 166, "w": 59, "h": 61 },
	      "to": { "x": 533, "y": 458 }
	    },
	    "y": {
	      "at": { "x": 0, "y": 105, "w": 55, "h": 57 },
	      "to": { "x": 634, "y": 444 }
	    },
	    "z": {
	      "at": { "x": 37, "y": 0, "w": 46, "h": 42 },
	      "to": { "x": 781, "y": 448 }
	    }
	  },
	  "mapping": {
	    "a": "a", "b": "b",
	    "c": "c", "d": "d",
	    "e": "e", "f": "f",
	    "g": "g", "h": "h",
	    "i": "i", "j": "j",
	    "k": "k", "l": "l",
	    "m": "m", "n": "n",
	    "o": "o", "p": "p",
	    "q": "q", "r": "r",
	    "s": "s", "t": "t",
	    "u": "u", "v": "v",
	    "w": "w", "x": "x",
	    "y": "y", "z": "z",
	    "!": "abcdefghijklmnopqrstuvwxyz"
	  }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.render = exports.load = exports.getdata = exports.ratio = exports.context = exports.canvas = undefined;

	var _q = __webpack_require__(1);

	var _q2 = _interopRequireDefault(_q);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var canvas = exports.canvas = document.querySelector('canvas');
	var context = exports.context = canvas.getContext('2d');
	var ratio = exports.ratio = 1 / 2;

	var background = void 0;
	var spritesheet = void 0;

	var getdata = exports.getdata = function getdata() {
	  var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	  var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	  var w = arguments.length <= 2 || arguments[2] === undefined ? NaN : arguments[2];
	  var h = arguments.length <= 3 || arguments[3] === undefined ? NaN : arguments[3];

	  if (isNaN(w)) w = canvas.width;

	  if (isNaN(h)) h = canvas.height;

	  return context.getImageData(x, y, w, h);
	};

	var load = exports.load = function load() {
	  for (var _len = arguments.length, assets = Array(_len), _key = 0; _key < _len; _key++) {
	    assets[_key] = arguments[_key];
	  }

	  return _q2.default.all(assets.map(function (url) {
	    var d = _q2.default.defer(),
	        i = new Image();

	    i.onload = function () {
	      d.resolve(i);
	    };
	    i.src = url;

	    return d.promise;
	  })).spread(function (b, s) {
	    background = b;
	    spritesheet = s;
	  });
	};

	var render = exports.render = function render() {
	  var expression = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	  var mapping = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	  var sprites = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	  var format = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

	  var d = _q2.default.defer();

	  // force the canvas
	  canvas.width = background.naturalWidth * ratio;
	  canvas.height = background.naturalHeight * ratio;
	  context.scale(ratio, ratio);

	  // draw background
	  context.drawImage(background, 0, 0);

	  if (expression in mapping) mapping[expression].split('').filter(function (char) {
	    return char in sprites;
	  }).forEach(function (char) {
	    char = sprites[char];

	    context.drawImage(spritesheet, char.at.x, char.at.y, char.at.w, char.at.h, char.to.x, char.to.y, char.at.w, char.at.h);
	  });

	  setImmediate(function () {
	    d.resolve(canvas.toDataURL(format));
	  });

	  return d.promise;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3).setImmediate))

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var TICK = 1000 / 3;

	var timer = null,
	    callback = null;

	var ontick = exports.ontick = function ontick() {
	  var handler = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

	  if (!(handler instanceof Function)) handler = function handler() {};

	  callback = handler;
	};

	var play = exports.play = function play() {
	  var value = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

	  stop();

	  // set internals
	  var string = value.split('').reduce(function (prev, char) {
	    return prev.concat([char, false]);
	  }, []);

	  // define loop boundaries
	  var i = 0,
	      l = string.length;

	  timer = setInterval(function () {
	    if (callback instanceof Function) callback(string[i]);

	    if (++i == l) i = 0;
	  }, TICK);
	};

	var stop = exports.stop = function stop() {
	  clearInterval(timer);
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var input = document.querySelector('input');

	var callback = null;

	var oninput = exports.oninput = function oninput() {
	  var handler = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

	  if (!(handler instanceof Function)) handler = function handler() {};

	  callback = handler;
	};

	var getinput = exports.getinput = function getinput() {
	  return input.value + ' ';
	};

	input.oninput = function () {
	  if (callback instanceof Function) callback(getinput());
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.compile = undefined;

	var _q = __webpack_require__(1);

	var _q2 = _interopRequireDefault(_q);

	var _jpeg = __webpack_require__(9);

	var _jpeg2 = _interopRequireDefault(_jpeg);

	var _worker = __webpack_require__(10);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var to_arraybuffer = function to_arraybuffer(blob) {
	  var d = _q2.default.defer(),
	      r = new FileReader();

	  r.onloadend = function () {
	    d.resolve(r.result);
	  };

	  r.readAsArrayBuffer(blob);
	  return d.promise;
	};

	var mp4 = function mp4(arraybuffers) {
	  return (0, _worker.execute)('./scripts/thread.js', {
	    type: 'command',
	    arguments: ['-framerate', 3, '-i', 'frame%03d.jpg', '-r', 3, '-strict', 'experimental', '-pix_fmt', 'yuv420p', '-v', 'verbose', 'output.mp4'],
	    files: arraybuffers.map(function (buffer, i) {
	      var n = i.toString();

	      while (n.length < 3) {
	        n = '0' + n;
	      }return {
	        data: new Uint8Array(buffer),
	        name: 'frame' + n + '.jpg'
	      };
	    })
	  });
	};

	var compile = exports.compile = function compile(string, canvas, config) {
	  return (0, _q2.default)()

	  // prepare the input value
	  .then(function () {
	    return string.split('').reduce(function (prev, item) {
	      return prev.concat([item, false]);
	    }, []);
	  })

	  // encode each frame
	  .then(function (chars) {
	    var encoder = new _jpeg2.default(60);

	    return chars.map(function (char) {
	      canvas.render(char, config.mapping, config.spritesheet);
	      var data = encoder.encode(canvas.getdata(), 60, true);

	      return new Blob([data.buffer], { type: 'image/jpeg' });
	    });
	  })

	  // convert blobs to array_buffer
	  .then(function (blobs) {
	    var arraybuffers = [];

	    return blobs.reduce(function (prev, blob) {
	      return to_arraybuffer(blob).then(function (buffer) {
	        arraybuffers.push(buffer);
	      });
	    }, (0, _q2.default)()).then(function () {
	      return arraybuffers;
	    });
	  }).then(function (arraybuffers) {
	    return mp4(arraybuffers);
	  });
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	/*

	  Basic GUI blocking jpeg encoder ported to JavaScript and optimized by
	  Andreas Ritter, www.bytestrom.eu, 11/2009.

	  Example usage is given at the bottom of this file.

	  ---------

	  Copyright (c) 2008, Adobe Systems Incorporated
	  All rights reserved.

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are
	  met:

	  * Redistributions of source code must retain the above copyright notice,
	    this list of conditions and the following disclaimer.

	  * Redistributions in binary form must reproduce the above copyright
	    notice, this list of conditions and the following disclaimer in the
	    documentation and/or other materials provided with the distribution.

	  * Neither the name of Adobe Systems Incorporated nor the names of its
	    contributors may be used to endorse or promote products derived from
	    this software without specific prior written permission.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
	  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
	  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
	  PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
	  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
	  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
	  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	function JPEGEncoder(quality) {
	    var self = this;
	    var fround = Math.round;
	    var ffloor = Math.floor;
	    var YTable = new Array(64);
	    var UVTable = new Array(64);
	    var fdtbl_Y = new Array(64);
	    var fdtbl_UV = new Array(64);
	    var YDC_HT;
	    var UVDC_HT;
	    var YAC_HT;
	    var UVAC_HT;

	    var bitcode = new Array(65535);
	    var category = new Array(65535);
	    var outputfDCTQuant = new Array(64);
	    var DU = new Array(64);
	    var byteout = [];
	    var bytenew = 0;
	    var bytepos = 7;

	    var YDU = new Array(64);
	    var UDU = new Array(64);
	    var VDU = new Array(64);
	    var clt = new Array(256);
	    var RGB_YUV_TABLE = new Array(2048);
	    var currentQuality;

	    var ZigZag = [0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30, 41, 43, 9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54, 20, 22, 33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58, 62, 63];

	    var std_dc_luminance_nrcodes = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
	    var std_dc_luminance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	    var std_ac_luminance_nrcodes = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d];
	    var std_ac_luminance_values = [0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08, 0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0, 0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa];

	    var std_dc_chrominance_nrcodes = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
	    var std_dc_chrominance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	    var std_ac_chrominance_nrcodes = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 0x77];
	    var std_ac_chrominance_values = [0x00, 0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21, 0x31, 0x06, 0x12, 0x41, 0x51, 0x07, 0x61, 0x71, 0x13, 0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91, 0xa1, 0xb1, 0xc1, 0x09, 0x23, 0x33, 0x52, 0xf0, 0x15, 0x62, 0x72, 0xd1, 0x0a, 0x16, 0x24, 0x34, 0xe1, 0x25, 0xf1, 0x17, 0x18, 0x19, 0x1a, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa];

	    function initQuantTables(sf) {
	        var YQT = [16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99];

	        for (var i = 0; i < 64; i++) {
	            var t = ffloor((YQT[i] * sf + 50) / 100);
	            if (t < 1) {
	                t = 1;
	            } else if (t > 255) {
	                t = 255;
	            }
	            YTable[ZigZag[i]] = t;
	        }
	        var UVQT = [17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99];
	        for (var j = 0; j < 64; j++) {
	            var u = ffloor((UVQT[j] * sf + 50) / 100);
	            if (u < 1) {
	                u = 1;
	            } else if (u > 255) {
	                u = 255;
	            }
	            UVTable[ZigZag[j]] = u;
	        }
	        var aasf = [1.0, 1.387039845, 1.306562965, 1.175875602, 1.0, 0.785694958, 0.541196100, 0.275899379];
	        var k = 0;
	        for (var row = 0; row < 8; row++) {
	            for (var col = 0; col < 8; col++) {
	                fdtbl_Y[k] = 1.0 / (YTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0);
	                fdtbl_UV[k] = 1.0 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0);
	                k++;
	            }
	        }
	    }

	    function computeHuffmanTbl(nrcodes, std_table) {
	        var codevalue = 0;
	        var pos_in_table = 0;
	        var HT = new Array();
	        for (var k = 1; k <= 16; k++) {
	            for (var j = 1; j <= nrcodes[k]; j++) {
	                HT[std_table[pos_in_table]] = [];
	                HT[std_table[pos_in_table]][0] = codevalue;
	                HT[std_table[pos_in_table]][1] = k;
	                pos_in_table++;
	                codevalue++;
	            }
	            codevalue *= 2;
	        }
	        return HT;
	    }

	    function initHuffmanTbl() {
	        YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes, std_dc_luminance_values);
	        UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes, std_dc_chrominance_values);
	        YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes, std_ac_luminance_values);
	        UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes, std_ac_chrominance_values);
	    }

	    function initCategoryNumber() {
	        var nrlower = 1;
	        var nrupper = 2;
	        for (var cat = 1; cat <= 15; cat++) {
	            //Positive numbers
	            for (var nr = nrlower; nr < nrupper; nr++) {
	                category[32767 + nr] = cat;
	                bitcode[32767 + nr] = [];
	                bitcode[32767 + nr][1] = cat;
	                bitcode[32767 + nr][0] = nr;
	            }
	            //Negative numbers
	            for (var nrneg = -(nrupper - 1); nrneg <= -nrlower; nrneg++) {
	                category[32767 + nrneg] = cat;
	                bitcode[32767 + nrneg] = [];
	                bitcode[32767 + nrneg][1] = cat;
	                bitcode[32767 + nrneg][0] = nrupper - 1 + nrneg;
	            }
	            nrlower <<= 1;
	            nrupper <<= 1;
	        }
	    }

	    function initRGBYUVTable() {
	        for (var i = 0; i < 256; i++) {
	            RGB_YUV_TABLE[i] = 19595 * i;
	            RGB_YUV_TABLE[i + 256 >> 0] = 38470 * i;
	            RGB_YUV_TABLE[i + 512 >> 0] = 7471 * i + 0x8000;
	            RGB_YUV_TABLE[i + 768 >> 0] = -11059 * i;
	            RGB_YUV_TABLE[i + 1024 >> 0] = -21709 * i;
	            RGB_YUV_TABLE[i + 1280 >> 0] = 32768 * i + 0x807FFF;
	            RGB_YUV_TABLE[i + 1536 >> 0] = -27439 * i;
	            RGB_YUV_TABLE[i + 1792 >> 0] = -5329 * i;
	        }
	    }

	    // IO functions
	    function writeBits(bs) {
	        var value = bs[0];
	        var posval = bs[1] - 1;
	        while (posval >= 0) {
	            if (value & 1 << posval) {
	                bytenew |= 1 << bytepos;
	            }
	            posval--;
	            bytepos--;
	            if (bytepos < 0) {
	                if (bytenew == 0xFF) {
	                    writeByte(0xFF);
	                    writeByte(0);
	                } else {
	                    writeByte(bytenew);
	                }
	                bytepos = 7;
	                bytenew = 0;
	            }
	        }
	    }

	    function writeByte(value) {
	        byteout.push(clt[value]); // write char directly instead of converting later
	    }

	    function writeWord(value) {
	        writeByte(value >> 8 & 0xFF);
	        writeByte(value & 0xFF);
	    }

	    // DCT & quantization core
	    function fDCTQuant(data, fdtbl) {
	        var d0, d1, d2, d3, d4, d5, d6, d7;
	        /* Pass 1: process rows. */
	        var dataOff = 0;
	        var i;
	        var I8 = 8;
	        var I64 = 64;
	        for (i = 0; i < I8; ++i) {
	            d0 = data[dataOff];
	            d1 = data[dataOff + 1];
	            d2 = data[dataOff + 2];
	            d3 = data[dataOff + 3];
	            d4 = data[dataOff + 4];
	            d5 = data[dataOff + 5];
	            d6 = data[dataOff + 6];
	            d7 = data[dataOff + 7];

	            var tmp0 = d0 + d7;
	            var tmp7 = d0 - d7;
	            var tmp1 = d1 + d6;
	            var tmp6 = d1 - d6;
	            var tmp2 = d2 + d5;
	            var tmp5 = d2 - d5;
	            var tmp3 = d3 + d4;
	            var tmp4 = d3 - d4;

	            /* Even part */
	            var tmp10 = tmp0 + tmp3; /* phase 2 */
	            var tmp13 = tmp0 - tmp3;
	            var tmp11 = tmp1 + tmp2;
	            var tmp12 = tmp1 - tmp2;

	            data[dataOff] = tmp10 + tmp11; /* phase 3 */
	            data[dataOff + 4] = tmp10 - tmp11;

	            var z1 = (tmp12 + tmp13) * 0.707106781; /* c4 */
	            data[dataOff + 2] = tmp13 + z1; /* phase 5 */
	            data[dataOff + 6] = tmp13 - z1;

	            /* Odd part */
	            tmp10 = tmp4 + tmp5; /* phase 2 */
	            tmp11 = tmp5 + tmp6;
	            tmp12 = tmp6 + tmp7;

	            /* The rotator is modified from fig 4-8 to avoid extra negations. */
	            var z5 = (tmp10 - tmp12) * 0.382683433; /* c6 */
	            var z2 = 0.541196100 * tmp10 + z5; /* c2-c6 */
	            var z4 = 1.306562965 * tmp12 + z5; /* c2+c6 */
	            var z3 = tmp11 * 0.707106781; /* c4 */

	            var z11 = tmp7 + z3; /* phase 5 */
	            var z13 = tmp7 - z3;

	            data[dataOff + 5] = z13 + z2; /* phase 6 */
	            data[dataOff + 3] = z13 - z2;
	            data[dataOff + 1] = z11 + z4;
	            data[dataOff + 7] = z11 - z4;

	            dataOff += 8; /* advance pointer to next row */
	        }

	        /* Pass 2: process columns. */
	        dataOff = 0;
	        for (i = 0; i < I8; ++i) {
	            d0 = data[dataOff];
	            d1 = data[dataOff + 8];
	            d2 = data[dataOff + 16];
	            d3 = data[dataOff + 24];
	            d4 = data[dataOff + 32];
	            d5 = data[dataOff + 40];
	            d6 = data[dataOff + 48];
	            d7 = data[dataOff + 56];

	            var tmp0p2 = d0 + d7;
	            var tmp7p2 = d0 - d7;
	            var tmp1p2 = d1 + d6;
	            var tmp6p2 = d1 - d6;
	            var tmp2p2 = d2 + d5;
	            var tmp5p2 = d2 - d5;
	            var tmp3p2 = d3 + d4;
	            var tmp4p2 = d3 - d4;

	            /* Even part */
	            var tmp10p2 = tmp0p2 + tmp3p2; /* phase 2 */
	            var tmp13p2 = tmp0p2 - tmp3p2;
	            var tmp11p2 = tmp1p2 + tmp2p2;
	            var tmp12p2 = tmp1p2 - tmp2p2;

	            data[dataOff] = tmp10p2 + tmp11p2; /* phase 3 */
	            data[dataOff + 32] = tmp10p2 - tmp11p2;

	            var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; /* c4 */
	            data[dataOff + 16] = tmp13p2 + z1p2; /* phase 5 */
	            data[dataOff + 48] = tmp13p2 - z1p2;

	            /* Odd part */
	            tmp10p2 = tmp4p2 + tmp5p2; /* phase 2 */
	            tmp11p2 = tmp5p2 + tmp6p2;
	            tmp12p2 = tmp6p2 + tmp7p2;

	            /* The rotator is modified from fig 4-8 to avoid extra negations. */
	            var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; /* c6 */
	            var z2p2 = 0.541196100 * tmp10p2 + z5p2; /* c2-c6 */
	            var z4p2 = 1.306562965 * tmp12p2 + z5p2; /* c2+c6 */
	            var z3p2 = tmp11p2 * 0.707106781; /* c4 */
	            var z11p2 = tmp7p2 + z3p2; /* phase 5 */
	            var z13p2 = tmp7p2 - z3p2;

	            data[dataOff + 40] = z13p2 + z2p2; /* phase 6 */
	            data[dataOff + 24] = z13p2 - z2p2;
	            data[dataOff + 8] = z11p2 + z4p2;
	            data[dataOff + 56] = z11p2 - z4p2;

	            dataOff++; /* advance pointer to next column */
	        }

	        // Quantize/descale the coefficients
	        var fDCTQuant;
	        for (i = 0; i < I64; ++i) {
	            // Apply the quantization and scaling factor & Round to nearest integer
	            fDCTQuant = data[i] * fdtbl[i];
	            outputfDCTQuant[i] = fDCTQuant > 0.0 ? fDCTQuant + 0.5 | 0 : fDCTQuant - 0.5 | 0;
	            //outputfDCTQuant[i] = fround(fDCTQuant);
	        }
	        return outputfDCTQuant;
	    }

	    function writeAPP0() {
	        writeWord(0xFFE0); // marker
	        writeWord(16); // length
	        writeByte(0x4A); // J
	        writeByte(0x46); // F
	        writeByte(0x49); // I
	        writeByte(0x46); // F
	        writeByte(0); // = "JFIF",'\0'
	        writeByte(1); // versionhi
	        writeByte(1); // versionlo
	        writeByte(0); // xyunits
	        writeWord(1); // xdensity
	        writeWord(1); // ydensity
	        writeByte(0); // thumbnwidth
	        writeByte(0); // thumbnheight
	    }

	    function writeSOF0(width, height) {
	        writeWord(0xFFC0); // marker
	        writeWord(17); // length, truecolor YUV JPG
	        writeByte(8); // precision
	        writeWord(height);
	        writeWord(width);
	        writeByte(3); // nrofcomponents
	        writeByte(1); // IdY
	        writeByte(0x11); // HVY
	        writeByte(0); // QTY
	        writeByte(2); // IdU
	        writeByte(0x11); // HVU
	        writeByte(1); // QTU
	        writeByte(3); // IdV
	        writeByte(0x11); // HVV
	        writeByte(1); // QTV
	    }

	    function writeDQT() {
	        writeWord(0xFFDB); // marker
	        writeWord(132); // length
	        writeByte(0);
	        for (var i = 0; i < 64; i++) {
	            writeByte(YTable[i]);
	        }
	        writeByte(1);
	        for (var j = 0; j < 64; j++) {
	            writeByte(UVTable[j]);
	        }
	    }

	    function writeDHT() {
	        writeWord(0xFFC4); // marker
	        writeWord(0x01A2); // length

	        writeByte(0); // HTYDCinfo
	        for (var i = 0; i < 16; i++) {
	            writeByte(std_dc_luminance_nrcodes[i + 1]);
	        }
	        for (var j = 0; j <= 11; j++) {
	            writeByte(std_dc_luminance_values[j]);
	        }

	        writeByte(0x10); // HTYACinfo
	        for (var k = 0; k < 16; k++) {
	            writeByte(std_ac_luminance_nrcodes[k + 1]);
	        }
	        for (var l = 0; l <= 161; l++) {
	            writeByte(std_ac_luminance_values[l]);
	        }

	        writeByte(1); // HTUDCinfo
	        for (var m = 0; m < 16; m++) {
	            writeByte(std_dc_chrominance_nrcodes[m + 1]);
	        }
	        for (var n = 0; n <= 11; n++) {
	            writeByte(std_dc_chrominance_values[n]);
	        }

	        writeByte(0x11); // HTUACinfo
	        for (var o = 0; o < 16; o++) {
	            writeByte(std_ac_chrominance_nrcodes[o + 1]);
	        }
	        for (var p = 0; p <= 161; p++) {
	            writeByte(std_ac_chrominance_values[p]);
	        }
	    }

	    function writeSOS() {
	        writeWord(0xFFDA); // marker
	        writeWord(12); // length
	        writeByte(3); // nrofcomponents
	        writeByte(1); // IdY
	        writeByte(0); // HTY
	        writeByte(2); // IdU
	        writeByte(0x11); // HTU
	        writeByte(3); // IdV
	        writeByte(0x11); // HTV
	        writeByte(0); // Ss
	        writeByte(0x3f); // Se
	        writeByte(0); // Bf
	    }

	    function processDU(CDU, fdtbl, DC, HTDC, HTAC) {
	        var EOB = HTAC[0x00];
	        var M16zeroes = HTAC[0xF0];
	        var pos;
	        var I16 = 16;
	        var I63 = 63;
	        var I64 = 64;
	        var DU_DCT = fDCTQuant(CDU, fdtbl);
	        //ZigZag reorder
	        for (var j = 0; j < I64; ++j) {
	            DU[ZigZag[j]] = DU_DCT[j];
	        }
	        var Diff = DU[0] - DC;DC = DU[0];
	        //Encode DC
	        if (Diff == 0) {
	            writeBits(HTDC[0]); // Diff might be 0
	        } else {
	            pos = 32767 + Diff;
	            writeBits(HTDC[category[pos]]);
	            writeBits(bitcode[pos]);
	        }
	        //Encode ACs
	        var end0pos = 63; // was const... which is crazy
	        for (; end0pos > 0 && DU[end0pos] == 0; end0pos--) {};
	        //end0pos = first element in reverse order !=0
	        if (end0pos == 0) {
	            writeBits(EOB);
	            return DC;
	        }
	        var i = 1;
	        var lng;
	        while (i <= end0pos) {
	            var startpos = i;
	            for (; DU[i] == 0 && i <= end0pos; ++i) {}
	            var nrzeroes = i - startpos;
	            if (nrzeroes >= I16) {
	                lng = nrzeroes >> 4;
	                for (var nrmarker = 1; nrmarker <= lng; ++nrmarker) {
	                    writeBits(M16zeroes);
	                }nrzeroes = nrzeroes & 0xF;
	            }
	            pos = 32767 + DU[i];
	            writeBits(HTAC[(nrzeroes << 4) + category[pos]]);
	            writeBits(bitcode[pos]);
	            i++;
	        }
	        if (end0pos != I63) {
	            writeBits(EOB);
	        }
	        return DC;
	    }

	    function initCharLookupTable() {
	        var sfcc = String.fromCharCode;
	        for (var i = 0; i < 256; i++) {
	            ///// ACHTUNG // 255
	            clt[i] = sfcc(i);
	        }
	    }

	    this.encode = function (image, quality, toRaw) // image data object
	    {
	        var time_start = new Date().getTime();

	        if (quality) setQuality(quality);

	        // Initialize bit writer
	        byteout = new Array();
	        bytenew = 0;
	        bytepos = 7;

	        // Add JPEG headers
	        writeWord(0xFFD8); // SOI
	        writeAPP0();
	        writeDQT();
	        writeSOF0(image.width, image.height);
	        writeDHT();
	        writeSOS();

	        // Encode 8x8 macroblocks
	        var DCY = 0;
	        var DCU = 0;
	        var DCV = 0;

	        bytenew = 0;
	        bytepos = 7;

	        this.encode.displayName = "_encode_";

	        var imageData = image.data;
	        var width = image.width;
	        var height = image.height;

	        var quadWidth = width * 4;
	        var tripleWidth = width * 3;

	        var x,
	            y = 0;
	        var r, g, b;
	        var start, p, col, row, pos;
	        while (y < height) {
	            x = 0;
	            while (x < quadWidth) {
	                start = quadWidth * y + x;
	                p = start;
	                col = -1;
	                row = 0;

	                for (pos = 0; pos < 64; pos++) {
	                    row = pos >> 3; // /8
	                    col = (pos & 7) * 4; // %8
	                    p = start + row * quadWidth + col;

	                    if (y + row >= height) {
	                        // padding bottom
	                        p -= quadWidth * (y + 1 + row - height);
	                    }

	                    if (x + col >= quadWidth) {
	                        // padding right
	                        p -= x + col - quadWidth + 4;
	                    }

	                    r = imageData[p++];
	                    g = imageData[p++];
	                    b = imageData[p++];

	                    /* // calculate YUV values dynamically
	                    YDU[pos]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
	                    UDU[pos]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
	                    VDU[pos]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
	                    */

	                    // use lookup table (slightly faster)
	                    YDU[pos] = (RGB_YUV_TABLE[r] + RGB_YUV_TABLE[g + 256 >> 0] + RGB_YUV_TABLE[b + 512 >> 0] >> 16) - 128;
	                    UDU[pos] = (RGB_YUV_TABLE[r + 768 >> 0] + RGB_YUV_TABLE[g + 1024 >> 0] + RGB_YUV_TABLE[b + 1280 >> 0] >> 16) - 128;
	                    VDU[pos] = (RGB_YUV_TABLE[r + 1280 >> 0] + RGB_YUV_TABLE[g + 1536 >> 0] + RGB_YUV_TABLE[b + 1792 >> 0] >> 16) - 128;
	                }

	                DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
	                DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
	                DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
	                x += 32;
	            }
	            y += 8;
	        }

	        ////////////////////////////////////////////////////////////////

	        // Do the bit alignment of the EOI marker
	        if (bytepos >= 0) {
	            var fillbits = [];
	            fillbits[1] = bytepos + 1;
	            fillbits[0] = (1 << bytepos + 1) - 1;
	            writeBits(fillbits);
	        }

	        writeWord(0xFFD9); //EOI

	        if (toRaw) {
	            var len = byteout.length;
	            var data = new Uint8Array(len);

	            for (var i = 0; i < len; i++) {
	                data[i] = byteout[i].charCodeAt();
	            }

	            //cleanup
	            byteout = [];

	            // benchmarking
	            var duration = new Date().getTime() - time_start;
	            console.log('Encoding time: ' + duration + 'ms');

	            return data;
	        }

	        var jpegDataUri = 'data:image/jpeg;base64,' + btoa(byteout.join(''));

	        byteout = [];

	        // benchmarking
	        var duration = new Date().getTime() - time_start;
	        console.log('Encoding time: ' + duration + 'ms');

	        return jpegDataUri;
	    };

	    function setQuality(quality) {
	        if (quality <= 0) {
	            quality = 1;
	        }
	        if (quality > 100) {
	            quality = 100;
	        }

	        if (currentQuality == quality) return; // don't recalc if unchanged

	        var sf = 0;
	        if (quality < 50) {
	            sf = Math.floor(5000 / quality);
	        } else {
	            sf = Math.floor(200 - quality * 2);
	        }

	        initQuantTables(sf);
	        currentQuality = quality;
	        console.log('Quality set to: ' + quality + '%');
	    }

	    function init() {
	        var time_start = new Date().getTime();
	        if (!quality) quality = 50;
	        // Create tables
	        initCharLookupTable();
	        initHuffmanTbl();
	        initCategoryNumber();
	        initRGBYUVTable();

	        setQuality(quality);
	        var duration = new Date().getTime() - time_start;
	        console.log('Initialization ' + duration + 'ms');
	    }

	    init();
	};

	/* Example usage. Quality is an int in the range [0, 100]
	function example(quality){
	    // Pass in an existing image from the page
	    var theImg = document.getElementById('testimage');
	    // Use a canvas to extract the raw image data
	    var cvs = document.createElement('canvas');
	    cvs.width = theImg.width;
	    cvs.height = theImg.height;
	    var ctx = cvs.getContext("2d");
	    ctx.drawImage(theImg,0,0);
	    var theImgData = (ctx.getImageData(0, 0, cvs.width, cvs.height));
	    // Encode the image and get a URI back, toRaw is false by default
	    var jpegURI = encoder.encode(theImgData, quality);
	    var img = document.createElement('img');
	    img.src = jpegURI;
	    document.body.appendChild(img);
	}

	Example usage for getting back raw data and transforming it to a blob.
	Raw data is useful when trying to send an image over XHR or Websocket,
	it uses around 30% less bytes then a Base64 encoded string. It can
	also be useful if you want to save the image to disk using a FileWriter.

	NOTE: The browser you are using must support Blobs
	function example(quality){
	    // Pass in an existing image from the page
	    var theImg = document.getElementById('testimage');
	    // Use a canvas to extract the raw image data
	    var cvs = document.createElement('canvas');
	    cvs.width = theImg.width;
	    cvs.height = theImg.height;
	    var ctx = cvs.getContext("2d");
	    ctx.drawImage(theImg,0,0);
	    var theImgData = (ctx.getImageData(0, 0, cvs.width, cvs.height));
	    // Encode the image and get a URI back, set toRaw to true
	    var rawData = encoder.encode(theImgData, quality, true);

	    blob = new Blob([rawData.buffer], {type: 'image/jpeg'});
	    var jpegURI = URL.createObjectURL(blob);

	    var img = document.createElement('img');
	    img.src = jpegURI;
	    document.body.appendChild(img);
	}*/

	module.exports = JPEGEncoder;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.execute = undefined;

	var _q = __webpack_require__(1);

	var _q2 = _interopRequireDefault(_q);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var execute = exports.execute = function execute(script, message) {
	  var d = _q2.default.defer(),
	      w = new Worker(script);

	  w.onmessage = function (e) {
	    e = e.data;

	    switch (e.type) {
	      case 'ready':
	        return w.postMessage(message);

	      case 'stdout':
	        return console.log(e.data);

	      case 'done':
	        return d.resolve(new Blob([e.data], {
	          type: 'video/mp4'
	        }));
	    }
	  };

	  return d.promise;
	};

/***/ }
/******/ ]);