(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!this.json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

},{}],2:[function(require,module,exports){
var cookie = require('js-cookie');

var glio = {
  /**
   * Initial Configuration
   * you can change the values before init method
   * glio.config.key = value;
   **/
  config: {
    screenWidthFragment: 12,  // the width of screen : 12
    centerTopHeight: 10, // the value of height to trigger a callback on center-top
    heightTopLeft: 30,  // the value of height when top-left direction is set
    heightTopRight: 30, // the value of height when top-right direction is set
    cookiesExpiration: 30, 
    delay: 0
  },
  cookiesManager: {
    names: {
      top: 'glioTop',
      topLeft: 'glioTopLeft',
      topRight: 'glioTopRight',
      bottomLeft: 'glioBottomLeft',
      bottomRight: 'glioBottomRight'
    },
    setCookie: function (name) {
      cookie.set(name, true, { expires: glio.config.cookiesExpiration })
    },
    getCookie: function (name) {
      return cookie.get(name)
    }
  },
  // glio methods status
  statusTopLeft: "inactive",
  statusTopRight: "inactive",
  statusBottomLeft: "inactive",
  statusBottomRight: "inactive",
  statusTop: "inactive",
  init: function ( ) {
    // return a Array with the methods
    glio.methods = Array.prototype.slice.call(arguments);
    // get the direction and your correspondent callback
    Array.prototype.forEach.call(glio.methods, function (index) {
      if ( glio.getDirection( index[0], "top-left" ) ) {
        glio.topLeftFn = glio.trigger(index[1]);
      }
      else if ( glio.getDirection( index[0], "top-right" ) ) {
        glio.topRightFn = glio.trigger(index[1]);
      }
      else if ( glio.getDirection( index[0], "bottom-right" ) ) {
        glio.bottomRightFn = glio.trigger(index[1]);
      }
      else if ( glio.getDirection( index[0], "bottom-left" ) ) {
        glio.bottomLeftFn = glio.trigger(index[1]);
      }
      else if ( glio.getDirection( index[0], "top" ) ) {
        glio.TopFn = glio.trigger(index[1]);
      }
    });

    var loadEventsDelay = typeof glio.config.delay === 'number' ? glio.config.delay : 0
    setTimeout( glio.loadEvents, loadEventsDelay * 1000);
    
  },
  loadEvents: function () {
    // Event mousemove just one time
    document.body.addEventListener('mousemove', function( event ) {
      var pointX = event.clientX
        , pointY = event.clientY
      ;

      if ( typeof glio.topLeftFn === "function" &&  glio.statusTopLeft === "inactive" ) {
        glio.callTopleft(pointX, pointY, glio.topLeftFn);
      }
      if (typeof glio.topRightFn === "function" && glio.statusTopRight === "inactive" ) {
        glio.callTopRight(pointX, pointY, glio.topRightFn);
      }
      if (typeof glio.bottomLeftFn === "function" && glio.statusBottomLeft === "inactive" ) {
        glio.callBottomLeft(pointX, pointY, glio.bottomLeftFn);
      }
      if (typeof glio.bottomRightFn === "function" && glio.statusBottomRight === "inactive" ) {
        glio.callBottomRight(pointX, pointY, glio.bottomRightFn);
      }
      if (typeof glio.TopFn === "function" && glio.statusTop === "inactive" ) {
        glio.callTop(pointX, pointY, glio.TopFn);
      }
    });
  },
  // return a callback who will pass like argument to other function
  trigger: function ( callback ) {
    return callback;
  },
  // the value of top-right screen, for use when user pass the mouse in the area
  getWidthRightValue: function () {
    var screenWidthFragment = glio.getScreenWidthFragment()
      , topRightValue = ( screenWidthFragment * glio.config.screenWidthFragment ) - screenWidthFragment
    ;
    return parseInt(topRightValue);
  },
  // get the value of top height
  getTopHeight: function () {
    var sHeight = 50;
    return sHeight;
  },
  // The value of total screen width are divided in parts
  getScreenWidthFragment: function () {
    var screenWidthFragment = (parseInt(window.innerWidth) / glio.config.screenWidthFragment);
    return screenWidthFragment;
  },
  // The value of total screen height are divided in parts
  getScreenHeightFragment: function () {
    var screenHeightFragment = (parseInt(window.innerHeight) / glio.config.screenWidthFragment);
    return screenHeightFragment;
  },
    // the height value of bottom. this value is the same, independent the direction
  getBottomHeightValue: function ( ) {
    var screenHeightFragment = glio.getScreenHeightFragment()
      , bottomRightValue = ( screenHeightFragment * glio.config.screenWidthFragment ) - screenHeightFragment
    ;
    return bottomRightValue;
  },
  // verify if direction who user is the same of directions who glio have
  getDirection: function ( directionUser, direction ) {
    if ( directionUser === direction ) {
      return true;
    };
    return false;
  },
  /*
    * Functions of each direction
    */
  callTopleft: function ( x, y, callback ) {

    if ( glio.cookiesManager.getCookie(glio.cookiesManager.names.topLeft) ) return;

    if ( x <= glio.getScreenWidthFragment() && y <= glio.config.heightTopLeft ) {
      glio.statusTopLeft = "active";
      glio.cookiesManager.setCookie(glio.cookiesManager.names.topLeft);
      callback();
    };
  },
  callTopRight: function ( x, y, callback ) {
    if ( glio.cookiesManager.getCookie(glio.cookiesManager.names.topRight) ) return;

    if ( x > glio.getWidthRightValue() && y <= glio.config.heightTopRight ) {
      glio.statusTopRight = "active";
      glio.cookiesManager.setCookie(glio.cookiesManager.names.topRight);
      callback();
    };         
  },
  callBottomRight: function ( x, y, callback ) {
    if ( glio.cookiesManager.getCookie(glio.cookiesManager.names.bottomRight) ) return;

    if ( x >= glio.getWidthRightValue() && y >= glio.getBottomHeightValue() ) {
      glio.statusBottomRight = "active";
      glio.cookiesManager.setCookie(glio.cookiesManager.names.bottomRight);
      callback();
    };
  },
  callBottomLeft: function ( x, y, callback ) {
    if ( glio.cookiesManager.getCookie(glio.cookiesManager.names.bottomLeft) ) return;

    if ( x <= glio.getScreenWidthFragment() && y >= glio.getBottomHeightValue() ) {
      glio.statusBottomLeft = "active";
      glio.cookiesManager.setCookie(glio.cookiesManager.names.bottomLeft);
      callback();
    };
  },
  // array to use in the callTop
  positionsTopY: [],
  callTop: function (x, y, callback ) {
    if ( glio.cookiesManager.getCookie(glio.cookiesManager.names.top) ) return;

    if ( y > (glio.config.centerTopHeight + 1)) {
      glio.positionsTopY.push(y);
    }
    if ( x > glio.getScreenWidthFragment() && x < glio.getWidthRightValue() ) {
      // check if the user mouse direction is bottom to top
      if ( y <= glio.config.centerTopHeight && glio.positionsTopY[0] > glio.config.centerTopHeight ) {
        glio.statusTop = "active";
        glio.cookiesManager.setCookie(glio.cookiesManager.names.top);
        callback();
      }
    }
  }
}

module.exports = {
  init: glio.init,
  config: glio.config
}
},{"js-cookie":1}],3:[function(require,module,exports){
var glio = require('./glio');

glio.init(
  [ 'top', function () {
      alert('this is top.');
    }
  ],
  [ 'top-left', function () {
      alert('this is top-left');
    }
  ],
  [ 'top-right', function () {
      alert('this is top-right');
    }
  ],
  [ 'bottom-left', function () {
      alert('this is bottom-left');
    }
  ],
  [ 'bottom-right', function () {
      alert('this is bottom-right'); 
    }
  ] 
);
},{"./glio":2}]},{},[3]);
