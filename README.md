# @mishguru/selfupdate

A handful of functions to implement self updating for globally installed NPM
packages.

![]('./capture.gif')

## Installation

Add `@mishguru/selfupdate` to your project:

```sh
$ npm install --save @mishguru/selfupdate
```

## Example

The `selfupdate` function will automatically check the NPM registry for a new
version, and if it exists install it globally and live restart your app to use
the new version.

It's important that you run `selfupdate(pkg)` as soon as your app starts. You
must also await the promise it returns before doing anything else. Otherwise
both the old and new versions will run simultaneously.

```javascript
import { selfupdate } from '@mishguru/selfupdate'

import pkg from './package.json'

selfupdate(pkg).then(startMyApp)
```

## Advanced Example

If you want a full control over how the upgrade works, then you can use the
helper functions provided.

```javascript
import {
  fetchLatestPackageVersion,
  installPackageVersion,
  respawnProcess
} from '@mishguru/selfupdate'

import pkg from './package.json'

const latestVersion = await fetchLatestPackageVersion(pkg.name)

if (pkg.version !== latestVersion) {
  await installPackageVersion(pkg.name, latestVersion)

  console.log(`Upgraded from ${pkg.version} to ${latestVersion}. Restarting...`)

  respawnProcess()
}
```

Documentation
-------------

### selfupdate(package: object, options?: object): Promise&lt;void>

Automatically check for updates, and install and restart if they are available.

The options available are:

- `checkInterval`: The number of milliseconds to wait before querying the
  registry. Set to `0` to query every time. Default is 1 hour.

Example:

```javascript
import { selfupdate  } from '@mishguru/selfupdate'

import pkg from './package.json'

const start = async () => {
  await selfupdate(pkg, {
    checkInterval: 1 * 60 * 60 * 1000 // optional
  })

  console.log(`Running version ${pkg.version}`)
}

start().catch(console.error)
```

### fetchLatestPackageVersion(packageName: string): Promise&lt;string>

Find the latest version of a particular package.

Example:

```javascript
import { fetchLatestPackageVersion } from '@mishguru/selfupdate'

import pkg from './package.json'

const latestVersion = await fetchLatestPackageVersion(pkg.name)

console.log(`Current version: ${pkg.version}`)
console.log(`Latest version: ${latestVersion}`)
console.log(`Up to date?: ${latestVersion === pkg.version}`)
```

### installPackageVersion(packageName: string, packageVersion: string): Promise&lt;void>

Install a specific version of a package.

You can also pass a tag instaed of a version. For example, you can pass
`'latest'` to install the latest version on NPM.

Example:

```javascript
import { installPackageVersion } from '@mishguru/selfupdate'

import pkg from './package.json'

await installPackageVersion(pkg.name, '2.0.0')
```


### respawnProcess()

Restart the current process, based on `process.argv`.

This function is useful when you self update your application and need to re
run with the latest version.

Notice that the current process exits only when the child process does, so you
must make sure the current process does not run any further code.

Example:

```javascript
import { respawnProcess } from '@mishguru/selfupdate'

respawnProcess()
```
