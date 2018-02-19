/* @flow */

import test from 'ava'
import stu from 'stu'

import packageJSON from '../package.json'

import gitwrapNpmInfo from './testHelpers/fixtures/npm-info/gitwrap.json'
import nplugmNpmInfo from './testHelpers/fixtures/npm-info/nplugm.json'

test.beforeEach((t) => {
  stu((mock, require) => {
    const fetchPackageInfo = mock('./fetchPackageInfo').default
    const fetchLatestPackageVersion = require('./fetchLatestPackageVersion').default

    t.context = {
      ...t.context,
      fetchPackageInfo,
      fetchLatestPackageVersion
    }
  }).mock()
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

test('should return the latest version', async (t) => {
  const { fetchPackageInfo, fetchLatestPackageVersion } = t.context

  fetchPackageInfo.resolves(gitwrapNpmInfo)

  const version = await fetchLatestPackageVersion(packageJSON.name)
  t.is(version, '1.1.0')
})

test('should return the latest version', async (t) => {
  const { fetchPackageInfo, fetchLatestPackageVersion } = t.context

  fetchPackageInfo.resolves(nplugmNpmInfo)

  const version = await await fetchLatestPackageVersion(packageJSON.name)
  t.is(version, '2.2.0')
})
