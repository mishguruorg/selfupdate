/* @flow */

import getLatestVersion from './getLatestVersion'

import type { $packageJSON } from './types'

/**
 * Checks that a package is on the latest version
 */

const isUpdated = async (packageJSON: $packageJSON) => {
  const latestVersion = await getLatestVersion(packageJSON.name)
  return packageJSON.version === latestVersion
}

export default isUpdated
