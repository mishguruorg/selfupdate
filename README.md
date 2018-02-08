@mishguru/selfupdate
--------------------

Selfupdate your global NPM package.

Installation
------------

Install `selfupdate` by running:

```sh
$ npm install --save @mishguru/selfupdate
```

Documentation
-------------

### selfupdate.update(Object packageJSON, Function callback)

Update a globally installed NPM package.

If the installation fails with a permission related error, the module will attempt to elevate privileges automatically.

The function requires the `package.json`, which you can require like:

```javascript
var packageJSON = require('./package.json');
```

The callback gets passed two arguments: `(error, version)`, where `version` is the new version of the package after the update took place.

Example:

```javascript
var selfupdate = require('selfupdate');
var packageJSON = require('./package.json');

selfupdate.update(packageJSON, function(error, version) {
		if(error) throw error;
		console.log('The package was updated to version: ' + version);
});
```

### selfupdate.isUpdated(Object packageJSON, Function callback)

Check if a global package is in the latest version.

The function requires the `package.json`, which you can require like:

```javascript
var packageJSON = require('./package.json');
```

The callback gets passed two arguments: `(error, isUpdated)`, where `isUpdated` is a `Boolean` that determines if the package is up to date.

Example:

```javascript
var selfupdate = require('selfupdate');
var packageJSON = require('./package.json');

selfupdate.isUpdated(packageJSON, function(error, isUpdated) {
		if(error) throw error;
		console.log('Is the package up to date? ' + isUpdated);
});
```

### selfupdate.restart()

Restart the current process, based on `process.argv`.

This function is useful when you self update your application and need to re run with the latest version.

Notice that the current process exits only when the child process does, so you must make sure the current process does not run any further code.

Example:

```javascript
var selfupdate = require('selfupdate');

selfupdate.isUpdated(packageJSON, function(error, isUpdated) {
		if(error) throw error;

		if (!isUpdated) {
			selfupdate.update(packageJSON, function(error, version) {
				if(error) throw error;

				return selfupdate.restart();
		} else {
			console.log('Runinng the latest version!');
		}
});
```
