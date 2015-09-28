'use strict';

var utils = require('./utils');

/**
 * Expose `Fields`
 */

module.exports = Fields;

function Fields(config) {
  this.config = config || {};
  this.fields = {};
}

Fields.prototype.set = function(key, fn) {
  this.fields[key] = fn;
  return this;
};

Fields.prototype.get = function(key) {
  return this.fields[key];
};

Fields.prototype.remove = function(key) {
  delete this.fields[key];
};

Fields.prototype.update = function() {
  for (var key in this.fields) {
    if (utils.has(this.fields, key)) {
      var val = this.config[key] || null;
      var fn = this.fields[key];
      var res = fn(val, key, this.config);
      if (res != null) {
        this.config[key] = res;
      }
    }
  }
  return this.config;
};
