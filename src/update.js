/* @flow */

import getLatestVersion from './getLatestVersion'
import getUpdateCommand from './getUpdateCommand'
import runCommand from './runCommand'

import type { $packageJSON } from './types'

/**
 * Update an NPM package
 */

const update = async (packageJSON: $packageJSON) => {
  const command = getUpdateCommand(packageJSON.name)
  const result = await runCommand(command)

  if (result.stderr != null) {
    throw new Error(result.stderr)
  }

  const version = await getLatestVersion(packageJSON.name)
  return version
}

export default update
