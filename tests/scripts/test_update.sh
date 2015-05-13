#!/bin/bash

function assert_version() {
	local version="$1"
	local current="`selfupdate-test`"

	if [ $current != $version ]; then
		echo "ERROR: Expected version $current to equal $version"
		exit 1
	fi
}

echo "Installing package"
npm install --silent --global selfupdate-test@1.0.0

echo "Checking current version"
assert_version "1.0.0"

echo "Updating"
node << EOF

var assert = require('assert');
var selfupdate = require('./build/selfupdate');

selfupdate.update({
	name: 'selfupdate-test',
	version: '1.0.0'
}, function(error, version) {
	if(error) {
		console.error(error.message);
		process.exit(1);
	}

	console.log('Checking updated version result from NodeJS')
	assert(version === '2.0.0', 'ERROR: Expected version ' + version + ' to equal 2.0.0');
});

EOF

echo "Checking updated version"
assert_version "2.0.0"

echo "DONE"
