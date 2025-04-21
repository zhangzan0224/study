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

if (!Array.prototype.map) {
  Array.prototype.map = function (callback, thisArg) {
    if (this == null) {
      throw new TypeError('Cannot convert null or undefined to object');
    }

    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    var obj = Object(this);
    var len = obj.length >>> 0;
    var res = new Array(len);

    for (var i = 0; i < len; i++) {
      if (i in obj) {
        res[i] = callback.call(thisArg, obj[i], i, obj);
      }
    }
    return res;
  };
}
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function (callback, initialValue) {
    if (this == null) {
      throw new TypeError('Array.prototype.reduce called on null or undefined');
    }

    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    var obj = Object(this);
    var len = obj.length >>> 0;
    var k = 0;
    var accumulator;

    if (arguments.length > 1) {
      accumulator = initialValue;
    } else {
      while (k < len && !(k in obj)) {
        k++;
      }
      if (k >= len) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      accumulator = obj[k++];
    }

    for (; k < len; k++) {
      if (k in obj) {
        accumulator = callback(accumulator, obj[k], k, obj);
      }
    }
    return accumulator;
  };
}
if (!Array.prototype.reduceRight) {
  Array.prototype.reduceRight = function (callback, initialValue) {
    if (this == null) {
      throw new TypeError('Array.prototype.reduceRight called on null or undefined');
    }

    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    var obj = Object(this);
    var len = obj.length >>> 0;
    var k = len - 1;
    var accumulator;

    if (arguments.length > 1) {
      accumulator = initialValue;
    } else {
      while (k >= 0 && !(k in obj)) {
        k--;
      }
      if (k < 0) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      accumulator = obj[k--];
    }

    for (; k >= 0; k--) {
      if (k in obj) {
        accumulator = callback(accumulator, obj[k], k, obj);
      }
    }
    return accumulator;
  };
}

if (!Array.prototype.find) {
  Array.prototype.find = function (callback, thisArg) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }

    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    var obj = Object(this);
    var len = obj.length >>> 0;
    var thisArg = arguments.length > 1 ? arguments[1] : void 0;
    var k = 0;

    while (k < len) {
      var kValue;
      if (k in obj) {
        kValue = obj[k];
        if (callback.call(thisArg, kValue, k, obj)) {
          return kValue;
        }
      }
      k++;
    }
    return undefined;
  };
}

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function (callback, thisArg) {
    if (this == null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }

    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    var obj = Object(this);
    var len = obj.length >>> 0;
    var k = 0;

    while (k < len) {
      if (k in obj) {
        if (callback.call(thisArg, obj[k], k, obj)) {
          return k;
        }
      }
      k++;
    }
    return -1;
  };
}