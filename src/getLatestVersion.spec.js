/* @flow */

import test from 'ava'
import stu from 'stu'

import packageJSON from '../package.json'

import gitwrapNpmInfo from './testHelpers/fixtures/npm-info/gitwrap'
import nplugmNpmInfo from './testHelpers/fixtures/npm-info/nplugm'

test.beforeEach((t) => {
  stu((mock, require) => {
    const getInfo = mock('./getInfo').default
    const getLatestVersion = require('./getLatestVersion').default

    t.context = {
      ...t.context,
      getInfo,
      getLatestVersion
    }
  }).mock()
})

test('should throw an error', async (t) => {
  const { getInfo, getLatestVersion } = t.context

  getInfo.rejects(new Error('npm error'))

  t.plan(2)

  try {
    await getLatestVersion(packageJSON.name)
  } catch (error) {
    t.true(error instanceof Error)
    t.is(error.message, 'npm error')
  }
})

test('should return the latest version', async (t) => {
  const { getInfo, getLatestVersion } = t.context

  getInfo.resolves(gitwrapNpmInfo)

  const version = await getLatestVersion(packageJSON.name)
  t.is(version, '1.1.0')
})

test('should return the latest version', async (t) => {
  const { getInfo, getLatestVersion } = t.context

  getInfo.resolves(nplugmNpmInfo)

  const version = await await getLatestVersion(packageJSON.name)
  t.is(version, '2.2.0')
})
