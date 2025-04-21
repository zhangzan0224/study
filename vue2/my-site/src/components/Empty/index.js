if (!Array.prototype.some) {
  Array.prototype.some = function (callback, thisArg) {
    if (this == null) {
      throw new TypeError('Cannot convert null or undefined to object');
    }

    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    var obj = Object(this);
    var len = obj.length >>> 0;

    for (var i = 0; i < len; i++) {
      if (i in obj && callback.call(thisArg, obj[i], i, obj)) {
        return true;
      }
    }

    return false;
  };
}

if (!Array.prototype.every) {
  Array.prototype.every = function (callback, thisArg) {
    if (this == null) {
      throw new TypeError('Cannot convert null or undefined to object');
    }

    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    var obj = Object(this);
    var len = obj.length >>> 0;

    for (var i = 0; i < len; i++) {
      if (i in obj && !callback.call(thisArg, obj[i], i, obj)) {
        return false;
      }
    }

    return true;
  };
}

if (!Array.prototype.filter) {
  Array.prototype.filter = function (callback, thisArg) {
    if (this == null) {
      throw new TypeError('Cannot convert null or undefined to object');
    }

    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    var obj = Object(this);
    var len = obj.length >>> 0;
    var res = [];

    for (var i = 0; i < len; i++) {
      if (i in obj) {
        if (callback.call(thisArg, obj[i], i, obj)) {
          res.push(obj[i]);
        }
      }
    }
    return res;
  };
}