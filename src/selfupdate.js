import isUpdated from './isUpdated'
import update from './update'

/**
 * This function performs a global NPM
 * update and yields back the new version
 */

const selfupdate = async (packageJSON) => {
  if (packageJSON == null) {
    throw new Error('Missing package json')
  }

  if (
    typeof packageJSON !== 'object' ||
    typeof packageJSON.name !== 'string' ||
    typeof packageJSON.version !== 'string'
  ) {
    throw new Error('Invalid package json: ' + packageJSON)
  }

  const runningLatestVersion = await isUpdated(packageJSON)

  if (runningLatestVersion) {
    throw new Error('You\'re already running the latest version.')
  }

  return update(packageJSON)
}

export default selfupdate
