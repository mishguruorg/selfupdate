president = require('president')
_ = require('lodash-contrib')
child_process = require('child_process')

###*
# @summary Get a command to perform an update
# @function
# @protected
#
# @param {String} package - package name
# @returns {String} an update command string
#
# @example
# command = utils.getUpdateCommand('foo')
###
exports.getUpdateCommand = (name) ->

	if not name?
		throw new Error('Missing package')

	return "npm install --silent --global #{name}"

###*
# @summary Check if an error is a permission related error
# @function
# @private
#
# @description
# This function tries to make all kinds of guesses and checks
# to determine if an error if permission related, therefore
# is the more important check within this module to make sure
# the update happens smoothly.
#
# It checks the error code and message contents among other things.
#
# @param {Error} error - error
# @returns {Boolean} wheter the error if permission related
#
# @example
# if utils.isPermissionError(new Error('...'))
#		...
###
exports.isPermissionError = (error) ->
	return false if not error?

	# Make sure there is a message to avoid
	# existence checks below each time
	error.message ?= ''

	return _.any [

		# 3 is equivalent to EACCES for NPM
		error.code is 3
		error.errno is 3

		error.code is 'EPERM'
		error.code is 'EACCES'
		error.code is 'ACCES'

		error.message.indexOf('EACCES') isnt -1
	]

###*
# @summary Run a command, and elevate if necessary
# @function
# @protected
#
# @param {String} command - command
# @param {Function} callback - callback (error, stdout, stderr)
#
# @example
# utils.runCommand 'npm install -g foo', (error, stdout, stderr) ->
#		throw error if error?
###
exports.runCommand = (command, callback) ->
	child_process.exec command, (error, stdout, stderr) ->

		if _.any [
			exports.isPermissionError(error)
			exports.isPermissionError(new Error(stderr))
		]
			return president.execute(command, callback)

		return callback(error, stdout, stderr)
