/* @flow */

import test from 'ava'
import stu from 'stu'

import packageJSON from '../package.json'

test.beforeEach((t) => {
  stu((mock, require) => {
    const runCommand = mock('./runCommand').default
    const getLatestVersion = mock('./getLatestVersion').default
    const update = require('./update').default

    t.context = {
      ...t.context,
      runCommand,
      getLatestVersion,
      update
    }
  }).mock()
})

test('given running the command returns an error', async (t) => {
  const { runCommand, update } = t.context

  runCommand.rejects(new Error('npm error'))

  t.plan(2)

  try {
    await update(packageJSON)
  } catch (error) {
    t.true(error instanceof Error)
    t.is(error.message, 'npm error')
  }
})

test('given running the command prints to stderr => reject with stderr', async (t) => {
  const { runCommand, update } = t.context

  runCommand.resolves({ sdout: 'stdout', stderr: 'stderr' })

  t.plan(2)

  try {
    await update(packageJSON)
  } catch (error) {
    t.true(error instanceof Error)
    t.is(error.message, 'stderr')
  }
})

test('successful command + error fetching version => reject with error', async (t) => {
  const { runCommand, getLatestVersion, update } = t.context

  runCommand.resolves({ stdout: 'stdout', stderr: null })

  getLatestVersion.rejects(new Error('npm error'))

  t.plan(2)

  try {
    await update(packageJSON)
  } catch (error) {
    t.true(error instanceof Error)
    t.is(error.message, 'npm error')
  }
})

test('successful command + successful version fetch => resolve version', async (t) => {
  const { runCommand, getLatestVersion, update } = t.context

  runCommand.resolves({ stdout: 'stdout', stderr: null })
  getLatestVersion.resolves('2.0.0')

  const version = await update(packageJSON)
  t.is(version, '2.0.0')
})

test('successful command + successful version fetch => run correct command', async (t) => {
  const { runCommand, getLatestVersion, update } = t.context

  runCommand.resolves({ stdout: 'stdout', stderr: null })
  getLatestVersion.resolves('2.0.0')

  await update(packageJSON)

  t.deepEqual(runCommand.args, [[
    'npm install --silent --global @mishguru/selfupdate'
  ]])
})
