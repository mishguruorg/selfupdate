/* @flow */

import fetchPackageInfo from './fetchPackageInfo'

/**
 * Get the latest available version of an NPM package
 */

const fetchLatestPackageVersion = async (packageName: string) => {
  const data = await fetchPackageInfo(packageName)
  const versions = Object.keys(data)
  const latestVersion = versions[0]
  return latestVersion
}

export default fetchLatestPackageVersion
