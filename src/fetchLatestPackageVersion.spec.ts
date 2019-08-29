import anyTest, { TestInterface } from 'ava'
import * as stu from 'stu'
import { SinonStub } from 'sinon'

const packageJSON = require('../package.json')

import gitwrapNpmInfo from './testHelpers/fixtures/npm-info/gitwrap.json'
import nplugmNpmInfo from './testHelpers/fixtures/npm-info/nplugm.json'

const test = anyTest as TestInterface<{
  fetchPackageInfo: SinonStub,
  fetchLatestPackageVersion: (packageName: string) => Promise<string>,
}>

test.beforeEach((t) => {
  const fetchPackageInfo = stu.mock('./fetchPackageInfo').default
  const fetchLatestPackageVersion = stu.test('./fetchLatestPackageVersion')
    .default

  t.context = {
    ...t.context,
    fetchPackageInfo,
    fetchLatestPackageVersion,
  }
})

test('should throw an error', async (t) => {
  const { fetchPackageInfo, fetchLatestPackageVersion } = t.context

  fetchPackageInfo.rejects(new Error('npm error'))

  t.plan(2)

  try {
    await fetchLatestPackageVersion(packageJSON.name)
  } catch (error) {
    t.true(error instanceof Error)
    t.is(error.message, 'npm error')
  }
})

test('should return the latest version for gitwrap', async (t) => {
  const { fetchPackageInfo, fetchLatestPackageVersion } = t.context

  fetchPackageInfo.resolves(gitwrapNpmInfo)

  const version = await fetchLatestPackageVersion(packageJSON.name)
  t.is(version, '1.1.0')
})

test('should return the latest version fro nplug', async (t) => {
  const { fetchPackageInfo, fetchLatestPackageVersion } = t.context

  fetchPackageInfo.resolves(nplugmNpmInfo)

  const version = await await fetchLatestPackageVersion(packageJSON.name)
  t.is(version, '3.0.5')
})
