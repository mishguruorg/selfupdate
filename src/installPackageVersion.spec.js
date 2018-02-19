/* @flow */

import test from 'ava'
import stu from 'stu'

const NAME = '@mishguru/selfupdate'
const VERSION = '1.0.0'

test.beforeEach((t) => {
  stu((mock, require) => {
    const exec = mock('child-process-es6-promise').exec
    const installPackageVersion = require('./installPackageVersion').default

    t.context = {
      ...t.context,
      exec,
      installPackageVersion
    }
  }).mock()
})

test('given running the command returns an error', async (t) => {
  const { exec, installPackageVersion } = t.context

  exec.rejects(new Error('npm error'))

  t.plan(2)

  try {
    await installPackageVersion(NAME, VERSION)
  } catch (error) {
    t.true(error instanceof Error)
    t.is(error.message, 'npm error')
  }
})

test('given running the command prints to stderr => reject with stderr', async (t) => {
  const { exec, installPackageVersion } = t.context

  exec.resolves({ sdout: 'stdout', stderr: 'stderr' })

  t.plan(2)

  try {
    await installPackageVersion(NAME, VERSION)
  } catch (error) {
    t.true(error instanceof Error)
    t.is(error.message, 'stderr')
  }
})
