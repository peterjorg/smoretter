/*!
 * update-package <https://github.com/jonschlinkert/update-package>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/**
 * Module dependencies
 */

var omit = require('object.omit');
var merge = require('merge-deep');
var pkg = require('load-pkg');

/**
 * Local dependencies
 */

var utils = require('./lib/utils');
var Fields = require('./lib/fields');

module.exports = updatePackage;

function updatePackage(config) {
  return updateConfig(merge({}, config || pkg));
}

function updateConfig(pkg) {
  var fields = new Fields(pkg);

  fields.set('author', function (value) {
    return value;
  });

  fields.set('bugs', function (value) {
    return value;
  });

  fields.set('license', function (value) {
    if (value && value.url) {
      pkg.licenses = [value];
    }
    return;
  });

  fields.set('licenses', function (value) {
    return value;
  });

  fields.set('repository', function (value) {
    return value;
  });

  fields.set('files', function (value) {
    if (typeof value === 'undefined') {
      value = ['index.js'];
    }
    return value;
  });

  fields.set('devDependencies', function (value) {
    if (typeof value === 'object' && utils.has(value, 'verb-tag-jscomments')) {
      value = omit(value, ['verb', 'verb-tag-jscomments']);
    }

    return value;
  });

  fields.set('keywords', function (value) {
    // return normalize.keywords(pkg)[key];
    return value;
  });

  fields.set('scripts', function (value) {
    if (value && value.test && /mocha -r/i.test(value.test)) {
      value.test = 'mocha';
    }
    return value;
  });

  fields.update();
  return pkg;
}
