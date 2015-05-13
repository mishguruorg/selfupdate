selfupdate
----------

[![npm version](https://badge.fury.io/js/selfupdate.svg)](http://badge.fury.io/js/selfupdate)
[![dependencies](https://david-dm.org/jviotti/selfupdate.png)](https://david-dm.org/jviotti/selfupdate.png)
[![Build Status](https://travis-ci.org/jviotti/selfupdate.svg?branch=master)](https://travis-ci.org/jviotti/selfupdate)

Selfupdate your global NPM package.

Installation
------------

Install `selfupdate` by running:

```sh
$ npm install --save selfupdate
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

Tests
-----

Run the test suite by doing:

```sh
$ gulp test
```

Contribute
----------

- Issue Tracker: [github.com/jviotti/selfupdate/issues](https://github.com/jviotti/selfupdate/issues)
- Source Code: [github.com/jviotti/selfupdate](https://github.com/jviotti/selfupdate)

Before submitting a PR, please make sure that you include tests, and that [coffeelint](http://www.coffeelint.org/) runs without any warning:

```sh
$ gulp lint
```

Support
-------

If you're having any problem, please [raise an issue](https://github.com/jviotti/selfupdate/issues/new) on GitHub.

ChangeLog
---------

### v1.1.0

- [feature] Expose selfupdate.isUpdated()

License
-------

The project is licensed under the MIT license.
