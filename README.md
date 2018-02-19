@mishguru/selfupdate
====================

A handful of functions to implement self updating for globally installed NPM
packages.

Installation
------------

Add `@mishguru/selfupdate` to your project:

```sh
$ npm install --save @mishguru/selfupdate
```

Example
-------

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

### fetchLatestPackageVersion(packageName: string): Promise<string>

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

### installPackageVersion(packageName: string, packageVersion: string): Promise<void>

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
