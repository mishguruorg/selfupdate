import test from 'ava'
import stu from 'stu'

import packageJSON from '../package.json'

test.beforeEach((t) => {
  stu((mock, require) => {
    const isUpdated = mock('./isUpdated').default
    const update = mock('./update').default
    const selfupdate = require('./selfupdate').default

    t.context = {
      ...t.context,
      isUpdated,
      update,
      selfupdate
    }
  }).mock()
})

test('should throw if no package json', async (t) => {
  const { selfupdate } = t.context

  t.plan(2)

  try {
    await selfupdate(null)
  } catch (error) {
    t.true(error instanceof Error)
    t.is(error.message, 'Missing package json')
  }
})

test('should throw if package json is not a plain object', async (t) => {
  const { selfupdate } = t.context

  t.plan(2)

  try {
    await selfupdate(123)
  } catch (error) {
    t.true(error instanceof Error)
    t.is(error.message, 'Invalid package json: 123')
  }
})

test('given the package is up to date it should return an error', async (t) => {
  const { isUpdated, selfupdate } = t.context

  isUpdated.resolves(true)

  t.plan(2)

  try {
    await selfupdate(packageJSON)
  } catch (error) {
    t.true(error instanceof Error)
    t.is(error.message, 'You\'re already running the latest version.')
  }
})

test('package is not up to date + update is successful => return the new version', async (t) => {
  const { isUpdated, update, selfupdate } = t.context

  isUpdated.resolves(false)
  update.resolves('1.0.0')

  const version = await selfupdate(packageJSON)
  t.is(version, '1.0.0')
})

test('package is not up to date + update returns an error => return the error', async (t) => {
  const { isUpdated, update, selfupdate } = t.context

  isUpdated.resolves(false)
  update.rejects(new Error('update error'))

  t.plan(2)

  try {
    await selfupdate(packageJSON)
  } catch (error) {
    t.true(error instanceof Error)
    t.is(error.message, 'update error')
  }
})
