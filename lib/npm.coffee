npm = require('npm')
async = require('async')
_ = require('lodash-contrib')
utils = require('./utils')

###*
# @summary Get information about an NPM package
# @function
# @private
#
# @param {String} name - package name
# @param {Function} callback - callback(error, info)
#
# @todo Find an easy way to unit test this function
#
# @example
# npm.getInfo 'foo', (error, info) ->
#		throw error if error?
#		console.log(info)
###
exports.getInfo = (name, callback) ->
	async.waterfall([

		(callback) ->
			options =

				# TODO: There is no way to quiet npm install completely.
				# Some output is still shown once the module is updated
				# https://github.com/npm/npm/issues/2040
				loglevel: 'silent'

				global: true

			npm.load(options, _.unary(callback))

		(callback) ->
			npm.commands.view([ name ], true, callback)

	], callback)

###*
# @summary Get the latest available version of an NPM package
# @function
# @private
#
# @param {String} name - package name
# @param {Function} callback - callback(error, version)
#
# @example
# npm.getLatestVersion 'foo', (error, version) ->
#		throw error if error?
#		console.log("The latest version is #{version}")
###
exports.getLatestVersion = (name, callback) ->
	exports.getInfo name, (error, data) ->
		return callback(error) if error?
		versions = _.keys(data)
		return callback(null, _.first(versions))

###*
# @summary Checks that a package is on the latest version
# @function
# @public
#
# @param {Object} packageJSON - the package.json
# @param {Function} callback - callback(error, isUpdated)
#
# @example
# packageJSON = require('./package.json')
#
# npm.isUpdated packageJSON, (error, isUpdated) ->
#		throw error if error?
#		console.log("Is package updated? #{isUpdated}")
###
exports.isUpdated = (packageJSON, callback) ->
	exports.getLatestVersion packageJSON.name, (error, latestVersion) ->
		return callback(error) if error?
		return callback(null, packageJSON.version is latestVersion)

###*
# @summary Update an NPM package
# @function
# @protected
#
# @param {Object} packageJSON - the package.json
# @param {Function} callback - callback(error, version)
#
# @example
# packageJSON = require('./package.json')
#
# npm.update packageJSON, (error, version) ->
#		throw error if error?
#		console.log("The package was updated to version #{version}")
###
exports.update = (packageJSON, callback) ->
	async.waterfall([

		(callback) ->

			# Attempting to self update using the NPM API was
			# not considered safe. A safer thing to do is to
			# call npm as a child process
			# https://github.com/npm/npm/issues/7723
			command = utils.getUpdateCommand(packageJSON.name)
			utils.runCommand(command, callback)

		(stdout, stderr, callback) ->
			if not _.isEmpty(stderr)
				return callback(new Error(stderr))

			# TODO: Not sure if this returns the latest available
			# version or the version that its currently installed
			exports.getLatestVersion(packageJSON.name, callback)

	], callback)
