/* @flow */

import fetchPackageInfo from './fetchPackageInfo'

/**
 * Get the latest available version of an NPM package
 */

const fetchLatestPackageVersion = async (packageName: string) => {
  const data = await fetchPackageInfo(packageName)
  const latestVersion = data['dist-tags'].latest
  return latestVersion
}

export default fetchLatestPackageVersion
