@mishguru/selfupdate
--------------------

Selfupdate your global NPM package.

Installation
------------

Install `selfupdate` by running:

```sh
$ npm install --save @mishguru/selfupdate
```

Example Usage
-------------

```javascript
import { update, isUpdated } from '@mishguru/selfupdate'

import packageJSON from '../package.json'

const { name, version } = packageJSON

const selfupdate = async () => {
  console.log(`[${version}] Checking to see if there is a new version available...`)

  const runningLatestVersion = await isUpdated(packageJSON)
  if (!runningLatestVersion) {
    console.log(`[${version}] Found a new version! Attempting to update...`)

    const version = await update(packageJSON)

    console.log(`${name} v${version} has been installed!`)
  } else {
    console.log(`${name} v${packageJSON.version} is the latest version.`)
  }
}

export default selfupdate
```

Documentation
-------------

### selfupdate.update(Object packageJSON)

Update a globally installed NPM package.

If the installation fails with a permission related error, the module will
attempt to elevate privileges automatically.

The function requires the `package.json`, which you can require like:

```javascript
import packageJSON from './package.json'
```

A promise is returned, which will resolve with new version of the package after
the update took place.

Example:

```javascript
import * as selfupdate from '@mishguru/selfupdate'

import packageJSON from './package.json'

const version = await selfupdate.update(packageJSON)

console.log('The package was updated to version: ' + version)
```

### selfupdate.isUpdated(Object packageJSON)

Check if a global package is in the latest version.

The function requires the `package.json`, which you can require like:

```javascript
import packageJSON from './package.json'
```

A promise is returned, which will resolve with a `Boolean` that determines if
the package is up to date.

Example:

```javascript
import * as selfupdate from '@mishguru/selfupdate'

import packageJSON from './package.json'

const isUpdated = await selfupdate.isUpdated(packageJSON)

console.log('Is the package up to date? ' + isUpdated)
```

### selfupdate.restart()

Restart the current process, based on `process.argv`.

This function is useful when you self update your application and need to re
run with the latest version.

Notice that the current process exits only when the child process does, so you
must make sure the current process does not run any further code.

Example:

```javascript
import * as selfupdate from '@mishguru/selfupdate'

const isUpdated = await selfupdate.isUpdated(packageJSON)

if (!isUpdated) {
  const version = await selfupdate.update(packageJSON)
  selfupdate.restart()
  return
} else {
  console.log('Running the latest version!')
}
```
