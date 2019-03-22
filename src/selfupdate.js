import ora from 'ora'
import cmp from 'semver-compare'
import cacache from 'cacache'
import delay from 'delay'
import { tmpdir } from 'os'
import { join } from 'path'

import fetchLatestPackageVersion from './fetchLatestPackageVersion'
import installPackageVersion from './installPackageVersion'
import respawnProcess from './respawnProcess'

const CACHE = join(tmpdir(), 'selfupdate')
const DEFAULT_CHECK_INTERVAL = 1 * 60 * 60 * 1000

// You can block a thread from running by making it await this promise
const BLOCK_THREAD = new Promise(() => false)

const updateCheckInterval = (pkgName) => {
  const key = `last-check:${pkgName}`
  const value = Number(Date.now()).toString()
  return cacache.put(CACHE, key, value)
}

const isBeyondCheckInterval = async (pkgName, checkInterval) => {
  const key = `last-check:${pkgName}`

  try {
    const cacheObj = await cacache.get(CACHE, key)
    const time = Number(cacheObj.data.toString('utf8'))
    const isBeyond = (time + checkInterval) < Date.now()
    return isBeyond
  } catch (notFound) {
    return true
  }
}


const selfupdate = async (pkg, options = {}) => {
  const { checkInterval = DEFAULT_CHECK_INTERVAL } = options

  const shouldCheck = await isBeyondCheckInterval(pkg.name, checkInterval)
  if (shouldCheck === false) {
    return
  }

  const spinner = ora('Checking for updates').start()
  const latestVersion = await fetchLatestPackageVersion(pkg.name)

  const newVersionAvailable = cmp(pkg.version, latestVersion) < 0
  if (newVersionAvailable === false) {
    await updateCheckInterval(pkg.name)
    spinner.stop()
    return
  }
  spinner.info(`A new version of ${pkg.name} is available!`)

  try {
    spinner.start(`Installing ${pkg.name} v${latestVersion}`)
    await installPackageVersion(pkg.name, latestVersion)
    spinner.succeed(`Successfully installed ${pkg.name} v${latestVersion}.`)

    spinner.start(`Automatically loading new version`)
    await delay(3 * 1000)
    await respawnProcess()
    spinner.succeed(`You are now using the latest version :)`)
    await updateCheckInterval(pkg.name)
    return BLOCK_THREAD
  } catch (error) {
    spinner.fail(`Error installing ${pkg.name} v${latestVersion}`)
    throw error
  }
}

export default selfupdate
