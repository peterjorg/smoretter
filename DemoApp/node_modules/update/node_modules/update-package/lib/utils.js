'use strict';


exports.has = function has(o, key) {
  return o && key && o.hasOwnProperty(key);
};
