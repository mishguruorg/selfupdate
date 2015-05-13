var async, npm, utils, _;

npm = require('npm');

async = require('async');

_ = require('lodash-contrib');

utils = require('./utils');


/**
 * @summary Get information about an NPM package
 * @function
 * @private
 *
 * @param {String} name - package name
 * @param {Function} callback - callback(error, info)
 *
 * @todo Find an easy way to unit test this function
 *
 * @example
 * npm.getInfo 'foo', (error, info) ->
 *		throw error if error?
 *		console.log(info)
 */

exports.getInfo = function(name, callback) {
  return async.waterfall([
    function(callback) {
      var options;
      options = {
        loglevel: 'silent',
        global: true
      };
      return npm.load(options, _.unary(callback));
    }, function(callback) {
      return npm.commands.view([name], true, callback);
    }
  ], callback);
};


/**
 * @summary Get the latest available version of an NPM package
 * @function
 * @private
 *
 * @param {String} name - package name
 * @param {Function} callback - callback(error, version)
 *
 * @example
 * npm.getLatestVersion 'foo', (error, version) ->
 *		throw error if error?
 *		console.log("The latest version is #{version}")
 */

exports.getLatestVersion = function(name, callback) {
  return exports.getInfo(name, function(error, data) {
    var versions;
    if (error != null) {
      return callback(error);
    }
    versions = _.keys(data);
    return callback(null, _.first(versions));
  });
};


/**
 * @summary Checks that a package is on the latest version
 * @function
 * @public
 *
 * @param {Object} packageJSON - the package.json
 * @param {Function} callback - callback(error, isUpdated)
 *
 * @example
 * packageJSON = require('./package.json')
 *
 * npm.isUpdated packageJSON, (error, isUpdated) ->
 *		throw error if error?
 *		console.log("Is package updated? #{isUpdated}")
 */

exports.isUpdated = function(packageJSON, callback) {
  return exports.getLatestVersion(packageJSON.name, function(error, latestVersion) {
    if (error != null) {
      return callback(error);
    }
    return callback(null, packageJSON.version === latestVersion);
  });
};


/**
 * @summary Update an NPM package
 * @function
 * @protected
 *
 * @param {Object} packageJSON - the package.json
 * @param {Function} callback - callback(error, version)
 *
 * @example
 * packageJSON = require('./package.json')
 *
 * npm.update packageJSON, (error, version) ->
 *		throw error if error?
 *		console.log("The package was updated to version #{version}")
 */

exports.update = function(packageJSON, callback) {
  return async.waterfall([
    function(callback) {
      var command;
      command = utils.getUpdateCommand(packageJSON.name);
      return utils.runCommand(command, callback);
    }, function(stdout, stderr, callback) {
      if (!_.isEmpty(stderr)) {
        return callback(new Error(stderr));
      }
      return exports.getLatestVersion(packageJSON.name, callback);
    }
  ], callback);
};
