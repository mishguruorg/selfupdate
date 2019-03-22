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

// You can block a thread from running by making it await this promise
const BLOCK_THREAD = new Promise(() => false)

const updateCheckInterval = (key) => {
  const value = Number(Date.now()).toString()
  return cacache.put(CACHE, key, value)
}

const isBeyondCheckInterval = async (pkgName) => {
  const key = `last-check:${pkgName}`

  const ONE_HOUR = 1000

  let isBeyond = true
  try {
    const cacheObj = await cacache.get(CACHE, key)
    const time = Number(cacheObj.data.toString('utf8'))
    isBeyond = (time + ONE_HOUR) < Date.now()
  } catch (notFound) {
  }

  if (isBeyond) {
    await updateCheckInterval(key)
  }

  return isBeyond
}


const selfupdate = async (pkg) => {
  const shouldCheck = await isBeyondCheckInterval(pkg.name)

  if (shouldCheck === false) {
    return
  }

  const spinner = ora('Checking for updates').start()
  const latestVersion = await fetchLatestPackageVersion(pkg.name)

  const newVersionAvailable = cmp(pkg.version, latestVersion) < 0
  if (newVersionAvailable === false) {
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
    return BLOCK_THREAD
  } catch (error) {
    spinner.fail(`Error installing ${pkg.name} v${latestVersion}`)
    console.error({ error })
  }
}

export default selfupdate
