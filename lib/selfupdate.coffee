child_process = require('child_process')
_ = require('lodash-contrib')
async = require('async')
npm = require('./npm')

# This function is documented and unit tested
# in the respective declaration place
exports.isUpdated = npm.isUpdated

###*
# @summary Update an NPM package
# @function
# @public
#
# @describe
# This function performs a global NPM
# update and yields back the new version
#
# @param {Object} packageJSON - the package.json object
# @param {Function} callback - callback (error, version)
#
# @example
# packageJSON = require('./package.json')
#
# selfupdate.update packageJSON, (error, version) ->
#		throw error if error?
#		console.log("Package updated to version #{version}")
###
exports.update = (packageJSON, callback) ->

	if not packageJSON?
		throw new Error('Missing package json')

	if not _.isPlainObject(packageJSON)
		throw new Error("Invalid package json: #{packageJSON}")

	async.waterfall([

		(callback) ->
			npm.isUpdated(packageJSON, callback)

		(isUpdated, callback) ->
			if isUpdated
				return callback(new Error('You\'re already running the latest version.'))

			npm.update(packageJSON, callback)

	], callback)

###*
# @summary Restart the current process
# @function
# @public
#
# @description
# Restart the current process using process.argv.
# The current process exits only when the child
# process does, so you must make sure the current
# process does not run any further code.
#
# @example
# selfupdate.restart()
###
exports.restart = ->
	command = process.argv[0]
	args = process.argv.slice(1)
	child = child_process.spawn(command, args, stdio: 'inherit')
	child.on('close', process.exit)
