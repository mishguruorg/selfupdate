/* @flow */

import npmConfig from 'npm/lib/config/figgy-config'
import npa from 'npm-package-arg'
import npm from 'npm'
import pacote from 'pacote'
import { promisify } from 'util'

const loadAsync = promisify(npm.load)

/**
 * Get information about an NPM package
 */

const fetchPackageInfo = async (packageName: string) => {
  await loadAsync({
    loglevel: 'silent',
    global: true
  })

  const opts = npmConfig().concat({
    global: true,
    json: false,
    tag: 'latest',
    unicode: true
  })

  const info = await pacote.packument(npa(packageName), opts)

  return info
}

export default fetchPackageInfo

