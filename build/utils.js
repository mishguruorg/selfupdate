var child_process, president, _;

president = require('president');

_ = require('lodash-contrib');

child_process = require('child_process');


/**
 * @summary Get a command to perform an update
 * @function
 * @protected
 *
 * @param {String} package - package name
 * @returns {String} an update command string
 *
 * @example
 * command = utils.getUpdateCommand('foo')
 */

exports.getUpdateCommand = function(name) {
  if (name == null) {
    throw new Error('Missing package');
  }
  return "npm install --silent --global " + name;
};


/**
 * @summary Check if an error is a permission related error
 * @function
 * @private
 *
 * @description
 * This function tries to make all kinds of guesses and checks
 * to determine if an error if permission related, therefore
 * is the more important check within this module to make sure
 * the update happens smoothly.
 *
 * It checks the error code and message contents among other things.
 *
 * @param {Error} error - error
 * @returns {Boolean} wheter the error if permission related
 *
 * @example
 * if utils.isPermissionError(new Error('...'))
 *		...
 */

exports.isPermissionError = function(error) {
  if (error == null) {
    return false;
  }
  if (error.message == null) {
    error.message = '';
  }
  return _.any([error.code === 3, error.errno === 3, error.code === 'EPERM', error.code === 'EACCES', error.code === 'ACCES', error.message.indexOf('EACCES') !== -1]);
};


/**
 * @summary Run a command, and elevate if necessary
 * @function
 * @protected
 *
 * @param {String} command - command
 * @param {Function} callback - callback (error, stdout, stderr)
 *
 * @example
 * utils.runCommand 'npm install -g foo', (error, stdout, stderr) ->
 *		throw error if error?
 */

exports.runCommand = function(command, callback) {
  return child_process.exec(command, function(error, stdout, stderr) {
    if (_.any([exports.isPermissionError(error), exports.isPermissionError(new Error(stderr))])) {
      return president.execute(command, callback);
    }
    return callback(error, stdout, stderr);
  });
};
