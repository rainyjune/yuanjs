  /**
   * Helper functions
   *
   */

  function encodeFormatData(data) {
      if (!data) return ""; // Always return a string
      if(typeof data === "string") return data;
      var pairs = []; // To hold name=value pairs
      for(var name in data) { // For each name
          if (!data.hasOwnProperty(name)) continue; // Skip inherited
          if (typeof data[name] === "function") continue; // Skip methods
          var value = data[name].toString(); // Value as string
          name = encodeURIComponent(name.replace(" ", "+")); // Encode name
          value = encodeURIComponent(value.replace(" ", "+")); // Encode value
          pairs.push(name + "=" + value); // Remember name=value pair
      }
      return pairs.join('&'); // Return joined pairs separated with &
  }

  /**
   * Polyfill
   *
   */

  // Emulate the XMLHttpRequest() constructor in IE5 and IE6
  if (window.XMLHttpRequest === undefined) {
      window.XMLHttpRequest = function() {
          try {
              // Use the latest version of the ActiveX object if available
              return new ActiveXObject("Msxml2.XMLHTTP.6.0");
          } catch (e1) {
              try {
                  // Otherwise fall back on an older version
                  return new ActiveXObject("Msxml2.XMLHTTP.3.0");
              } catch(e2) {
                  // Otherwise, throw an error
                  throw new Error("XMLHttpRequest is not supported");
              }
          }
      };
  }

  if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
          "use strict";
          if (this == null) {
              throw new TypeError();
          }
          var t = Object(this);
          var len = t.length >>> 0;
          if (len === 0) {
              return -1;
          }
          var n = 0;
          if (arguments.length > 1) {
              n = Number(arguments[1]);
              if (n != n) { // shortcut for verifying if it's NaN
                  n = 0;
              } else if (n != 0 && n != Infinity && n != -Infinity) {
                  n = (n > 0 || -1) * Math.floor(Math.abs(n));
              }
          }
          if (n >= len) {
              return -1;
          }
          var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
          for (; k < len; k++) {
              if (k in t && t[k] === searchElement) {
                  return k;
              }
          }
          return -1;
      }
  }
  // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
  // Production steps of ECMA-262, Edition 5, 15.4.4.18
  // Reference: http://es5.github.com/#x15.4.4.18
  if (!Array.prototype.forEach) {

    Array.prototype.forEach = function forEach(callback, thisArg) {
      'use strict';
      var T, k;

      if (this == null) {
        throw new TypeError("this is null or not defined");
      }

      var kValue,
          // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
          O = Object(this),

          // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
          // 3. Let len be ToUint32(lenValue).
          len = O.length >>> 0; // Hack to convert O.length to a UInt32

      // 4. If IsCallable(callback) is false, throw a TypeError exception.
      // See: http://es5.github.com/#x9.11
      if ({}.toString.call(callback) !== "[object Function]") {
        throw new TypeError(callback + " is not a function");
      }

      // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
      if (arguments.length >= 2) {
        T = thisArg;
      }

      // 6. Let k be 0
      k = 0;

      // 7. Repeat, while k < len
      while (k < len) {

        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
        if (k in O) {

          // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
          kValue = O[k];

          // ii. Call the Call internal method of callback with T as the this value and
          // argument list containing kValue, k, and O.
          callback.call(T, kValue, k, O);
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined
    };
  }
  
  // Poly fill for IE 6
  if (!window.console) {
      window.console = {
          log: function() {
              var args = Array.prototype.slice.call(arguments);
              var str = args.join("\n");
              alert(str);
          }
      };
  }
  