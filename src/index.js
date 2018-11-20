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
    cookiesExpiration: 30, // the value in day of the expiration of cookie
    delay: 0 // the value in seconds of delay
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
      cookie.set(name, true, { expires: glio.config.cookiesExpiration });
    },
    getCookie: function (name) {
      return cookie.get(name);
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
    setTimeout(glio.loadEvents, loadEventsDelay * 1000);
    
  },
  loadEvents: function () {
    // Event mousemove just one time
    document.body.addEventListener('mousemove', function( event ) {
      var pointX = event.clientX;
      var pointY = event.clientY;

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
    var screenWidthFragment = glio.getScreenWidthFragment();
    return parseInt(( screenWidthFragment * glio.config.screenWidthFragment ) - screenWidthFragment );
  },
  // The value of total screen width are divided in parts
  getScreenWidthFragment: function () {
    return (parseInt(window.innerWidth) / glio.config.screenWidthFragment);
  },
  // The value of total screen height are divided in parts
  getScreenHeightFragment: function () {
    return (parseInt(window.innerHeight) / glio.config.screenWidthFragment);
  },
    // the height value of bottom. this value is the same, independent the direction
  getBottomHeightValue: function () {
    var screenHeightFragment = glio.getScreenHeightFragment();
    return ( screenHeightFragment * glio.config.screenWidthFragment ) - screenHeightFragment;
  },
  // verify if direction who user is the same of directions who glio have
  getDirection: function ( directionUser, direction ) {
    return directionUser === direction;
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
      glio.statusBottomRight = "active";``
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