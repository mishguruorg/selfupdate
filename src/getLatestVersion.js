/* @flow */

import getInfo from './getInfo'

/**
 * Get the latest available version of an NPM package
 */

const getLatestVersion = async (packageName: string) => {
  const data = await getInfo(packageName)
  const versions = Object.keys(data)
  const latestVersion = versions[0]
  return latestVersion
}

export default getLatestVersion
