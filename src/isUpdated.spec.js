import test from 'ava'
import stu from 'stu'

test.beforeEach((t) => {
  stu((mock, require) => {
    const getLatestVersion = mock('./getLatestVersion').default
    const packageJSON = mock('../package.json')
    const isUpdated = require('./isUpdated').default

    t.context = {
      ...t.context,
      getLatestVersion,
      packageJSON,
      isUpdated
    }
  }).mock()
})

test('given there is an error trying to get the latest version', async (t) => {
  const { packageJSON, getLatestVersion, isUpdated } = t.context

  getLatestVersion.rejects(new Error('npm error'))

  t.plan(2)

  try {
    await isUpdated(packageJSON)
  } catch (error) {
    t.true(error instanceof Error)
    t.is(error.message, 'npm error')
  }
})

test('if the current version equals the latest version', async (t) => {
  const { packageJSON, getLatestVersion, isUpdated } = t.context

  getLatestVersion.resolves('2.0.0')
  packageJSON.version = '2.0.0'

  const latestVersionInstalled = await isUpdated(packageJSON)
  t.true(latestVersionInstalled)
})

test('if the current version does not equal the latest version', async (t) => {
  const { packageJSON, isUpdated } = t.context

  packageJSON.version = '1.0.0'

  const latestVersionInstalled = await isUpdated(packageJSON)
  t.false(latestVersionInstalled)
})
