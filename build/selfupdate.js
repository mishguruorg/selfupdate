var async, npm, _;

_ = require('lodash-contrib');

async = require('async');

npm = require('./npm');

exports.isUpdated = npm.isUpdated;


/**
 * @summary Update an NPM package
 * @function
 * @public
 *
 * @describe
 * This function performs a global NPM
 * update and yields back the new version
 *
 * @param {Object} packageJSON - the package.json object
 * @param {Function} callback - callback (error, version)
 *
 * @example
 * packageJSON = require('./package.json')
 *
 * selfupdate.update packageJSON, (error, version) ->
 *		throw error if error?
 *		console.log("Package updated to version #{version}")
 */

exports.update = function(packageJSON, callback) {
  if (packageJSON == null) {
    throw new Error('Missing package json');
  }
  if (!_.isPlainObject(packageJSON)) {
    throw new Error("Invalid package json: " + packageJSON);
  }
  return async.waterfall([
    function(callback) {
      return npm.isUpdated(packageJSON, callback);
    }, function(isUpdated, callback) {
      if (isUpdated) {
        return callback(new Error('You\'re already running the latest version.'));
      }
      return npm.update(packageJSON, callback);
    }
  ], callback);
};
