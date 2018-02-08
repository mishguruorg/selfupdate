/* @flow */

import npm from 'npm'
import { promisify } from 'util'

const loadAsync = promisify(npm.load)

/**
 * Get information about an NPM package
 */

const getInfo = async (packageName: string) => {
  await loadAsync({
    loglevel: 'silent',
    global: true
  })

  const viewCommandAsync = promisify(npm.commands.view)

  const info = await viewCommandAsync([packageName], true)
  return info
}

export default getInfo
